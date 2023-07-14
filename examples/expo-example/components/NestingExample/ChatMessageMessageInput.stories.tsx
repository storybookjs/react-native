import type { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'NestingExample/MessageInput',
  component: MyComponent,
} as ComponentMeta<typeof MyComponent>;

export const Basic: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};
