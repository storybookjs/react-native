import uuid from 'uuid/v1';
import { addons } from '@storybook/addons';
import { EVENT_ID } from '../constants';
import { ActionDisplay, ActionOptions, HandlerFunction } from '../models';

export function action(name: string, options: ActionOptions = {}): HandlerFunction {
  const actionOptions = {
    ...options,
  };

  const handler = function actionHandler(...args: any[]) {
    const channel = addons.getChannel();
    const id = uuid();
    const minDepth = 5; // anything less is really just storybook internals

    const actionDisplayToEmit: ActionDisplay = {
      id,
      count: 0,
      data: { name, args },
      options: {
        ...actionOptions,
        depth: minDepth + (actionOptions.depth || 3),
      },
    };
    channel.emit(EVENT_ID, actionDisplayToEmit);
  };

  return handler;
}
