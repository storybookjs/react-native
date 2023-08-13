// NOTE this fixes metro not logging correctly for some reason
if (__DEV__) {
  const primitiveTypes = ['string', 'number', 'boolean'];
  const logLevels = ['log', 'debug', 'info', 'warn', 'error'];

  const transformArgs = (args) => {
    return args.map((arg) => {
      if (arg === undefined) {
        return 'undefined';
      }
      if (arg instanceof Error) {
        if (arg.stack) {
          return arg.stack;
        }
        return arg.toString();
      }
      if (arg instanceof Date) {
        return arg.toString();
      }
      if (primitiveTypes.includes(typeof arg)) {
        return arg.toString();
      } else {
        return JSON.stringify(arg);
      }
    });
  };

  const consoleProxy = new Proxy(console, {
    get: (target, prop) => {
      //@ts-ignore
      if (logLevels.includes(prop)) {
        return (...args) => {
          // we proxy the call to itself, but we transform the arguments to strings before
          // so that they are printed in the terminal
          return target[prop].apply(this, transformArgs(args));
        };
      }
      return target[prop];
    },
  });

  console = consoleProxy;
}

export { default } from './.storybook';
