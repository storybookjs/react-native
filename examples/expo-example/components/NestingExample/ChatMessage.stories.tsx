import type { Meta, StoryObj } from '@storybook/react-native';
import { ChatMessage, ChatMessageProps } from './ChatComponents';

const meta = {
  component: ChatMessage,
  argTypes: {
    isOwn: { control: 'boolean' },
    showAvatar: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['sent', 'delivered', 'read'],
    },
  },
} satisfies Meta<ChatMessageProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MessageFirst: Story = {
  args: {
    message: 'Hey! How are you doing today? 👋',
    senderName: 'Sarah Chen',
    isOwn: false,
    timestamp: '2:34 PM',
    showAvatar: true,
  },
};

export const MessageSecond: Story = {
  args: {
    message:
      "I'm doing great, thanks for asking! Just finished up that project we discussed last week. Want to grab coffee and chat about it?",
    senderName: 'Me',
    isOwn: true,
    timestamp: '2:35 PM',
    status: 'read',
  },
};
