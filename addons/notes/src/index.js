import deprecate from 'util-deprecate';
import addons from '@storybook/addons';
import { WithNotes as ReactWithNotes } from './react';

export const withNotes = textOrOptions => {
  const channel = addons.getChannel();

  const text = typeof textOrOptions === 'string' ? textOrOptions : textOrOptions.text;

  return getStory => context => {
    // send the notes to the channel before the story is rendered
    channel.emit('storybook/notes/add_notes', text);
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
