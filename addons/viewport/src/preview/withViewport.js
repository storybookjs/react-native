import addons, { makeDecorator } from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import {
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  VIEWPORT_CHANGED_EVENT_ID,
  DEFAULT_VIEWPORT,
} from '../shared';

function noop() {}
let handler = noop;

const callHandler = (...args) => handler(...args);

const subscription = () => {
  const channel = addons.getChannel();
  channel.on(VIEWPORT_CHANGED_EVENT_ID, callHandler);
  return () => channel.removeListener(VIEWPORT_CHANGED_EVENT_ID, callHandler);
};

const applyViewportOptions = (options = {}) => {
  const channel = addons.getChannel();

  handler = options.onViewportChange || noop;
  if (options.onViewportChange) {
    channel.emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
  }

  channel.emit(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, options.name || DEFAULT_VIEWPORT);
};

const withViewport = makeDecorator({
  name: 'withViewport',
  parameterName: 'viewport',
  wrapper: (getStory, context, { options, parameters }) => {
    const storyOptions = parameters || options;
    const viewportOptions =
      typeof storyOptions === 'string' ? { name: storyOptions } : storyOptions;

    if (viewportOptions) {
      applyViewportOptions(viewportOptions);
    }

    return getStory(context);
  },
});

export default withViewport;

export const Viewport = deprecate(({ children, ...options }) => {
  applyViewportOptions(options);
  return children;
}, `<Viewport> usage is deprecated, use .addParameters({ viewport }) instead`);
