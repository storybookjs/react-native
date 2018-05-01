import React from 'react';
import { storiesOf } from '@storybook/react';

import { withNotes, withMarkdownNotes } from '@storybook/addon-notes';
import BaseButton from '../components/BaseButton';
import markdownNotes from './notes/notes.md';

const baseStory = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

const markdownString = `
# Documentation

This is inline github-flavored markdown!

## Example Usage
~~~js
storiesOf('Addons|Notes', module)
  .add(
    'withNotes rendering imported markdown',
    withNotes(markdownNotes)(() => (
      <BaseButton label="Button with notes - check the notes panel for details" />
    ))
  )
~~~
    `;

storiesOf('Addons|Notes', module)
  .addDecorator(withNotes)
  .add('withNotes', baseStory, {
    notes:
      'This is the notes for a button. This is helpful for adding details about a story in a separate panel.',
  })
  .add('withNotes rendering imported markdown', baseStory, {
    notes: { markdown: markdownNotes },
  })
  .add('withNotes rendering inline, github-flavored markdown', baseStory, {
    notes: { markdown: markdownString },
  })
  .add('using decorator arguments, withNotes', withNotes('Notes into withNotes')(baseStory))
  .add(
    'using decorator arguments, withMarkdownNotes',
    withMarkdownNotes(markdownString)(baseStory)
  );
