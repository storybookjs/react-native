import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withNotes } from '@storybook/addon-notes';
import { withInfo } from '@storybook/addon-info';
import { Button } from '@storybook/react/demo';

import Container from './Container';

const InfoButton = () => (
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: 'rgb(34, 136, 204)',
      color: 'rgb(255, 255, 255)',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' '}
    Show Info{' '}
  </span>
);

storiesOf('Button', module)
  .addDecorator(withNotes)
  .add('with text', () => <Button onClick={action('clicked')}>Hello Button</Button>, {
    options: { selectedAddonPanel: 'storybook/actions/actions-panel' },
  })
  .add(
    'with some emoji',
    () => (
      <Button onClick={action('clicked')}>
        <span role="img" aria-label="so cool">
          😀 😎 👍 💯
        </span>
      </Button>
    ),
    {
      options: { selectedAddonPanel: 'storybook/actions/actions-panel' },
    }
  )
  .add('with notes', () => <Button>Check my notes in the notes panel</Button>, {
    notes: 'A very simple button',
    options: { selectedAddonPanel: 'storybook/notes/panel' },
  })
  .add(
    'with new info',
    withInfo(
      'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
    )(context => (
      <Container>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </Container>
    )),
    {
      options: { selectedAddonPanel: 'storybook/info/info-panel' },
    }
  )
  .add(
    'addons composition',
    withInfo('see Notes panel for composition info')(context => (
      <div>
        click the <InfoButton /> label in top right for info about "{context.story}"
      </div>
    )),
    {
      notes: 'Composition: Info(Notes())',
      options: { selectedAddonPanel: 'storybook/notes/panel' },
    }
  );
