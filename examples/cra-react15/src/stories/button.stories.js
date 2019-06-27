import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';

export default {
  title: 'Button',
  parameters: {
    component: Button,
  },
};

export const story1 = () => <Button onClick={action('clicked')}>Hello Button</Button>;
story1.story = { name: 'with text' };

export const story2 = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
story2.story = { name: 'with some emoji' };
