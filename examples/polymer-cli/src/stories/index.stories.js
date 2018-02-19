import { storiesOf } from '@storybook/polymer';

import '../polymer-playground-app.html';
import '../playground-button.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('App', module).add(
  'full app',
  () => '<polymer-playground-app title="Storybook fro Polymer"></polymer-playground-app>'
);

storiesOf('Button', module)
  .add('rounded', () => '<playground-button></playground-button>')
  .add('square', () => '<playground-button is-square></playground-button>');
