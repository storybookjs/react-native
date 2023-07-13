import type { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title:
    'NestingExample/Message/bubble/a very long name for a title that just keeps going and going',
  component: MyComponent,
} as ComponentMeta<typeof MyComponent>;

export const First: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'First',
  },
};

export const Second: ComponentStoryObj<typeof MyComponent> = {
  storyName: 'Second Story',
  args: {
    text: 'Second',
  },
};
