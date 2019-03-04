import { document } from 'global';
import axe from 'axe-core';
import deprecate from 'util-deprecate';
import { stripIndents } from 'common-tags';

import addons from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';

const channel = addons.getChannel();
let progress = Promise.resolve();
let setup = {};

const getElement = () => {
  const storyRoot = document.getElementById('story-root');

  if (storyRoot) {
    return storyRoot.children;
  }
  return document.getElementById('root');
};

const report = input => {
  channel.emit(EVENTS.RESULT, input);
};

const run = (config, options) => {
  progress = progress.then(() => {
    axe.reset();
    if (config) {
      axe.configure(config);
    }
    return axe
      .run(
        getElement(),
        options || {
          restoreScroll: true,
        }
      )
      .then(report);
  });
};

// NOTE: we should add paramaters to the STORY_RENDERED event and deprecate this
export const withA11y = (getStory, context) => {
  const params = context.parameters[PARAM_KEY];
  if (params) {
    setup = params;
  }
  return getStory(context);
};

channel.on(STORY_RENDERED, () => run(setup.config, setup.options));
channel.on(EVENTS.REQUEST, () => run(setup.config, setup.options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// TODO: REMOVE at v6.0.0
export const withA11Y = deprecate(
  (...args) => withA11y(...args),
  'withA11Y has been renamed withA11y'
);

// TODO: REMOVE at v6.0.0
export const checkA11y = deprecate(
  (...args) => withA11y(...args),
  'checkA11y has been renamed withA11y'
);

// TODO: REMOVE at v6.0.0
export const configureA11y = deprecate(
  config => {
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
