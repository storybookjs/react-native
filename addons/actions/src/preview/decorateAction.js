import { action } from '../preview';

export default function decorateAction(decorators) {
  return name => {
    const callAction = action(name);
    return (..._args) => {
      const decorated = decorators.reduce((args, fn) => fn(args), _args);
      callAction(...decorated);
    };
  };
}
