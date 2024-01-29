import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'NestingExample/Message',
  component: MyComponent,
} as Meta<typeof MyComponent>;

export const MessageFirst: StoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};

export const MessageSecond: StoryObj<typeof MyComponent> = {
  args: {
    text: 'Message two',
  },
};
