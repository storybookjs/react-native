import action from './action';
import actions from './actions';

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
  return {
    action: decorated,
    actions: (...args) => {
      const rawActions = actions(...args);
      const decoratedActions = {};
      Object.keys(rawActions).forEach(name => {
        decoratedActions[name] = applyDecorators(decorators, rawActions[name]);
      });
      return decoratedActions;
    },
  };
}
