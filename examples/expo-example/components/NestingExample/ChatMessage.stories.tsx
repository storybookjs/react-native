import type { ComponentMeta, ComponentStoryObj } from '@storybook/react-native';
import { Text } from 'react-native';
import React from 'react';

const MyComponent = ({ text }) => <Text>{text}</Text>;

export default {
  title: 'Chat/Message',
  component: MyComponent,
} as ComponentMeta<typeof MyComponent>;

export const MessageFirst: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'Hello',
  },
};

export const MessageSecond: ComponentStoryObj<typeof MyComponent> = {
  args: {
    text: 'Message two',
  },
};
