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
import '../separated-button/separated-button.html';
import './storybook-welcome-to-polymer.html';

storiesOf('Advanced/Decorator', module)
  .addDecorator(story => {
    const el = story();
    el.setAttribute('title', `${el.getAttribute('title')} - decorated`);
    return el;
  })
  .add('example decoration', () => {
    const el = document.createElement('playground-button');
    el.setAttribute('title', 'An example title');
    return el;
  });

storiesOf('Advanced/Addon Actions', module)
  .add('Action only', () => {
    const el = document.createElement('playground-button');
    el.addEventListener('click', action('log1'));
    return el;
  })
  .add('Action and method', () => {
    const el = document.createElement('playground-button');
    el.addEventListener('click', e => action('log2')(e.target));
    return el;
  });

storiesOf('Advanced/Addon Notes', module)
  .add(
    'Simple note',
    withNotes({ text: 'My notes on some bold text' })(
      () =>
        '<p><strong>Etiam vulputate elit eu venenatis eleifend. Duis nec lectus augue. Morbi egestas diam sed vulputate mollis. Fusce egestas pretium vehicula. Integer sed neque diam. Donec consectetur velit vitae enim varius, ut placerat arcu imperdiet. Praesent sed faucibus arcu. Nullam sit amet nibh a enim eleifend rhoncus. Donec pretium elementum leo at fermentum. Nulla sollicitudin, mauris quis semper tempus, sem metus tristique diam, efficitur pulvinar mi urna id urna.</strong></p>'
    )
  )
  .add(
    'Note with HTML',
    withNotes({
      text: `
      <h2>My notes on emojies</h2>

      <em>It's not all that important to be honest, but..</em>

      Emojis are great, I love emojis, in fact I like using them in my Component notes too! 😇
    `,
    })(() => '<p>🤔😳😯😮<br/>😄😩😓😱<br/>🤓😑😶😊</p>')
  );

storiesOf('Advanced/Addon Knobs', module)
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
    const today = date('Today', new Date('Jan 20 2017 GMT+0'));
    const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
    const nice = boolean('Nice', true);

    const stockMessage = stock
      ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
      : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

    button('Arbitrary action', action('You clicked it!'));

    return `
          <div style="border:2px dotted ${colour}; padding: 8px 22px; border-radius: 8px">
            <h1>My name is ${name},</h1>
            <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
            <p>${stockMessage}</p>
            <p>Also, I have:</p>
            <ul>
              ${items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p>${nice ? 'Nice to meet you!' : 'Leave me alone!'}</p>
          </div>
        `;
  });
