import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const MyComponent = ({ text }) => <Text>{text}</Text>;

const meta = {
  title: 'NestingExample/Message/Reactions',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MessageOne: Story = {
  args: {
    text: 'Hello',
  },
};

export const MessageTwo: Story = {
  args: {
    text: 'Message two',
  },
};
