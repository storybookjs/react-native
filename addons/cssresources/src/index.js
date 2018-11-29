import addons, { makeDecorator } from '@storybook/addons';

export const withCssResources = makeDecorator({
  name: 'withCssResources',
  parameterName: 'cssresources',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: false,
  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();
    const storyOptions = parameters || options;

    if (!Array.isArray(storyOptions) && !Array.isArray(storyOptions.cssresources)) {
      throw new Error('The `cssresources` parameter needs to be an Array');
    }

    channel.emit(
      'storybook/resources/add_cssresources',
      Array.isArray(storyOptions) ? storyOptions : storyOptions.cssresources
    );

    return getStory(context);
  },
});
