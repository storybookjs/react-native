import addons, { makeDecorator } from '@storybook/addons';

export const withResources = makeDecorator({
  name: 'withResources',
  parameterName: 'resources',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    if (!Array.isArray(storyOptions) && !Array.isArray(storyOptions.resources)) {
      throw new Error('The `resources` parameter needs to be an Array of strings');
    }

    // resources = union(resources,
    //   Array.isArray(storyOptions) ? storyOptions : storyOptions.resources);

    channel.emit(
      'storybook/resources/add_resources',
      Array.isArray(storyOptions) ? storyOptions : storyOptions.resources
    );

    return getStory(context);
  },
});
