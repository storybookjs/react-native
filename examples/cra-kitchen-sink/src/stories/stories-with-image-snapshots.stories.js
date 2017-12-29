import React from 'react';

import { storiesOf } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { Button } from '@storybook/react/demo';

storiesOf('Addon Storyshots.Button.withImageSnapshot', module)
  .add('with text', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      Hello Button
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onClick={action('clicked')}>
      {setOptions({ selectedAddonPanel: 'storybook/actions/actions-panel' })}
      😀 😎 👍 💯
    </Button>
  ))
  .add(
    'with notes',
    withNotes('A very simple button')(() => (
      <Button>
        {setOptions({ selectedAddonPanel: 'storybook/notes/panel' })}
        Check my notes in the notes panel
      </Button>
    ))
  );
