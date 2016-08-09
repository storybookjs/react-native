import addons from '@kadira/storybook-addons';
import { EVENT_ID } from './';

function _format(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return '[SyntheticEvent]';
  }
  return arg;
}

export function action(name) {
  return function (..._args) {
    const args = Array.from(_args).map(_format);
    const channel = addons.getChannel();
    const randomId = Math.random().toString(16).slice(2);
    channel.emit(EVENT_ID, {
      id: randomId,
      data: { name, args },
    });
  };
}
