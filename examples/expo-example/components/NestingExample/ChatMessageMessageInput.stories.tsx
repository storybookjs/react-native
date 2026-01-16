import type { Meta, StoryObj } from '@storybook/react-native';
import { View, StyleSheet } from 'react-native';
import { MessageInput, MessageInputProps, ChatMessage } from './ChatComponents';
import { action } from 'storybook/actions';

const InputDemo = (props: MessageInputProps) => (
  <View style={styles.container}>
    <View style={styles.messagesArea}>
      <ChatMessage
        message="Hey, are you coming to the party tonight?"
        senderName="Mike"
        isOwn={false}
        timestamp="5:30 PM"
      />
      <ChatMessage
        message="Wouldn't miss it! What time should I be there?"
        senderName="Me"
        isOwn={true}
        timestamp="5:32 PM"
        status="read"
      />
      <ChatMessage
        message="Around 8pm works great. See you then! 🎉"
        senderName="Mike"
        isOwn={false}
        timestamp="5:33 PM"
        showAvatar={true}
      />
    </View>
    <MessageInput {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    minHeight: 400,
  },
  messagesArea: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'flex-end',
  },
});

const meta = {
  title: 'NestingExample/MessageInput',
  component: InputDemo,
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<MessageInputProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    placeholder: 'Type a message...',
    onSend: action('message-sent'),
    disabled: false,
  },
};
