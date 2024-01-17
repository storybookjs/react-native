import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'NestingExample/MessageInput',
  component: MyComponent,
} as Meta<typeof MyComponent>;

export const Basic: StoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};
