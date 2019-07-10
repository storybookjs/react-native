import hbs from 'htmlbars-inline-precompile';
import Centered from '@storybook/addon-centered/ember';

export default {
  title: 'Addon|Centered',
  decorators: [Centered],

  parameters: {
    component: Centered,
  },
};

export const button = () => ({
  template: hbs`<button>A Button</button>`,
});
