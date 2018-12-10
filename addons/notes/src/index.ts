import addons, { makeDecorator } from '@storybook/addons';
// import ACTIONS from './shared';

// todo resolve any after @storybook/addons and @storybook/channels are migrated to TypeScript
export const withNotes = makeDecorator({
  name: 'withNotes',
  parameterName: 'notes',
  skipIfNoParametersOrOptions: true,
  allowDeprecatedUsage: true,

  wrapper: (getStory: (context: any) => any, context: any, { options, parameters }: any) => {
    // const channel = addons.getChannel();

    const storyOptions = parameters || options;

    const { text, markdown } =
      typeof storyOptions === 'string'
        ? {
            text: storyOptions,
            markdown: undefined,
          }
        : storyOptions;

    if (!text && !markdown) {
      throw new Error('You must set of one of `text` or `markdown` on the `notes` parameter');
    }

    // channel.emit(EVENT_ID, storyOptions);

    return getStory(context);
  },
});

export const withMarkdownNotes = (text: string, options: any) =>
  withNotes({
    markdown: text,
  });
