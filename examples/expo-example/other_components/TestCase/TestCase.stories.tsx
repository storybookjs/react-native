import { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

const TestCase = () => {
  return <Text>Testing story globs and nested stories</Text>;
};

export default {
  title: 'TestCase1',
  component: TestCase,
} satisfies Meta<typeof TestCase>;

export const Basic: StoryObj<typeof TestCase> = {
  args: {},
};
