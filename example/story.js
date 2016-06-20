import React from 'react';
import Button from './Button';
import { storiesOf } from '@kadira/storybook';

storiesOf('Button')
  .addWithInfo(
    'simple usage',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (
      <div>
        <Button label="The Button" />
        <br />
        <p>
          Click the "?" mark at top-right to view the info.
        </p>
      </div>
    ),
  );

storiesOf('Button')
  .addWithInfo(
    'simple usage (inline info)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button label="The Button" />),
    { inline: true },
  );

storiesOf('Button')
  .addWithInfo(
    'simple usage (disable source)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button label="The Button" />),
    { source: false, inline: true },
  );

storiesOf('Button')
  .addWithInfo(
    'simple usage (no header)',
    `
      This is the basic usage with the button with providing a label to show the text.
    `,
    () => (<Button label="The Button" />),
    { header: false, inline: true },
  );
