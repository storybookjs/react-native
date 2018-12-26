import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';
import { linkTo } from '@storybook/addon-links';

storiesOf('Addon|Links', module).add('Go to welcome', () => ({
  template: hbs`<button {{action onClick}}>This button brings you to welcome</button>`,
  context: {
    onClick: linkTo('Welcome'),
  },
}));
