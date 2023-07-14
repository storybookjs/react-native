import type { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'NestingExample/Message/Reactions',
  component: MyComponent,
} as ComponentMeta<typeof MyComponent>;

export const MessageOne: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};

export const MessageTwo: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'Message two',
  },
};
