import deprecate from 'util-deprecate';
import addons from '@storybook/addons';
import marked from 'marked';
import { WithNotes as ReactWithNotes } from './react';

export const withMarkdownNotes = text => {
  const channel = addons.getChannel();

  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/notes/add_notes', marked(text));
    return getStory(context);
  };
};

export const withNotes = textOrOptions => {
  const channel = addons.getChannel();
  const options = typeof textOrOptions === 'string' ? { text: textOrOptions } : textOrOptions;

  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/notes/add_notes', options.text);
    return getStory(context);
  };
};

Object.defineProperty(exports, 'WithNotes', {
  configurable: true,
  enumerable: true,
  get: deprecate(
    () => ReactWithNotes,
    '@storybook/addon-notes WithNotes Component is deprecated, use withNotes() instead. See https://github.com/storybooks/storybook/tree/master/addons/notes'
  ),
});
