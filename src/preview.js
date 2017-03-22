import addons from '@kadira/storybook-addons';
import stringify from 'json-stringify-safe';
import { EVENT_ID } from './';

function _format(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return stringify('[SyntheticEvent]');
  }
  return stringify(arg);
}

export function action(name) {

  const handler = function (..._args) {
    const args = Array.from(_args).map(_format);
    const channel = addons.getChannel();
    const randomId = Math.random().toString(16).slice(2);
    channel.emit(EVENT_ID, {
      id: randomId,
      data: { name, args },
    });
  };

  // some day when {[name]: function() {}} syntax is not transpiled by babel
  // we can get rid of this eval as by ES2015 spec the above function gets the
  // name `name`, but babel transpiles to Object.defineProperty which doesn't do
  // the same.
  //
  // Ref: https://bocoup.com/weblog/whats-in-a-function-name
  const fnName = name ? name.replace(/\W+/g,'_') : 'action';
  const named = eval(`(function ${fnName}() { return handler.apply(this, arguments) })`)
  return named
}

export function decorateAction(decorators) {
  return function (name) {
    const callAction = action(name);
    return function (..._args) {
      const decorated = decorators.reduce((args, fn) => fn(args), _args);
      callAction(...decorated);
    };
  };
}
