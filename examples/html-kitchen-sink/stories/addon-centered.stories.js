import centered from '@storybook/addon-centered/html';

export default {
  title: 'Addons|Centered',
  decorators: [centered],
};

export const story1 = () => '<button>I am a Button !</button>';
story1.story = { name: 'button in center' };
