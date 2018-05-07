import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';

import { EVENTS } from './constants';

let prevEvents;
let currentEmit;

const onEmit = event => {
  currentEmit(event.name, event.payload);
};

const subscription = () => {
  const channel = addons.getChannel();
  channel.on(EVENTS.EMIT, onEmit);
  return () => channel.removeListener(EVENTS.EMIT, onEmit);
};

export default ({ emit, events }) => story => {
  if (prevEvents !== events) {
    addons.getChannel().emit(EVENTS.ADD, events);
    prevEvents = events;
  }
  currentEmit = emit;
  addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
  return story();
};
