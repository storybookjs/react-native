import { html } from 'lit-html';

// import '../my-component.js';

export default {
  title: 'Demo',
};

export const Heading = () => html`
  <h1>Hello World</h1>
`;

export const SettingProperties = () => html`
  <my-component .data=${{ header: 'foo', state: true }}>Hello World</my-component>
`;

export const Events = () => html`
  <button @click=${ev => console.log('clicked button')}>clicking will get logged to console</button>
`;

export const WithFunction = () => {
  const header = 'My Header';
  return html`
    <h1>${header}</h1>
  `;
};
