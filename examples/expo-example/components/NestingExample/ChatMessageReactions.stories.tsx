import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { ChatReactions, ChatReactionsProps, ChatBubble } from './ChatComponents';

const ReactionsDemo = (props: ChatReactionsProps) => (
  <View style={styles.container}>
    <ChatBubble
      message="Tap the reactions below to toggle them!"
      isOwn={false}
      timestamp="4:20 PM"
    />
    <View style={styles.reactionsWrapper}>
      <ChatReactions {...props} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  reactionsWrapper: {
    marginTop: 4,
    marginLeft: 8,
  },
});

const meta = {
  title: 'NestingExample/Message/Reactions',
  component: ReactionsDemo,
} satisfies Meta<ChatReactionsProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MessageOne: Story = {
  args: {
    reactions: [
      { emoji: '❤️', count: 12, reacted: true },
      { emoji: '😂', count: 8, reacted: false },
      { emoji: '👍', count: 4, reacted: true },
      { emoji: '🎉', count: 2, reacted: false },
    ],
  },
};

export const MessageTwo: Story = {
  args: {
    reactions: [
      { emoji: '🔥', count: 23, reacted: false },
      { emoji: '💯', count: 15, reacted: true },
      { emoji: '👀', count: 7, reacted: false },
    ],
  },
};
