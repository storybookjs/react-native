import uuid from 'uuid/v1';
import addons from '@storybook/addons';
import { EVENT_ID } from '../';
import { canConfigureName, prepareArguments } from '../lib/util';

export default function action(name) {
  // eslint-disable-next-line no-shadow
  const handler = function action(..._args) {
    const args = _args.map(prepareArguments);
    const channel = addons.getChannel();
    const id = uuid();
    channel.emit(EVENT_ID, {
      id,
      data: { name, args },
    });
  };

  if (canConfigureName && name && typeof name === 'string') {
    Object.defineProperty(handler, 'name', { value: name });
  }
  return handler;
}
