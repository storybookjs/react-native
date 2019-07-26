import React from 'react';

import BaseButton from '../components/BaseButton';
import markdownNotes from './notes/notes.md';

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


## Code examples for syntax-highlighter to deal with

### classes in javascript
~~~javascript
export class FromComponent {
  form = new FormControl({
    searchTerm: new FromControl(''),
    searchDate: new FromControl(''),
    endDate: new FromControl(''),
  })
}
~~~

### html with special formatting
~~~html
<foo-outer property-a="value"
           property-b="value"
           property-c="value">
  <foo-inner property-a="value"
             property-b="value" />
</foo-outer>
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

export default {
  title: 'Addons|Notes',
};

export const addonNotes = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

addonNotes.story = {
  name: 'addon notes',
  parameters: {
    notes:
      'This is the notes for a button. This is helpful for adding details about a story in a separate panel.',
  },
};

export const addonNotesRenderingImportedMarkdown = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

addonNotesRenderingImportedMarkdown.story = {
  name: 'addon notes rendering imported markdown',
  parameters: {
    notes: { markdown: markdownNotes },
  },
};

export const addonNotesRenderingInlineGithubFlavoredMarkdown = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

addonNotesRenderingInlineGithubFlavoredMarkdown.story = {
  name: 'addon notes rendering inline, github-flavored markdown',
  parameters: {
    notes: { markdown: markdownString },
  },
};

export const withAMarkdownTable = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

withAMarkdownTable.story = {
  name: 'with a markdown table',
  parameters: {
    notes: { markdown: markdownTable },
  },
};

export const withAMarkdownGiphy = () => (
  <BaseButton label="Button with notes - check the notes panel for details" />
);

withAMarkdownGiphy.story = {
  name: 'with a markdown giphy',
  parameters: {
    notes: { markdown: giphyMarkdown },
  },
};
