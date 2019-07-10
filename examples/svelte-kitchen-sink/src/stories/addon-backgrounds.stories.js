import ButtonView from './views/ButtonView.svelte';

export default {
  title: 'Addon|Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () => ({
  Component: ButtonView,
});

story1.story = {
  name: 'story 1',
};
