/* eslint-disable import/extensions */
import hbs from 'htmlbars-inline-precompile';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button',
};

export const text = () => ({
  template: hbs`<button {{action onClick}}>Hello Button</button>`,
  context: {
    onClick: action('clicked'),
  },
});

export const emoji = () => ({
  template: hbs`
    <button {{action onClick}}>
      <span role="img" aria-label="so cool">
        😀 😎 👍 💯
      </span>
    </button>
  `,
  context: {
    onClick: action('clicked'),
  },
});
