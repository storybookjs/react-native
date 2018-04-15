import { action } from '../preview';

export default function decorateAction(decorators) {
  return (name, options) => {
    const callAction = action(name, options);
    return (..._args) => {
      const decorated = decorators.reduce((args, fn) => fn(args), _args);
      callAction(...decorated);
    };
  };
}
