import { document, setTimeout } from 'global';
import { storiesOf } from '@storybook/html';
import { withA11y } from '@storybook/addon-a11y';

const text = 'Testing the a11y addon';

storiesOf('Addons|a11y', module)
  .addDecorator(withA11y)
  .addParameters({ options: { selectedPanel: 'storybook/a11y/panel' } })
  .add('Default', () => `<button></button>`)
  .add('Label', () => `<button>${text}</button>`)
  .add('Disabled', () => `<button disabled>${text}</button>`)
  .add(
    'Invalid contrast',
    () => `<button style="color: black; background-color: brown;">${text}</button>`
  )
  .add('Delayed render', () => {
    const div = document.createElement('div');
    setTimeout(() => {
      div.innerHTML = `<button>This button has a delayed render of 1s</button>`;
    }, 1000);
    return div;
  });
