import { storiesOf } from '@storybook/polymer';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import {
  withKnobs,
  text,
  button,
  number,
  select,
  date,
  color,
  array,
  boolean,
} from '@storybook/addon-knobs/polymer';
import { document } from 'global';
import '../polymer-playground-app.html';
import '../playground-button.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Welcome', module).add(
  'Welcome',
  () => '<storybook-welcome-to-polymer></storybook-welcome-to-polymer>'
);

storiesOf('App', module)
  .addDecorator(withKnobs)
  .add(
    'full app',
    () =>
      `<polymer-playground-app title="${text(
        'App title',
        'This is an app'
      )}"></polymer-playground-app>`
  );

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
    button('testing', () => el.setAttribute('title', 'testing'));
    return el;
  })
  .add(
    'with notes',
    withNotes('We have the <strong>best</strong> playground buttons, ever.')(
      () => '<playground-button></playground-button>'
    )
  );

storiesOf('Addon Knobs', module)
  .addDecorator(withKnobs)
  .add('simple', () => {
    const title = text('Button title', 'Hello');
    const el = document.createElement('playground-button');
    el.setAttribute('title', title);
    button('callback', () => el.setAttribute('title', 'testing'));
    return el;
  })
  .add('complex', () => {
    const name = text('Name', 'Jane');
    const stock = number('Stock', 20, { range: true, min: 0, max: 30, step: 5 });
    const fruits = { apples: 'Apple', bananas: 'Banana', cherries: 'Cherry' };
    const fruit = select('Fruit', fruits, 'apple');
    const price = number('Price', 2.25);
    const colour = color('Border', 'deeppink');
    const today = date('Today', new Date('Jan 20 2017'));
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const nice = boolean('Nice', true);

    const stockMessage = stock
      ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
      : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;

    button('Arbitrary action', action('You clicked it!'));

    return `
          <div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
            <h1>My name is ${name},</h1>
            <h3>today is ${new Date(today).toLocaleDateString()}</h3>
            <p>${stockMessage}</p>
            <p>Also, I have:</p>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p>${nice ? 'Nice to meet you!' : 'Leave me alone!'}</p>
          </div>
        `;
  });
