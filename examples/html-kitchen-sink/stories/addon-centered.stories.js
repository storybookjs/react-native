import centered from '@storybook/addon-centered/html';

export default {
  title: 'Addons/Centered',
  decorators: [centered],
};

export const Story1 = () => '<button>I am a Button !</button>';
Story1.story = { name: 'button in center' };
