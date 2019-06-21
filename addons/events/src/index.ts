import addons from '@storybook/addons';
import CoreEvents from '@storybook/core-events';
import deprecate from 'util-deprecate';

import { EVENTS } from './constants';

let prevEvents: any;
let currentEmit: any;

const onEmit = (event: any) => {
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

const addEvents = ({ emit, events }: any) => {
  if (prevEvents !== events) {
    addons.getChannel().emit(EVENTS.ADD, events);
    prevEvents = events;
  }
  currentEmit = emit;
  addons.getChannel().emit(CoreEvents.REGISTER_SUBSCRIPTION, subscription);
};

const WithEvents = deprecate(({ children, ...options }: any) => {
  addEvents(options);
  return children;
}, `<WithEvents> usage is deprecated, use .addDecorator(withEvents({emit, events})) instead`);

export default (options: any) => {
  if (options.children) {
    return WithEvents(options);
  }
  return (storyFn: any) => {
    addEvents(options);
    return storyFn();
  };
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
