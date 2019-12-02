import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Text from 'rax-text';

export default {
  title: 'Button',
};

export const text = () => (
  <button onPress={action('clicked')} type="button">
    Hello button
  </button>
);

export const Emoji = () => (
  <button onPress={action('clicked')} type="button">
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </button>
);
