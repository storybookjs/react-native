import { storiesOf } from '@storybook/html';
import { withKnobs, text, number } from '@storybook/addon-knobs/html';

storiesOf('Addons|Knobs', module)
  .addDecorator(withKnobs)
  .add('simple', () => {
    const title = text('Title', 'Hello');
    const num = number('Number', 1);

    return `<div>${title} ${num}</div>`;
  });
