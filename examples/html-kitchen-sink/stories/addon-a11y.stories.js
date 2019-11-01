import { document, setTimeout } from 'global';
import { withA11y } from '@storybook/addon-a11y';

const text = 'Testing the a11y addon';

export default {
  title: 'Addons|a11y',
  decorators: [withA11y],
  parameters: {
    options: { selectedPanel: 'storybook/a11y/panel' },
  },
};

export const Default = () => `<button></button>`;
export const Label = () => `<button>${text}</button>`;
export const Disabled = () => `<button disabled>${text}</button>`;
export const story4 = () =>
  `<button style="color: black; background-color: brown;">${text}</button>`;
story4.story = { name: 'Invalid contrast' };

export const story5 = () => {
  const div = document.createElement('div');
  setTimeout(() => {
    div.innerHTML = `<button>This button has a delayed render of 1s</button>`;
  }, 1000);
  return div;
};
story5.story = { name: 'Delayed render' };
