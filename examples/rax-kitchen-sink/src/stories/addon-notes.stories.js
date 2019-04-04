import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { withNotes } from '@storybook/addon-notes';
import Text from 'rax-text';
import markdown from './note.md';

storiesOf('Addon|addon-notes', module)
  .addDecorator(withNotes)
  .add('basic', () => <Text>RAX TEXT NODE</Text>, { notes: 'super awesome note' })
  .add('with emojies', () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>, {
    notes: ' this is a note with emojies 🚀🚀🚀🚀🚀',
  })
  .add('with markdown', () => <Text>😀 😎 👍 💯</Text>, {
    notes: {
      markdown,
    },
  });
