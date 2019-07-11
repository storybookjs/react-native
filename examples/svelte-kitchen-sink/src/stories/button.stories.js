import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Button',
};

export const rounded = () => ({
  Component: ButtonView,
  props: {
    rounded: true,
    message: 'Rounded text',
  },
});

export const square = () => ({
  Component: ButtonView,
  props: {
    rounded: false,
    message: 'Squared text',
  },
});
