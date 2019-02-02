import uuid from 'uuid/v1';
import { addons } from '@storybook/addons';
import { EVENT_ID } from '../constants';

export function action(name: any, options = {}) {
  const actionOptions = {
    ...options,
  };

  // tslint:disable-next-line:no-shadowed-variable
  const handler = function action(...args: any[]) {
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
