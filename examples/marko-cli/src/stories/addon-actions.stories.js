
import { storiesOf } from '@storybook/marko';
import { action, configureActions } from '@storybook/addon-actions';
import Button from '../components/button/index.marko';

storiesOf('Addons|actionlogger', module)
  .add('Action only', () => Button.renderSync({click: action('action logged!')}));
