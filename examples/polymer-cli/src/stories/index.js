import { storiesOf } from '@storybook/polymer';
// import { action } from '@storybook/addon-actions';
import '../playground-button.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('<playground-button>', module).add(
  'default mode',
  () => '<playground-button></playground-button>'
);
