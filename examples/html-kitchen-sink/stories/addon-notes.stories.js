import { storiesOf } from '@storybook/html';

storiesOf('Addons|Notes', module).add(
  'Simple note',
  () =>
    `<p>
        <strong>
          This is a fragment of HTML
        </strong>
      </p>`,
  {
    notes: 'My notes on some bold text',
  }
);
