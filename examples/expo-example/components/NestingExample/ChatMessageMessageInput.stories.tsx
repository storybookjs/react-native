import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const MyComponent = ({ text }) => <Text>{text}</Text>;

const meta = {
  title: 'NestingExample/MessageInput',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    text: 'Hello',
  },
};
