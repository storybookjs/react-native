import addons, { makeDecorator } from '@storybook/addons';

export const withNotes = makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,

  wrapper: (getStory, context, { options, parameters }) => {
    const channel = addons.getChannel();

    const storyOptions = parameters || options;

    const { text, markdown } =
      typeof storyOptions === 'string' ? { text: storyOptions } : storyOptions;

    if (!text && !markdown) {
      throw new Error('You must set of one of `text` or `markdown` on the `notes` parameter');
    }

    channel.emit('storybook/notes/add_notes', text || markdown);

    return getStory(context);
  },
});

export const withMarkdownNotes = text =>
  withNotes({
    markdown: text,
  });
