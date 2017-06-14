import addons from '@storybook/addons';

export const withNotes = ({ notes }) => {
  const channel = addons.getChannel();
  // send the notes to the channel.

  return getStory => () => {
    channel.emit('storybook/notes/add_notes', notes);
    return getStory();
  };
};
