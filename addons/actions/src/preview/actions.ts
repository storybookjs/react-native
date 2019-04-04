import { action } from './action';
import { ActionOptions, ActionsMap } from '../models';

export function actions(...args: any[]): ActionsMap {
  let options: ActionOptions = {};
  const names = args;
  // last argument can be options
  if (names.length !== 1 && typeof args[args.length - 1] !== 'string') {
    options = names.pop();
  }

  let namesObject = names[0];
  if (names.length !== 1 || typeof namesObject === 'string') {
    namesObject = {};
    names.forEach(name => {
      namesObject[name] = name;
    });
  }

  const actionsObject: ActionsMap = {};
  Object.keys(namesObject).forEach(name => {
    actionsObject[name] = action(namesObject[name], options);
  });
  return actionsObject;
}
