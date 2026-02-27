import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { ChatBubble, ChatReactions, ChatBubbleProps } from './ChatComponents';

interface BubbleWithReactionsProps extends ChatBubbleProps {
  showReactions?: boolean;
}

const BubbleWithReactions = ({
  showReactions = true,
  ...bubbleProps
}: BubbleWithReactionsProps) => (
  <View style={styles.container}>
    <ChatBubble {...bubbleProps} />
    {showReactions && (
      <View style={styles.reactions}>
        <ChatReactions
          reactions={[
            { emoji: '❤️', count: 5, reacted: true },
            { emoji: '😂', count: 2, reacted: false },
          ]}
        />
      </View>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  reactions: {
    marginTop: 4,
    marginLeft: 8,
  },
});

const meta = {
  title:
    'NestingExample/Message/bubble/a very long name for a title that just keeps going and going',
  component: BubbleWithReactions,
  argTypes: {
    isOwn: { control: 'boolean' },
    showReactions: { control: 'boolean' },
    status: {
      control: 'select',
      options: ['sent', 'delivered', 'read'],
    },
  },
} satisfies Meta<BubbleWithReactionsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const First: Story = {
  args: {
    message: 'This message has some reactions! Try tapping them to toggle.',
    isOwn: false,
    timestamp: '3:45 PM',
    showReactions: true,
  },
};

export const Second: Story = {
  name: 'Second Story',
  args: {
    message: "Great idea! Let's do it 🎉",
    isOwn: true,
    timestamp: '3:46 PM',
    status: 'read',
    showReactions: true,
  },
};
