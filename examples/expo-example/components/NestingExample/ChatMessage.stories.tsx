import type { Meta, StoryObj } from '@storybook/react-native';
import { Text } from 'react-native';

const MyComponent = ({ text }) => <Text>{text}</Text>;

const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MessageFirst: Story = {
  args: {
    text: 'Hello',
  },
};

export const MessageSecond: Story = {
  args: {
    text: 'Message two',
  },
};
