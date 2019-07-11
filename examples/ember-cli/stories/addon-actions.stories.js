import hbs from 'htmlbars-inline-precompile';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Addon|Actions',

  parameters: {
    options: {
      selectedPanel: 'storybook/actions/panel',
    },
  },
};

export const button = () => ({
  template: hbs`<button {{action onClick}}>Click Me</button>`,
  context: {
    onClick: action('clicked'),
  },
});
