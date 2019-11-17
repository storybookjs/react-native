/* eslint-disable import/extensions */
import { html } from 'lit-html';
import '../demo-wc-card.js';

export default {
  title: 'Addons/Backgrounds',
  parameters: {
    backgrounds: [
      { name: 'light', value: '#eeeeee' },
      { name: 'dark', value: '#222222', default: true },
    ],
  },
};

export const story1 = () => html`
  <demo-wc-card>You should be able to switch backgrounds for this story</demo-wc-card>
`;
story1.story = { name: 'story 1' };

export const story2 = () => html`
  <demo-wc-card back-side>This one too!</demo-wc-card>
`;
story2.story = { name: 'story 2' };
