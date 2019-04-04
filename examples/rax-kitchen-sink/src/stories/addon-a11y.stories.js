import { createElement } from 'rax';
import { storiesOf } from '@storybook/rax';
import { withA11Y } from '@storybook/addon-a11y';
import Text from 'rax-text';
import View from 'rax-view';
import Button from 'rax-button';
import markdown from './note.md';

storiesOf('Addon|addon-a11y', module)
  .addDecorator(withA11Y)
  .add('basic', () => <Text>RAX TEXT NODE</Text>, { notes: 'super awesome note' })
  .add('with style', () => <Text style={{ fontSize: 20, color: 'blue' }}>Styled text</Text>, {
    notes: ' this is a note with emojis 🚀🚀🚀🚀🚀',
  })
  .add(
    'with markdown',
    () => (
      <Button>
        {' '}
        <Text id="text1">😀 😎 👍 💯</Text>
        <View>
          <Text id="text1">aaa</Text>
        </View>{' '}
      </Button>
    ),
    {
      notes: {
        markdown,
      },
    }
  );
