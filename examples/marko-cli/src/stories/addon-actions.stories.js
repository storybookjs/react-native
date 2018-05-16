import { storiesOf } from '@storybook/marko';
import { action } from '@storybook/addon-actions';
import Button from '../components/action-button/index.marko';

storiesOf('Addons|Actions/Button', module).add('Simple', () =>
  Button.renderSync({ click: action('action logged!') })
);
