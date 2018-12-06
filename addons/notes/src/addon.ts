import addons, { makeDecorator } from '@storybook/addons';
import { parse as renderMarkdown } from 'marked';

export const withNotes = makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,
  wrapper: (getStory, context, { options, parameters }) => {
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
  },
});

export const withMarkdownNotes = (text, options) =>
  withNotes({
    markdown: text,
    markdownOptions: options,
  });
