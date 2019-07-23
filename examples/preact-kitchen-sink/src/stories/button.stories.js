/** @jsx h */

import { h } from 'preact';
import { action } from '@storybook/addon-actions';

import Button from '../Button';

export default {
  title: 'Button',
  component: Button,
};

export const withText = () => <Button onclick={action('clicked')}>Hello Button</Button>;

withText.story = {
  name: 'with text',
};

export const withSomeEmoji = () => (
  <Button onclick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

withSomeEmoji.story = {
  name: 'with some emoji',
};
