import { createElement } from 'rax';
import { withNotes } from '@storybook/addon-notes';
import Text from 'rax-text';
import markdown from './note.md';

export default {
  title: 'Addon/addon-notes',
  decorators: [withNotes],
};

export const Basic = () => <Text>RAX TEXT NODE</Text>;

Basic.story = {
  parameters: { notes: 'super awesome note' },
};

export const WithEmojies = () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>;

WithEmojies.story = {
  name: 'with emojies',
  parameters: {
    notes: ' this is a note with emojies 🚀🚀🚀🚀🚀',
  },
};

export const WithMarkdown = () => <Text>😀 😎 👍 💯</Text>;

WithMarkdown.story = {
  name: 'with markdown',
  parameters: {
    notes: {
      markdown,
    },
  },
};
