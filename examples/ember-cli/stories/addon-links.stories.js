import hbs from 'htmlbars-inline-precompile';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Addon/Links',
};

export const GoToWelcome = () => ({
  template: hbs`<button {{action onClick}}>This button brings you to welcome</button>`,
  context: {
    onClick: linkTo('Welcome'),
  },
});

GoToWelcome.story = {
  name: 'Go to welcome',
};
