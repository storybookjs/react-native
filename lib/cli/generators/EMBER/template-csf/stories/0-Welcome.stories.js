import hbs from 'htmlbars-inline-precompile';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Welcome',
};

export const ToStorybook = () => ({
  template: hbs`
    <div>
      <h3> Welcome to Storybook! </h3>
      <button {{action onClick}}> Checkout the button example </button>
    </div>
  `,
  context: {
    onClick: linkTo('Button'),
  },
});

ToStorybook.story = {
  name: 'to Storybook',
};
