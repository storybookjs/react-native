import type { Meta, StoryObj } from '@storybook/react-native';
import { ChatBubble, ChatBubbleProps } from './ChatComponents';

const meta = {
  title: 'NestingExample/Message/bubble',
  component: ChatBubble,
  argTypes: {
    isOwn: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['sent', 'delivered', 'read'],
    },
  },
} satisfies Meta<ChatBubbleProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const First: Story = {
  args: {
    message: 'Hello! This is a message from another user.',
    isOwn: false,
    timestamp: '10:30 AM',
  },
};

export const Second: Story = {
  name: 'Second Story',
  args: {
    message:
      'This is my reply to the conversation. The bubble should appear on the right side with a different color.',
    isOwn: true,
    timestamp: '10:32 AM',
    status: 'delivered',
  },
};
