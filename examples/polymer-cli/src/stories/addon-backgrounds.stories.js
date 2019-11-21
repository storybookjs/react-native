export default {
  title: 'Addon/Backgrounds',

  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const ButtonWithText = () => '<button>Click me</button>';

ButtonWithText.story = {
  name: 'button with text',
};
