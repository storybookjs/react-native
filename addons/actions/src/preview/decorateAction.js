import action from './action';
import actions from './actions';
import { createDecorator } from './withActions';

function applyDecorators(decorators, actionCallback) {
  return (..._args) => {
    const decorated = decorators.reduce((args, fn) => fn(args), _args);
    actionCallback(...decorated);
  };
}

export function decorateAction(decorators) {
  return (name, options) => {
    const callAction = action(name, options);
    return applyDecorators(decorators, callAction);
  };
}

export function decorate(decorators) {
  const decorated = decorateAction(decorators);
  const decoratedActions = (...args) => {
    const rawActions = actions(...args);
    const actionsObject = {};
    Object.keys(rawActions).forEach(name => {
      actionsObject[name] = applyDecorators(decorators, rawActions[name]);
    });
    return actionsObject;
  };
  return {
    action: decorated,
    actions: decoratedActions,
    withActions: createDecorator(decoratedActions),
  };
}
