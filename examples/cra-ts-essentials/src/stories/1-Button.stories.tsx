import React from 'react';
import { action } from '@storybook/addon-actions';
import { Button } from '@storybook/react/demo';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Button',
  component: Button,
};

export const _text = () => (
  <Button onClick={action('clicked')}>{text('label', 'testing knobs')}</Button>
);

export const emoji = () => (
  <Button onClick={action('clicked')}>
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
);
