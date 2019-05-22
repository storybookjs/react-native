import React from 'react';
import { storiesOf } from '@storybook/react';

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
import React from 'react';
import { storiesOf } from '@storybook/react';
import markdownNotes from './readme.md';

storiesOf('Addons|Notes', module)
  .add(
    'addon notes rendering imported markdown',
    () => (
      <BaseButton label="Button with notes - check the notes panel for details" />
    ),
    {
      notes: markdownNotes,
    }
  )
~~~
`;

const markdownTable = `
| Column1 | Column2 | Column3 |
|---------|---------|---------|
| Row1.1  | Row1.2  | Row1.3  |
| Row2.1  | Row2.2  | Row2.3  |
| Row3.1  | Row3.2  | Row3.3  |
| Row4.1  | Row4.2  | Row4.3  |
`;

const giphyMarkdown = `
# Giphy

<Giphy query="cheese" />
`;

storiesOf('Addons|Notes', module)
  .add('addon notes', baseStory, {
    notes:
      'This is the notes for a button. This is helpful for adding details about a story in a separate panel.',
  })
  .add('addon notes rendering imported markdown', baseStory, {
    notes: { markdown: markdownNotes },
  })
  .add('addon notes rendering inline, github-flavored markdown', baseStory, {
    notes: { markdown: markdownString },
  })
  .add('with a markdown table', baseStory, {
    notes: { markdown: markdownTable },
  })
  .add('with a markdown giphy', baseStory, {
    notes: { markdown: giphyMarkdown },
  });
