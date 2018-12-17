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

interface MakeDecoratorOptions {
  name: any;
  parameterName: any;
  wrapper: any;
  skipIfNoParametersOrOptions: boolean;
  allowDeprecatedUsage: boolean;
}

export const makeDecorator: any = ({
  name,
  parameterName,
  wrapper,
  skipIfNoParametersOrOptions = false,
  allowDeprecatedUsage = false,
}: MakeDecoratorOptions) => {
  const decorator: any = (options: any) => (getStory: any, context: any) => {
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

  return (...args: any) => {
    // Used without options as .addDecorator(decorator)
    if (typeof args[0] === 'function') {
      return decorator()(...args);
    }

    return (...innerArgs: any): any => {
      // Used as [.]addDecorator(decorator(options))
      if (innerArgs.length > 1) {
        return decorator(...args)(...innerArgs);
      }

      if (allowDeprecatedUsage) {
        // Used to wrap a story directly .add('story', decorator(options)(() => <Story />))
        //   This is now deprecated:
        return deprecate(
          (context: any) => decorator(...args)(innerArgs[0], context),
          `Passing stories directly into ${name}() is deprecated,
          instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
        );
      }

      throw new Error(
        `Passing stories directly into ${name}() is not allowed,
        instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`
      );
    };
  };
};
