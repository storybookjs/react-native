import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Text from 'rax-text';
import View from 'rax-view';

export default {
  title: 'View',
};

export const text = () => (
  <View onClick={action('clicked')} type="button">
    Hello view
  </View>
);

export const Emoji = () => (
  <View onClick={action('clicked')} type="button">
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </View>
);
