import { createElement } from 'rax';
import { action } from '@storybook/addon-actions';

import Button from 'rax-button';
import Text from 'rax-text';

export default {
  title: 'Button',
};

export const text = () => <Button onPress={action('clicked')}>Hello Button</Button>;

export const emoji = () => (
  <Button onPress={action('clicked')}>
    <Text role="img" aria-label="so cool">
      😀 😎 👍 💯
    </Text>
  </Button>
);
