/* eslint-disable no-underscore-dangle */

import addons from '@storybook/addons';
import stringify from 'json-stringify-safe';
import uuid from 'uuid/v1';
import { EVENT_ID } from './';

function _format(arg) {
  if (arg && typeof arg.preventDefault !== 'undefined') {
    return stringify('[SyntheticEvent]');
  }
  return stringify(arg);
}

export function action(name) {
  // eslint-disable-next-line no-shadow
  const handler = function action(..._args) {
    const args = _args.map(_format);
    const channel = addons.getChannel();
    const id = uuid();
    channel.emit(EVENT_ID, {
      id,
      data: { name, args },
    });
  };

  // IE11 may return an undefined descriptor, but it supports Function#name
  const nameDescriptor = Object.getOwnPropertyDescriptor(handler, 'name');
  // This condition is true in modern browsers that implement Function#name properly
  const canConfigureName = !nameDescriptor || nameDescriptor.configurable;

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
