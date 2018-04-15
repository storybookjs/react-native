import uuid from 'uuid/v1';
import addons from '@storybook/addons';
import { EVENT_ID } from '../';
import { canConfigureName, prepareArguments } from '../lib/util';
import { config } from './configureActions';

export default function action(name, options = {}) {
  const actionOptions = {
    ...config,
    ...options,
  };

  // eslint-disable-next-line no-shadow
  const handler = function action(..._args) {
    const args = _args.map(arg => prepareArguments(arg, actionOptions.depth));
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
