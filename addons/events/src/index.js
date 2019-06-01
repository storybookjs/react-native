import addons from '@storybook/addons';
import { useEffect } from '@storybook/client-api';
import { WithEvents } from './deprecated';

import { EVENTS } from './constants';

const subscription = emit => {
  const channel = addons.getChannel();
  const onEmit = event => {
    emit(event.name, event.payload);
  };
  channel.on(EVENTS.EMIT, onEmit);
  return () => channel.removeListener(EVENTS.EMIT, onEmit);
};

const addEvents = ({ emit, events }) => {
  useEffect(() => {
    addons.getChannel().emit(EVENTS.ADD, events);
    return () => addons.getChannel().emit(EVENTS.ADD, []);
  }, [events]);
  useEffect(() => subscription(emit), [emit]);
};

export default options => {
  if (options.children) {
    return WithEvents(options);
  }
  return storyFn => {
    addEvents(options);
    return storyFn();
  };
};

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
