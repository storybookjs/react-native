import { document, setTimeout } from 'global';
import { withA11y } from '@storybook/addon-a11y';
import { html } from 'lit-html';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons/a11y',
  decorators: [withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Default = () => html`
  <button></button>
`;
export const Label = () => html`
  <button>${text}</button>
`;
export const Disabled = () => html`
  <button disabled>${text}</button>
`;
export const Story4 = () => html`
  <button style="color: black; background-color: brown;">${text}</button>
`;
Story4.story = { name: 'Invalid contrast' };

export const Story5 = () => {
  const div = document.createElement('div');
  setTimeout(() => {
    div.innerHTML = `<button>This button has a delayed render of 1s</button>`;
  }, 1000);
  return div;
};
Story5.story = { name: 'Delayed render' };
