/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Demo Card',
  component: 'demo-wc-card',
};

export const Front = () => html`
  <demo-wc-card>A simple card</demo-wc-card>
`;

export const Back = () => html`
  <demo-wc-card back-side>A simple card</demo-wc-card>
`;

export const FrontOwnHeader = () => html`
  <demo-wc-card header="My own Header">A simple card</demo-wc-card>
`;

export const BackWithData = () => html`
  <demo-wc-card
    back-side
    .rows=${[
      { header: 'health', value: '200' },
      { header: 'mana', value: '100' },
    ]}
  >
    A simple card
  </demo-wc-card>
`;
