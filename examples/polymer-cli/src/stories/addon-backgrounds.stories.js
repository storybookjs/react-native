export default {
  title: 'Addon|Backgrounds',

  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const buttonWithText = () => '<button>Click me</button>';

buttonWithText.story = {
  name: 'button with text',
};
