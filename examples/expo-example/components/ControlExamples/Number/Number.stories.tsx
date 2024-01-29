import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Multiply } from './Number';

export default {
  // title: 'ControlExamples/Number', relying on autotitle
  render: (args) => {
    return <Multiply {...args} />;
  },
  component: Multiply,
} as Meta<typeof Multiply>;

export const Basic: StoryObj<typeof Multiply> = {
  args: {
    first: 5,
    second: 3,
  },
};

export const Range: StoryObj<typeof Multiply> = {
  args: {
    first: 6,
    second: 7,
  },
  argTypes: {
    first: {
      step: 3,
      min: 1,
      max: 42,
      range: true,
    },
  },
};
