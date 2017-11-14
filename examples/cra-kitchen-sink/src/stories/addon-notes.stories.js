import React from 'react';
import { storiesOf } from '@storybook/react';

import { withNotes, WithNotes } from '@storybook/addon-notes';
import { action } from '@storybook/addon-actions';
import BaseButton from '../components/BaseButton';
import notes from './notes/notes.md';

storiesOf('Addon Notes', module)
  .add(
    'withNotes (markdown)',
    withNotes(notes)(() => (
      <BaseButton label="Button with notes - check the notes panel for details" />
    ))
  )
  .add('using deprecated API', () => (
    <WithNotes notes="Hello">
      <BaseButton onClick={action('clicked')} label="😀 😎 👍 💯" />
    </WithNotes>
  ));
