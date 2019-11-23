import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Button',
};

export const Rounded = () => ({
  Component: ButtonView,
  props: {
    rounded: true,
    message: 'Rounded text',
  },
});

export const Square = () => ({
  Component: ButtonView,
  props: {
    rounded: false,
    message: 'Squared text',
  },
});
