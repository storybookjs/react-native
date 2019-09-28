import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Text from 'rax-text';

export default {
  title: 'Addon|addon-actions',
};

export const withText = () => (
  <button onClick={action('clicked')} type="button">
    Hello Button
  </button>
);

withText.story = {
  name: 'with text',
};

export const withSomeEmoji = () => (
  <button onClick={action('clicked')} type="button">
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </button>
);

withSomeEmoji.story = {
  name: 'with some emoji',
};
