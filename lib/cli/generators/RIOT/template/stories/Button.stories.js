import { mount } from '@storybook/riot';

/* eslint-disable-next-line import/no-webpack-loader-syntax */
import MyButtonRaw from 'raw-loader!./MyButton.tag';
import './MyButton.tag';

export default {
  title: 'Button',
};

export const text = () => ({
  tags: ['<my-button>Hello Button</my-button>'],
});

export const scenario = () => ({
  tags: [{ content: MyButtonRaw, boundAs: 'MyButton' }],
  template: '<MyButton>With scenario</MyButton>',
});

export const emoji = () => ({
  tags: ['<my-button>😀 😎 👍 💯</my-button>'],
});
