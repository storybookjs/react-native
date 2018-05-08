import addons, { makeTransitionalDecorator } from '@storybook/addons';
import marked from 'marked';

function renderMarkdown(text, options) {
  marked.setOptions({ ...marked.defaults, options });
  return marked(text);
}

export const withNotes = makeTransitionalDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    if (storyOptions) {
      const { text, markdown, markdownOptions } =
        typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;

      if (!text && !markdown) {
        throw new Error('You must set of one of `text` or `markdown` on the `notes` parameter');
      }

      channel.emit('storybook/notes/add_notes', text || renderMarkdown(markdown, markdownOptions));
    }

    return getStory(context);
  },
});

export const withMarkdownNotes = (text, options) =>
  withNotes({
    markdown: text,
    markdownOptions: options,
  });
