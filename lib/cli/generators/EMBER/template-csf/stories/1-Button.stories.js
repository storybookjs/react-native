import hbs from 'htmlbars-inline-precompile';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Button',
};

export const Text = () => ({
  template: hbs`<button {{action onClick}}>Hello Button</button>`,
  context: {
    onClick: action('clicked'),
  },
});

export const Emoji = () => ({
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
