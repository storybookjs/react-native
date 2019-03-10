import { document } from 'global';
import axe, { AxeResults, ElementContext, RunOptions, Spec } from 'axe-core';
import deprecate from 'util-deprecate';
import { stripIndents } from 'common-tags';

import addons, { StoryWrapper } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import { EVENTS, PARAM_KEY } from './constants';

const channel = addons.getChannel();
let progress = Promise.resolve();
let setup: {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
} = { element: null, config: {}, options: {} };

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = (input: AxeResults) => {
  channel.emit(EVENTS.RESULT, input);
};

const run = (element: ElementContext, config: Spec, options: RunOptions) => {
  progress = progress.then(() => {
    axe.reset();
    if (config) {
      axe.configure(config);
    }
    return axe
      .run(
        element || getElement(),
        options ||
          // tslint:disable-next-line:no-object-literal-type-assertion
          ({
            restoreScroll: true,
          } as RunOptions) // cast to RunOptions is necessary because axe types are not up to date
      )
      .then(report);
  });
};

// NOTE: we should add paramaters to the STORY_RENDERED event and deprecate this
export const withA11y: StoryWrapper = (getStory, context) => {
  const params = context.parameters[PARAM_KEY];
  if (params) {
    setup = params;
  }
  return getStory(context);
};

channel.on(STORY_RENDERED, () => run(setup.element, setup.config, setup.options));
channel.on(EVENTS.REQUEST, () => run(setup.element, setup.config, setup.options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// TODO: REMOVE at v6.0.0
export const withA11Y = deprecate(
  // @ts-ignore
  (...args: any[]) => withA11y(...args),
  'withA11Y has been renamed withA11y'
);

// TODO: REMOVE at v6.0.0
export const checkA11y = deprecate(
  // @ts-ignore
  (...args: any[]) => withA11y(...args),
  'checkA11y has been renamed withA11y'
);

// TODO: REMOVE at v6.0.0
export const configureA11y = deprecate(
  (config: any) => {
    setup = config;
  },
  stripIndents`
    configureA11y is deprecated, please configure addon-a11y using the addParameter api:
    
    addParameters({
      a11y: {
        // ... axe options
        element: '#root', // optional selector which element to inspect
      },
    });
  `
);
