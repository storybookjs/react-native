import { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

const TestCase = () => {
  return <Text>Testing story globs and nested stories</Text>;
};

const meta = {
  component: TestCase,
} satisfies Meta<typeof TestCase>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
