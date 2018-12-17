import deprecate from 'util-deprecate';

export interface StoryContext {
  story: string;
  kind: string;
}

export interface WrapperSettings {
  options: object;
  parameters: any;
}

export type StoryGetter = (context: StoryContext) => any;

export type StoryWrapper = (
  getStory: StoryGetter,
  context: StoryContext,
  settings: WrapperSettings
) => any;

type MakeDecoratorResult = (...args: any) => any;

interface MakeDecoratorOptions {
  name: string;
  parameterName: string;
  allowDeprecatedUsage: boolean;
  skipIfNoParametersOrOptions: boolean;
  wrapper: StoryWrapper;
}

export const makeDecorator: MakeDecoratorResult = ({
  name,
  parameterName,
  wrapper,
  skipIfNoParametersOrOptions = false,
  allowDeprecatedUsage = false,
}: MakeDecoratorOptions) => {
  const decorator: any = (options: object) => (getStory: any, context: any) => {
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
