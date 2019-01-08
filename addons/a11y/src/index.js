import { document } from 'global';
import axe from 'axe-core';
import deprecate from 'util-deprecate';
import addons, { makeDecorator } from '@storybook/addons';
import { STORY_RENDERED } from '@storybook/core-events';
import EVENTS, { PARAM_KEY } from './constants';

const channel = addons.getChannel();
let progress = Promise.resolve();
let options;

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

const run = ({ element, ...o }) => {
  progress = progress.then(() => {
    axe.reset();
    if (o) {
      axe.configure(o);
    }
    return axe.run(element || getElement()).then(report);
  });
};

export const withA11Y = makeDecorator({
  name: 'withA11Y',
  parameterName: PARAM_KEY,
  skipIfNoParametersOrOptions: false,
  allowDeprecatedUsage: false,

  wrapper: (getStory, context, opt) => {
    options = opt.parameters || opt.options;

    return getStory(context);
  },
});

channel.on(STORY_RENDERED, () => run(options));
channel.on(EVENTS.REQUEST, () => run(options));

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

// REMOVE at 6.0.0
export const checkA11y = deprecate(
  (...args) => withA11Y(...args),
  'checkA11y has been replaced with withA11Y'
);
