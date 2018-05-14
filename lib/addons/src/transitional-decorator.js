import deprecate from 'util-deprecate';

// Create a decorator that can be used both in the (deprecated) old "hoc" style:
//   .add('story', decorator(options)(() => <Story />));
//
// And in the new, "parameterized" style:
//   .addDecorator(decorator)
//   .add('story', () => <Story />, { name: { parameters } });

export const makeTransitionalDecorator = ({ name, parameterName, wrapper }) => {
  const decorator = options => (getStory, context) => {
    const parameters = context.parameters && context.parameters[parameterName];

    return wrapper(getStory, context, {
      options,
      parameters,
    });
  };

  return (...args) => {
    // Used without options as .addDecorator(decorator)
    if (typeof args[0] === 'function') {
      return decorator()(...args);
    }

    return (...innerArgs) => {
      // Used as [.]addDecorator(decorator(options))
      if (typeof innerArgs.length > 1) {
        return decorator(...args)(...innerArgs);
      }

      // Used to wrap a story directly .add('story', decorator(options)(() => <Story />))
      //   This is now deprecated:
      return deprecate(
        context => decorator(...args)(innerArgs[0], context),
        `Passing stories directly into ${name}() is deprecated, instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
      );
    };
  };
};
