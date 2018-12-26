/* eslint-disable import/extensions */
import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';

storiesOf('Welcome', module).add('to Storybook', () => ({
  template: hbs`
        <div>
          <h3> Welcome to Storybook! </h3>
          <button {{action onClick}}> Checkout the button example </button>
        </div>
      `,
  context: {
    onClick: linkTo('Button'),
  },
}));

storiesOf('Button', module)
  .add('with text', () => ({
    template: hbs`<button {{action onClick}}>Hello Button</button>`,
    context: {
      onClick: action('clicked'),
    },
  }))
  .add('with some emoji', () => ({
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
  }));
