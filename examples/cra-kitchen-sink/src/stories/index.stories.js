import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withInfo } from '@storybook/addon-info';
import { Button } from '@storybook/react/demo';

import Container from './Container';

const InfoButton = () => (
  <span
    style={{
      fontFamily: 'sans-serif',
      fontSize: 12,
      textDecoration: 'none',
      background: '#027ac5',
      color: '#fff',
      padding: '5px 15px',
      margin: 10,
      borderRadius: '0px 0px 0px 5px',
    }}
  >
    {' Show Info '}
  </span>
);

storiesOf('Button', module)
  .add('with text', () => <Button onClick={action('clicked', { depth: 1 })}>Hello Button</Button>, {
    options: { selectedPanel: 'storybook/actions/panel' },
  })
  .add('with some emoji', () => <Button onClick={action('clicked')}>😀 😎 👍 💯</Button>, {
    options: { selectedPanel: 'storybook/actions/panel' },
  })
  .add('with notes', () => <Button>Check my notes in the notes panel</Button>, {
    notes: 'A very simple button',
    options: { selectedPanel: 'storybook/notes/panel' },
  })
  .add(
    'with new info',
    context => (
      <Container>
        <span>
          click the <InfoButton /> label in top right for info about "{context.name}"
        </span>
      </Container>
    ),
    {
      notes: 'Composition: Info(Notes())',
      options: { selectedPanel: 'storybook/info/panel' },
      decorators: [
        withInfo(
          'Use the [info addon](https://github.com/storybooks/storybook/tree/master/addons/info) with its new painless API.'
        ),
      ],
    }
  );
