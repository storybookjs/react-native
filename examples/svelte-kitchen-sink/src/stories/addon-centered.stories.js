import Centered from '@storybook/addon-centered/svelte';
import { action } from '@storybook/addon-actions';

import Button from '../components/Button.svelte';

export default {
  title: 'Addon/Centered',
  component: Button,
  decorators: [Centered],
};

export const Rounded = () => ({
  Component: Button,
  props: {
    rounded: true,
    text: "Look, I'm centered!",
  },
});

export const WithAction = () => ({
  Component: Button,
  on: {
    click: action(`Tell me it ain't so! Centered and with actions! Thanks @ekhaled :)`),
  },
});

WithAction.story = {
  name: 'with action',
};
