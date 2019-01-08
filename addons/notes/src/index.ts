import { makeDecorator, StoryContext, StoryGetter, WrapperSettings } from '@storybook/addons';
import deprecate from 'util-deprecate';

// todo resolve any after @storybook/addons and @storybook/channels are migrated to TypeScript
export const withNotes = makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,

  wrapper: deprecate(
    (getStory: StoryGetter, context: StoryContext, { options, parameters }: WrapperSettings) => {
      const storyOptions = parameters || options;

      const { text, markdown } =
        typeof storyOptions === 'string'
          ? {
              text: storyOptions,
              markdown: undefined,
            }
          : storyOptions;

      if (!text && !markdown) {
        throw new Error(
          `Parameter 'notes' must must be a string or an object with 'text' or 'markdown' properties`
        );
      }

      return getStory(context);
    },
    'withNotes is deprecated'
  ),
});

export const withMarkdownNotes = deprecate((text: string, options: any) => {},
'withMarkdownNotes is deprecated');

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}
