import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Text from 'rax-text';

export default {
  title: 'Addon/addon-actions',
};

export const WithText = () => (
  <button onClick={action('clicked')} type="button">
    Hello Button
  </button>
);

WithText.story = {
  name: 'with text',
};

export const WithSomeEmoji = () => (
  <button onClick={action('clicked')} type="button">
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </button>
);

WithSomeEmoji.story = {
  name: 'with some emoji',
};
