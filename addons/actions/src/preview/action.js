import uuid from 'uuid/v1';
import addons from '@storybook/addons';
import { EVENT_ID } from '../constants';

export default function action(name, options = {}) {
  const actionOptions = {
    ...options,
  };

  // eslint-disable-next-line no-shadow
  const handler = function action(...args) {
    const channel = addons.getChannel();
    const id = uuid();
    channel.emit(EVENT_ID, {
      id,
      data: { name, args },
      options: actionOptions,
    });
  };

  return handler;
}
