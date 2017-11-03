import { storiesOf } from '@storybook/polymer';
import '../PlaygroundButton.html';
import './storybook-welcom-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('PlaygroundButton', module).add(
  'default mode',
  () => '<playground-button></playground-button>'
);
