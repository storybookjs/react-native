import addons, { makeDecorator } from '@storybook/addons';

let hasSetInitialResources = false;

export const withResources = makeDecorator({
  name: 'withResources',
  parameterName: 'resources',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    if (typeof storyOptions !== 'string' && typeof storyOptions.resources !== 'string') {
      throw new Error('The `resources` parameter needs to be a string');
    }

    if (!hasSetInitialResources) {
      channel.emit(
        'storybook/resources/add_resources',
        typeof storyOptions === 'string' ? storyOptions : storyOptions.resources
      );
      hasSetInitialResources = true;
    }

    return getStory(context);
  },
});
