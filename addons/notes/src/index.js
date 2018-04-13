import deprecate from 'util-deprecate';
import addons from '@storybook/addons';
import marked from 'marked';
import { WithNotes as ReactWithNotes } from './react';

function renderMarkdown(text, options) {
  marked.setOptions({ ...marked.defaults, options });
  return marked(text);
}

const decorator = options => {
  const channel = addons.getChannel();
  return (getStory, context) => {
    const { parameters: { notes } } = context;
    const storyOptions = notes || options;

    if (storyOptions) {
      const { text, markdown, markdownOptions } =
        typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;

      if (!text && !markdown) {
        throw new Error('You must set of one of `text` or `markdown` on the `notes` parameter');
      }

      channel.emit('storybook/notes/add_notes', text || renderMarkdown(markdown, markdownOptions));
    }

    return getStory(context);
  };
};

const hoc = options => story => context => decorator(options)(story, context);

export const withMarkdownNotes = (text, options) =>
  hoc({
    markdown: text,
    markdownOptions: options,
  });

export const withNotes = (...args) => {
  // Used without options as .addDecorator(withNotes)
  if (typeof args[0] === 'function') {
    return decorator()(...args);
  }

  // Input are options, ala .add('name', withNotes('note')(() => <Story/>))
  return hoc(args[0]);
};

Object.defineProperty(exports, 'WithNotes', {
  configurable: true,
  enumerable: true,
  get: deprecate(
    () => ReactWithNotes,
    '@storybook/addon-notes WithNotes Component is deprecated, use withNotes() instead. See https://github.com/storybooks/storybook/tree/master/addons/notes'
  ),
});
