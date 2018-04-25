import { storiesOf } from '@storybook/html';
import { document } from 'global';
import { withKnobs, text } from '@storybook/addon-knobs/html';

storiesOf('Addons|Knobs', module)
  .addDecorator(withKnobs)
  .add('simple', () => {
    const title = text('Button title', 'Hello');

    const element = document.createElement('div');

    element.innerHTML = title;

    return element;
  });
