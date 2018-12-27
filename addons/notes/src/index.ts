import { parse as renderMarkdown } from 'marked';
import {
  addons,
  makeDecorator,
  StoryContext,
  StoryGetter,
  WrapperSettings,
} from '@storybook/addons';

function wrapper(
  getStory: StoryGetter,
  context: StoryContext,
  { options, parameters }: WrapperSettings
) {
  const channel = addons.getChannel();

  const storyOptions = parameters || options;

  const { text, markdown, markdownOptions } =
    typeof storyOptions === 'string'
      ? {
          text: storyOptions,
          markdown: undefined,
          markdownOptions: undefined,
        }
      : storyOptions;

  if (!text && !markdown) {
    throw new Error('You must set of one of `text` or `markdown` on the `notes` parameter');
  }

  channel.emit('storybook/notes/add_notes', text || renderMarkdown(markdown, markdownOptions));

  return getStory(context);
}

// todo resolve any after @storybook/addons and @storybook/channels are migrated to TypeScript
export const withNotes = makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper,
});

export const withMarkdownNotes = (text: string, options: any) =>
  withNotes({
    markdown: text,
    markdownOptions: options,
  });
