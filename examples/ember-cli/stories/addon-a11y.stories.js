import hbs from 'htmlbars-inline-precompile';
import { checkA11y } from '@storybook/addon-a11y';

export default {
  title: 'Addon|a11y',
  decorators: [checkA11y],

  parameters: {
    options: { selectedPanel: '@storybook/a11y/panel' },
  },
};

export const Default = () => hbs`<button></button>`;
export const Label = () => hbs`<button>Testing the a11y addon</button>`;
export const Disabled = () => hbs`<button disabled>Testing the a11y addon</button>`;

export const invalidContrast = () =>
  hbs`<button style="color: black; background-color: brown;">Testing the a11y addon</button>`;

invalidContrast.story = {
  name: 'Invalid contrast',
};
