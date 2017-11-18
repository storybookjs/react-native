import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withKnobs, text } from '@storybook/addon-knobs/polymer';
import { document } from 'global';
import '../polymer-playground-app.html';
import '../playground-button.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('App', module).add('full app', () => '<polymer-playground-app></polymer-playground-app>');

storiesOf('Button', module)
  .addDecorator(withKnobs)
  .add('default', () => '<playground-button></playground-button>')
  .add('with actions', () => {
    const el = document.createElement('playground-button');
    el.addEventListener('click', action('Button clicked'));
    return el;
  })
  .add('with knobs', () => {
    const title = text('Button title', 'Hello');
    const el = document.createElement('playground-button');
    el.setAttribute('title', title);
    return el;
  })
  .add(
    'with notes',
    withNotes('We have the <strong>best</strong> playground buttons, ever.')(
      () => '<playground-button></playground-button>'
    )
  );
