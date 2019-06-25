import { ReactNode } from 'react';

import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import { EVENTS } from './constants';

let prevEvents: Event[];
let currentEmit: (name: string, payload: unknown) => void;

export interface OnEmitEvent {
  name: string;
  payload: unknown;
}

const onEmit = (event: OnEmitEvent) => {
  currentEmit(event.name, event.payload);
};

const subscription = () => {
  const channel = addons.getChannel();
  channel.on(EVENTS.EMIT, onEmit);
  return () => {
    prevEvents = null;
    addons.getChannel().emit(EVENTS.ADD, []);
    channel.removeListener(EVENTS.EMIT, onEmit);
  };
};

const addEvents = ({ emit, events }: Options) => {
  if (prevEvents !== events) {
    addons.getChannel().emit(EVENTS.ADD, events);
    prevEvents = events;
  }
  currentEmit = emit;
  addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
};

export interface Event {
  name: string;
  title: string;
  payload: unknown;
}

interface Options {
  children?: ReactNode;
  emit: (eventName: string, ...args: any) => void;
  events: Event[];
}

const WithEvents = deprecate(({ children, ...options }: Options) => {
  addEvents(options);
  return children;
}, `<WithEvents> usage is deprecated, use .addDecorator(withEvents({emit, events})) instead`);

export default (options: Options) => {
  if (options.children) {
    return WithEvents(options);
  }
  return (storyFn: () => ReactNode) => {
    addEvents(options);
    return storyFn();
  };
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
