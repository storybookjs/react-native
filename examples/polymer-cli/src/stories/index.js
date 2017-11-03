import { storiesOf } from '@storybook/polymer';
// import { action } from '@storybook/addon-actions';
import '../PlaygroundButton.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('PlaygroundButton', module).add(
  'default mode',
  () => '<playground-button></playground-button>'
);
