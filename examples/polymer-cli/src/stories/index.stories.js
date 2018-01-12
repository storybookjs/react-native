import { storiesOf } from '@storybook/polymer';
import { withKnobs, text } from '@storybook/addon-knobs/polymer';
import { document } from 'global';
import '../polymer-playground-app.html';
import '../playground-button.html';
import '../separated-button/separated-button.html';
import './storybook-welcome-to-polymer.html';
import { StringTemplateButton } from '../string-template-button';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('App', module)
  .addDecorator(withKnobs)
  .add('full app', () => {
    const title = text('title', 'This title can be edited via a knob');
    return `<polymer-playground-app title="${title}"></polymer-playground-app>`;
  });

storiesOf('Button', module)
  .add('rounded', () => '<playground-button></playground-button>')
  .add('square', () => '<playground-button is-square></playground-button>');

storiesOf('Methods for rendering', module)
  .add('html string', () => '<div>Rendered with string</div>')
  .add('html with custom elements', () => '<separated-button title="Click me!"></separated-button>')
  .add('document.createElement', () => {
    const el = document.createElement('playground-button');
    el.setAttribute('title', 'Rendered with document.createElement');
    return el;
  })
  .add('Polymer instance', () => new StringTemplateButton());
