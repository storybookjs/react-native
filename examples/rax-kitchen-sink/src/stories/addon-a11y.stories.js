import { createElement } from 'rax';
import { withA11Y } from '@storybook/addon-a11y';
import Text from 'rax-text';
import View from 'rax-view';
import markdown from './note.md';

export default {
  title: 'Addon/addon-a11y',
  decorators: [withA11Y],
};

export const Basic = () => <Text>RAX TEXT NODE</Text>;

Basic.story = {
  parameters: { notes: 'super awesome note' },
};

export const WithStyle = () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>;

WithStyle.story = {
  name: 'with style',
  parameters: {
    notes: ' this is a note with emojis 🚀🚀🚀🚀🚀',
  },
};

export const WithMarkdown = () => (
  <button type="button">
    &nbsp;
    <Text id="text1">😀 😎 👍 💯</Text>
    <View>
      <Text id="text1">aaa</Text>
    </View>
    &nbsp;
  </button>
);

WithMarkdown.story = {
  name: 'with markdown',
  parameters: {
    notes: {
      markdown,
    },
  },
};
