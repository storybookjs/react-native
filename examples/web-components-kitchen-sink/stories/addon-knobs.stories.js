/* eslint-disable import/extensions */
import { action } from '@storybook/addon-actions';
import { html } from 'lit-html';
import '../demo-wc-card.js';

import {
  array,
  boolean,
  button,
  color,
  date,
  select,
  withKnobs,
  text,
  number,
} from '@storybook/addon-knobs';

export default {
  title: 'Addons/Knobs',
  decorators: [withKnobs],
};

export const Simple = () => {
  const header = text('header', 'Power Ranger');
  const age = number('Age', 44);
  return html`
    <demo-wc-card .header=${header}>
      I am ${text('Name', 'John Doe')} and I'm ${age} years old.
    </demo-wc-card>
  `;
};

export const Story3 = () => {
  const header = text('header', 'Power Ranger');
  const textColor = color('Text color', 'orangered');
  return html`
    <demo-wc-card .header=${header}>
      I am ${text('Name', 'John Doe')} and I'm 30 years old.
    </demo-wc-card>
    <style>
      html {
        --demo-wc-card-front-color: ${textColor};
      }
    </style>
  `;
};
Story3.story = { name: 'Color Selection' };

export const Story4 = () => {
  const name = text('Name', 'Jane');
  const stock = number('Stock', 20, {
    range: true,
    min: 0,
    max: 30,
    step: 5,
  });
  const fruits = {
    Apple: 'apples',
    Banana: 'bananas',
    Cherry: 'cherries',
  };
  const fruit = select('Fruit', fruits, 'apples');
  const price = number('Price', 2.25);
  const colour = color('Border', 'deeppink');
  const today = date('Today', new Date('Jan 20 2017 GMT+0'));
  const items = array('Items', ['Laptop', 'Book', 'Whiskey']);
  const nice = boolean('Nice', true);

  const stockMessage = stock
    ? `I have a stock of ${stock} ${fruit}, costing &dollar;${price} each.`
    : `I'm out of ${fruit}${nice ? ', Sorry!' : '.'}`;

  const salutation = nice ? 'Nice to meet you!' : 'Leave me alone!';
  const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

  button('Arbitrary action', action('You clicked it!'));

  const style = `border: 2px dotted ${colour}; padding: 8px 22px; border-radius: 8px`;

  return html`
    <div style="${style}">
      <h1>My name is ${name},</h1>
      <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
      <p>${stockMessage}</p>
      <p>Also, I have:</p>
      <ul>
        ${items.map(
          item => html`
            <li>${item}</li>
          `
        )}
      </ul>
      <p>${salutation}</p>
    </div>
  `;
};
Story4.story = { name: 'All knobs' };

export const XssSafety = () => {
  const content = text('content', '<img src=x onerror="alert(\'XSS Attack\')" >');
  return html`
    <demo-wc-card>
      Code text works :)<br />
      Xss insert? ${content}
    </demo-wc-card>
  `;
};
