import { action } from '@storybook/addon-actions';

import ButtonView from './views/ButtonView.svelte';
import Button from '../components/Button.svelte';

export default {
  title: 'Addon|Actions',
};

export const actionOnViewMethod = () => ({
  Component: ButtonView,
  props: {
    click: action('I am logging in the actions tab'),
  },
});

actionOnViewMethod.story = {
  name: 'Action on view method',
};

export const actionOnComponentMethod = () => ({
  Component: Button,
  props: {
    text: 'Custom text',
  },
  on: {
    click: action('I am logging in the actions tab too'),
  },
});

actionOnComponentMethod.story = {
  name: 'Action on component method',
};
