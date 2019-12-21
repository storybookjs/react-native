/** @jsx h */

import { h } from 'preact';
import { action } from '@storybook/addon-actions';

import Button from '../Button';

export default {
  title: 'Button',
  component: Button,
};

export const WithText = () => <Button onclick={action('clicked')}>Hello Button</Button>;

WithText.story = {
  name: 'with text',
};

export const WithSomeEmoji = () => (
  <Button onclick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);

WithSomeEmoji.story = {
  name: 'with some emoji',
};
