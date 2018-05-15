import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import {
  SET_STORY_DEFAULT_VIEWPORT_EVENT_ID,
  VIEWPORT_CHANGED_EVENT_ID,
  DEFAULT_VIEWPORT,
} from '../shared';

function noop() {}
let handler = noop;

const subscription = () => {
  const channel = addons.getChannel();
  channel.on(VIEWPORT_CHANGED_EVENT_ID, handler);
  return () => channel.removeListener(VIEWPORT_CHANGED_EVENT_ID, handler);
};

const setViewport = options => {
  const channel = addons.getChannel();
  handler = options.onViewportChange || noop;
  if (options.onViewportChange) {
    channel.emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
  }
  channel.emit(SET_STORY_DEFAULT_VIEWPORT_EVENT_ID, options.name || DEFAULT_VIEWPORT);
};

export default function withViewport(nameOrOptions) {
  const options = typeof nameOrOptions === 'string' ? { name: nameOrOptions } : nameOrOptions;

  return (story, context) => {
    const decorated = () => {
      setViewport(options);
      return story();
    };

    // Absent context means a direct call, withViewport(viewport)(storyFn)
    return context ? decorated() : decorated;
  };
}

export const Viewport = deprecate(({ children, ...options }) => {
  setViewport(options);
  return children;
}, `<Viewport> usage is deprecated, use .addDecorator(withViewport(viewport)) instead`);
