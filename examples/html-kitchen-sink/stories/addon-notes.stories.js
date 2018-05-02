import { storiesOf } from '@storybook/html';
import { withNotes } from '@storybook/addon-notes';

storiesOf('Addons|Notes', module)
  .addDecorator(withNotes)
  .add(
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
