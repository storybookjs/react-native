// TODO remove in 6.0
import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import { EVENTS } from './constants';

let prevEvents;
let currentEmit;

const onEmit = event => {
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

const addEvents = ({ emit, events }) => {
  if (prevEvents !== events) {
    addons.getChannel().emit(EVENTS.ADD, events);
    prevEvents = events;
  }
  currentEmit = emit;
  addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
};

export const WithEvents = deprecate(({ children, ...options }) => {
  addEvents(options);
  return children;
}, `<WithEvents> usage is deprecated, use .addDecorator(withEvents({emit, events})) instead`);
