import { storiesOf } from '@storybook/marko';
import { action } from '@storybook/addon-actions';
import Button from '../components/action-button/index.marko';

// storiesOf('Addons|actionlogger', module).add('Action only', () =>
//   Button.renderSync({ click: action('action logged!') })
// );

storiesOf('Addons|Actions/Button').add('Simple', () =>
  Button.renderSync({ click: action('action logged!') })
);
