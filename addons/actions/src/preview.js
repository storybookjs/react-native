/* eslint-disable no-underscore-dangle */

import addons from '@storybook/addons';
import uuid from 'uuid/v1';
import { EVENT_ID } from './';
import { decycle } from './util';

export function action(name) {
  // eslint-disable-next-line no-unused-vars, func-names
  const handler = function(..._args) {
    const args = Array.from(_args).map(arg => JSON.stringify(decycle(arg)));
    const channel = addons.getChannel();
    const id = uuid();
    channel.emit(EVENT_ID, {
      id,
      data: { name, args },
    });
  };

  const fnName = name && typeof name === 'string' ? name.replace(/\W+/g, '_') : 'action';
  Object.defineProperty(handler, 'name', { value: fnName });
  return handler;
}

export function decorateAction(decorators) {
  // eslint-disable-next-line no-unused-vars, func-names
  return function(name) {
    const callAction = action(name);
    // eslint-disable-next-line no-unused-vars, func-names
    return function(..._args) {
      const decorated = decorators.reduce((args, fn) => fn(args), _args);
      callAction(...decorated);
    };
  };
}
