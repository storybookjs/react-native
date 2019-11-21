import { mount } from '@storybook/riot';

// eslint-disable-next-line
import MyButtonRaw from 'raw-loader!./MyButton.tag';
import './MyButton.tag';

export default {
  title: 'Button',
};

export const Text = () => ({
  tags: ['<my-button>Hello Button</my-button>'],
});

export const Scenario = () => ({
  tags: [{ content: MyButtonRaw, boundAs: 'MyButton' }],
  template: '<MyButton>With scenario</MyButton>',
});

export const Emoji = () => ({
  tags: ['<my-button>😀 😎 👍 💯</my-button>'],
});
