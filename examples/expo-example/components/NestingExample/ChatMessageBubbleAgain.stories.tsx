import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title:
    'NestingExample/Message/bubble/a very long name for a title that just keeps going and going',
  component: MyComponent,
} as Meta<typeof MyComponent>;

export const First: StoryObj<typeof MyComponent> = {
  args: {
    text: 'First',
  },
};

export const Second: StoryObj<typeof MyComponent> = {
  storyName: 'Second Story',
  args: {
    text: 'Second',
  },
};
