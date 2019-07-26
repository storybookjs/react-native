import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Button from 'rax-button';
import Text from 'rax-text';

export default {
  title: 'Addon|addon-actions',
};

export const withText = () => <Button onclick={action('clicked')}>Hello Button</Button>;

withText.story = {
  name: 'with text',
};

export const withSomeEmoji = () => (
  <Button onclick={action('clicked')}>
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </Button>
);

withSomeEmoji.story = {
  name: 'with some emoji',
};
