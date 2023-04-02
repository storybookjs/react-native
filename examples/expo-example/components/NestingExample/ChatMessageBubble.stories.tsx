import type { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'Chat/Message/bubble',
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
