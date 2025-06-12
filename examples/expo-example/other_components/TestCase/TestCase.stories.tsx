import { Meta, StoryObj } from '@storybook/react-native';
import { useRef } from 'react';
import { Text } from 'react-native';

const TestCase = () => {
  const unstableRef = useRef(Math.random().toString(36).slice(2, 11)).current;
  return <Text>{unstableRef}</Text>;
};

const meta = {
  component: TestCase,
} satisfies Meta<typeof TestCase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
