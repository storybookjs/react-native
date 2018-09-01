import deprecate from 'util-deprecate';

// Create a decorator that can be used both in the (deprecated) old "hoc" style:
//   .add('story', decorator(options)(() => <Story />));
//
// And in the new, "parameterized" style:
//   .addDecorator(decorator)
//   .add('story', () => <Story />, { name: { parameters } });
//
// *And* in the older, but not deprecated, "pass options to decorator" style:
//  .addDecorator(decorator(options))

export const makeDecorator = ({
  name,
  parameterName,
  wrapper,
  skipIfNoParametersOrOptions = false,
  allowDeprecatedUsage = false,
}) => {
  const decorator = options => (getStory, context) => {
    const parameters = context.parameters && context.parameters[parameterName];

    if (parameters && parameters.disable) {
      return getStory(context);
    }

    if (skipIfNoParametersOrOptions && !options && !parameters) {
      return getStory(context);
    }
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
      if (innerArgs.length > 1) {
        return decorator(...args)(...innerArgs);
      }

      if (allowDeprecatedUsage) {
        // Used to wrap a story directly .add('story', decorator(options)(() => <Story />))
        //   This is now deprecated:
        return deprecate(
          context => decorator(...args)(innerArgs[0], context),
          `Passing stories directly into ${name}() is deprecated, instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
        );
      }

      throw new Error(
        `Passing stories directly into ${name}() is not allowed, instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
      );
    };
  };
};
