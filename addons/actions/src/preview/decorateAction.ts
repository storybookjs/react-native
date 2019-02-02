import action from './action';
import actions from './actions';
import { createDecorator } from './withActions';

function applyDecorators(decorators: any[], actionCallback: (...args: any) => void) {
  return (..._args: any[]) => {
    const decorated = decorators.reduce((args, fn) => fn(args), _args);
    actionCallback(...decorated);
  };
}

export function decorateAction(decorators: any[]) {
  return (name: any, options: any) => {
    const callAction = action(name, options);
    return applyDecorators(decorators, callAction);
  };
}

export function decorate(decorators: any[]) {
  const decorated = decorateAction(decorators);
  const decoratedActions = (...args: any[]) => {
    const rawActions = actions(...args);
    const actionsObject = {} as any;
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
