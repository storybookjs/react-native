import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon|Notes',
};

export const simpleNote = () => ({
  Component: ButtonView,
});

simpleNote.story = {
  name: 'Simple note',
  parameters: { notes: 'My notes on the [ButtonView](/story/addon-notes--simple-note) component' },
};

export const noteWithHtml = () => ({
  Component: ButtonView,
  props: {
    text: '🤔😳😯😮😄😩😓😱🤓😑😶😊',
  },
});

noteWithHtml.story = {
  name: 'Note with HTML',
  parameters: {
    notes: `
    <h2>My notes on emojies</h2>

    <em>It's not all that important to be honest, but..</em>

    Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
  `,
  },
};
