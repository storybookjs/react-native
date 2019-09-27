import Centered from '@storybook/addon-centered/svelte';
import { action } from '@storybook/addon-actions';

import Button from '../components/Button.svelte';

export default {
  title: 'Addon|Centered',
  component: Button,
  decorators: [Centered],
};

export const rounded = () => ({
  Component: Button,
  props: {
    rounded: true,
    text: "Look, I'm centered!",
  },
});

export const withAction = () => ({
  Component: Button,
  on: {
    click: action(`Tell me it ain't so! Centered and with actions! Thanks @ekhaled :)`),
  },
});

withAction.story = {
  name: 'with action',
};
