import { action } from './action';
import { actions } from './actions';
import { createDecorator } from './withActions';
import { ActionOptions, DecoratorFunction, HandlerFunction } from '../models';

const applyDecorators = (decorators: DecoratorFunction[], actionCallback: HandlerFunction) => {
  return (..._args: any[]) => {
    const decorated = decorators.reduce((args, storyFn) => storyFn(args), _args);
    actionCallback(...decorated);
  };
};

export const decorateAction = (
  decorators: DecoratorFunction[]
): ((name: string, options?: ActionOptions) => HandlerFunction) => {
  return (name: string, options?: ActionOptions) => {
    const callAction = action(name, options);
    return applyDecorators(decorators, callAction);
  };
};

export const decorate = (decorators: DecoratorFunction[]) => {
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
};
