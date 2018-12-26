import hbs from 'htmlbars-inline-precompile';
import { storiesOf } from '@storybook/ember';

storiesOf('Welcome', module)
  .addParameters({ options: { showAddonPanel: false } })
  .add('basic', () => ({
    template: hbs`
        {{welcome-page}}
      `,
  }));
