import { createElement } from 'rax';
import { withNotes } from '@storybook/addon-notes';
import Text from 'rax-text';
import markdown from './note.md';

export default {
  title: 'Addon|addon-notes',
  decorators: [withNotes],
};

export const basic = () => <Text>RAX TEXT NODE</Text>;

basic.story = {
  parameters: { notes: 'super awesome note' },
};

export const withEmojies = () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>;

withEmojies.story = {
  name: 'with emojies',
  parameters: {
    notes: ' this is a note with emojies 🚀🚀🚀🚀🚀',
  },
};

export const withMarkdown = () => <Text>😀 😎 👍 💯</Text>;

withMarkdown.story = {
  name: 'with markdown',
  parameters: {
    notes: {
      markdown,
    },
  },
};
