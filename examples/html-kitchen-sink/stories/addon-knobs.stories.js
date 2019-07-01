import { action } from '@storybook/addon-actions';
import { document } from 'global';

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

const cachedContainer = document.createElement('p');

export default {
  title: 'Addons|Knobs',
  decorators: [withKnobs],
};

export const Simple = () => {
  const name = text('Name', 'John Doe');
  const age = number('Age', 44);
  const content = `I am ${name} and I'm ${age} years old.`;
  return `<div>${content}</div>`;
};

export const DOM = () => {
  const name = text('Name', 'John Doe');
  const container = document.createElement('p');
  container.textContent = name;
  return container;
};

export const story3 = () => {
  const name = text('Name', 'John Doe');
  const textColor = color('Text color', 'orangered');
  cachedContainer.textContent = name;
  cachedContainer.style.transition = 'color 0.5s ease-out';
  cachedContainer.style.color = textColor;
  return cachedContainer;
};
story3.story = { name: 'CSS transitions' };

export const story4 = () => {
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

  return `<div style="${style}">
        <h1>My name is ${name},</h1>
        <h3>today is ${new Date(today).toLocaleDateString('en-US', dateOptions)}</h3>
        <p>${stockMessage}</p>
        <p>Also, I have:</p>
        <ul>${items.map(item => `<li>${item}</li>`).join('')}</ul>
        <p>${salutation}</p>
      </div>
    `;
};
story4.story = { name: 'All knobs' };

export const story5 = () => text('Rendered string', '<img src=x onerror="alert(\'XSS Attack\')" >');
story5.story = { name: 'XSS safety' };
