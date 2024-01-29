import { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';

const TestCase2 = () => {
  return <Text>Testing story globs and nested stories</Text>;
};

export default {
  title: 'TestCase2',
  component: TestCase2,
} satisfies Meta<typeof TestCase2>;

export const Basic: StoryObj<typeof TestCase2> = {
  args: {},
};
