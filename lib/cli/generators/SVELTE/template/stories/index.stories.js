import { action } from '@storybook/addon-actions';

import Button from './button.svelte';

export default {
  title: 'Button',
};

export const text = () => ({
  Component: Button,
  props: { text: 'Hello Button' },
  on: { click: action('clicked') },
});

export const emoji = () => ({
  Component: Button,
  props: {
    text: '😀 😎 👍 💯',
  },
  on: { click: action('clicked') },
});
