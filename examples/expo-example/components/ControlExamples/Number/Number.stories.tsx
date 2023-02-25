import React from 'react';
import { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Multiply } from './Number';

export default {
  render: (args) => {
    return <Multiply {...args} />;
  },
  component: Multiply,
} as ComponentMeta<typeof Multiply>;

export const Basic: ComponentStoryObj<typeof Multiply> = {
  args: {
    // first: 5,
    second: 3,
  },
};

export const Range: ComponentStoryObj<typeof Multiply> = {
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
