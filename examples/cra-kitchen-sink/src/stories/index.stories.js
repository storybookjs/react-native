/* eslint-disable react/destructuring-assignment */
import React from 'react';
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

export default {
  title: 'Button',

  parameters: {
    component: Button,
  },
};

export const story1 = () => <Button onClick={action('clicked', { depth: 1 })}>Hello Button</Button>;
story1.story = {
  name: 'with text',
  parameters: {
    options: { selectedPanel: 'storybook/actions/panel' },
  },
};

export const story2 = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="yolo">
      😀 😎 👍 💯
    </span>
  </Button>
);
story2.story = {
  name: 'with some emoji',
  parameters: {
    options: { selectedPanel: 'storybook/actions/panel' },
  },
};

export const story3 = () => <Button>Check my notes in the notes panel</Button>;
story3.story = {
  name: 'with notes',
  parameters: {
    notes: 'A very simple button',
    options: { selectedPanel: 'storybook/notes/panel' },
  },
};

export const story4 = context => (
  <Container>
    <span>
      click the <InfoButton /> label in top right for info about "{context.name}"
    </span>
  </Container>
);
story4.story = {
  name: 'with new info',
  parameters: {
    notes: 'Composition: Info(Notes())',
    options: { selectedPanel: 'storybook/info/panel' },
    decorators: [
      withInfo(
        'Use the [info addon](https://github.com/storybookjs/storybook/tree/master/addons/info) with its new painless API.'
      ),
    ],
  },
};
