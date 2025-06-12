import { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const TestCase2 = () => {
  return <Text>Testing story globs and nested stories</Text>;
};

const meta = {
  component: TestCase2,
} satisfies Meta<typeof TestCase2>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {},
};
