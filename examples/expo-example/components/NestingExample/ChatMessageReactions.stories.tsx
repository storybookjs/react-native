import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'NestingExample/Message/Reactions',
  component: MyComponent,
} as Meta<typeof MyComponent>;

export const MessageOne: StoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};

export const MessageTwo: StoryObj<typeof MyComponent> = {
  args: {
    text: 'Message two',
  },
};
