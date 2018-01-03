/* eslint-disable no-underscore-dangle */

import addons from '@storybook/addons';
import uuid from 'uuid/v1';
import { EVENT_ID } from './';
import { decycle } from './lib';
import { canConfigureName } from './lib/util';

export function action(name) {
  // eslint-disable-next-line no-shadow
  const handler = function action(..._args) {
    const args = _args.map(arg => {
      let result;

      try {
        result = JSON.stringify(decycle(arg));
      } catch (error) {
        // IE still cyclic.

        return JSON.stringify(error.toString());
      }

      return result;
    });
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
