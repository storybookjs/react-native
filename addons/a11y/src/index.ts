import { document } from 'global';
import axe, { AxeResults, ElementContext, RunOptions, Spec } from 'axe-core';
import deprecate from 'util-deprecate';
import dedent from 'ts-dedent';

import addons, { makeDecorator } from '@storybook/addons';
import { EVENTS, PARAM_KEY } from './constants';

let progress = Promise.resolve();
interface Setup {
  element?: ElementContext;
  config: Spec;
  options: RunOptions;
}
let setup: Setup = { element: undefined, config: {}, options: {} };

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = (input: AxeResults) => addons.getChannel().emit(EVENTS.RESULT, input);

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
          ({
            restoreScroll: true,
          } as RunOptions) // cast to RunOptions is necessary because axe types are not up to date
      )
      .then(report)
      .catch(error => addons.getChannel().emit(EVENTS.ERROR, String(error)));
  });
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

let storedDefaultSetup: Setup | null = null;

export const withA11y = makeDecorator({
  name: 'withA11Y',
  parameterName: PARAM_KEY,
  wrapper: (getStory, context, { parameters }) => {
    if (parameters) {
      if (storedDefaultSetup === null) {
        storedDefaultSetup = { ...setup };
      }
      Object.assign(setup, parameters as Setup);
    } else if (storedDefaultSetup !== null) {
      Object.assign(setup, storedDefaultSetup);
      storedDefaultSetup = null;
    }
    addons
      .getChannel()
      .on(EVENTS.REQUEST, () => run(setup.element as ElementContext, setup.config, setup.options));

    return getStory(context);
  },
});

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
  dedent`
    configureA11y is deprecated, please configure addon-a11y using the addParameter api:
    
    addParameters({
      a11y: {
        // ... axe options
        element: '#root', // optional selector which element to inspect
      },
    });
  `
);
