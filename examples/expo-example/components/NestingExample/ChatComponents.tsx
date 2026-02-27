import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// ============================================
// CHAT MESSAGE BUBBLE
// ============================================

export interface ChatBubbleProps {
  message: string;
  isOwn?: boolean;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
}

export const ChatBubble = ({
  message,
  isOwn = false,
  timestamp = '2:34 PM',
  status = 'read',
}: ChatBubbleProps) => {
  const statusIcon = {
    sent: '✓',
    delivered: '✓✓',
    read: '✓✓',
  }[status];

  return (
    <View style={[styles.bubbleContainer, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
      <View style={[styles.bubble, isOwn ? styles.bubbleBgOwn : styles.bubbleBgOther]}>
        <Text style={[styles.messageText, isOwn && styles.messageTextOwn]}>{message}</Text>
        <View style={styles.bubbleMeta}>
          <Text style={[styles.timestamp, isOwn && styles.timestampOwn]}>{timestamp}</Text>
          {isOwn && (
            <Text style={[styles.statusIcon, status === 'read' && styles.statusRead]}>
              {statusIcon}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// ============================================
// CHAT MESSAGE (Full message with avatar)
// ============================================

export interface ChatMessageProps {
  message: string;
  senderName?: string;
  avatarUrl?: string;
  isOwn?: boolean;
  timestamp?: string;
  status?: 'sent' | 'delivered' | 'read';
  showAvatar?: boolean;
}

export const ChatMessage = ({
  message,
  senderName = 'Alex',
  isOwn = false,
  timestamp = '2:34 PM',
  status = 'read',
  showAvatar = true,
}: ChatMessageProps) => {
  const initials = senderName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const avatarColors = ['#6366F1', '#EC4899', '#14B8A6', '#F59E0B', '#8B5CF6'];
  const colorIndex =
    senderName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  const avatarBg = avatarColors[colorIndex];

  return (
    <View
      style={[
        styles.messageContainer,
        isOwn ? styles.messageContainerOwn : styles.messageContainerOther,
      ]}
    >
      {!isOwn && showAvatar && (
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      )}
      {!isOwn && !showAvatar && <View style={styles.avatarPlaceholder} />}
      <View style={styles.messageContent}>
        {!isOwn && showAvatar && <Text style={styles.senderName}>{senderName}</Text>}
        <ChatBubble message={message} isOwn={isOwn} timestamp={timestamp} status={status} />
      </View>
    </View>
  );
};

// ============================================
// REACTIONS
// ============================================

export interface Reaction {
  emoji: string;
  count: number;
  reacted: boolean;
}

export interface ChatReactionsProps {
  reactions?: Reaction[];
  onReactionPress?: (emoji: string) => void;
}

export const ChatReactions = ({
  reactions = [
    { emoji: '❤️', count: 3, reacted: true },
    { emoji: '😂', count: 2, reacted: false },
    { emoji: '👍', count: 1, reacted: false },
  ],
  onReactionPress,
}: ChatReactionsProps) => {
  const [localReactions, setLocalReactions] = useState(reactions);

  const handlePress = (emoji: string) => {
    setLocalReactions((prev) =>
      prev.map((r) =>
        r.emoji === emoji
          ? {
              ...r,
              reacted: !r.reacted,
              count: r.reacted ? r.count - 1 : r.count + 1,
            }
          : r
      )
    );
    onReactionPress?.(emoji);
  };

  return (
    <View style={styles.reactionsContainer}>
      {localReactions.map((reaction) => (
        <TouchableOpacity
          key={reaction.emoji}
          style={[styles.reactionPill, reaction.reacted && styles.reactionPillActive]}
          onPress={() => handlePress(reaction.emoji)}
          activeOpacity={0.7}
        >
          <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
          <Text style={[styles.reactionCount, reaction.reacted && styles.reactionCountActive]}>
            {reaction.count}
          </Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.addReactionButton} activeOpacity={0.7}>
        <Text style={styles.addReactionIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// MESSAGE INPUT
// ============================================

export interface MessageInputProps {
  placeholder?: string;
  onSend?: (message: string) => void;
  disabled?: boolean;
}

export const MessageInput = ({
  placeholder = 'Type a message...',
  onSend,
  disabled = false,
}: MessageInputProps) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && onSend) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TouchableOpacity style={styles.attachButton} activeOpacity={0.7}>
        <Text style={styles.attachIcon}>📎</Text>
      </TouchableOpacity>
      <View style={styles.textInputWrapper}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={text}
          onChangeText={setText}
          editable={!disabled}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity style={styles.emojiButton} activeOpacity={0.7}>
          <Text style={styles.emojiIcon}>😊</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.sendButton,
          text.trim() ? styles.sendButtonActive : styles.sendButtonDisabled,
        ]}
        onPress={handleSend}
        activeOpacity={0.7}
        disabled={!text.trim() || disabled}
      >
        <Text
          style={[styles.sendIcon, text.trim() ? styles.sendIconActive : styles.sendIconDisabled]}
        >
          ➤
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================
// STYLES
// ============================================

const styles = StyleSheet.create({
  // Bubble styles
  bubbleContainer: {
    marginVertical: 2,
    maxWidth: '80%',
  },
  bubbleOwn: {
    alignSelf: 'flex-end',
  },
  bubbleOther: {
    alignSelf: 'flex-start',
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleBgOwn: {
    backgroundColor: '#6366F1',
    borderBottomRightRadius: 4,
  },
  bubbleBgOther: {
    backgroundColor: '#F3F4F6',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1F2937',
  },
  messageTextOwn: {
    color: '#FFFFFF',
  },
  bubbleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#6B7280',
  },
  timestampOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusRead: {
    color: '#60A5FA',
  },

  // Message container styles
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
  },
  messageContainerOwn: {
    justifyContent: 'flex-end',
  },
  messageContainerOther: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 36,
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
    maxWidth: '85%',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 2,
    marginLeft: 4,
  },

  // Reactions styles
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 12,
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  reactionPillActive: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  reactionEmoji: {
    fontSize: 16,
  },
  reactionCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  reactionCountActive: {
    color: '#6366F1',
  },
  addReactionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  addReactionIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },

  // Input styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachIcon: {
    fontSize: 20,
  },
  textInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 120,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 4,
    maxHeight: 100,
  },
  emojiButton: {
    padding: 4,
    marginLeft: 4,
  },
  emojiIcon: {
    fontSize: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: '#6366F1',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  sendIcon: {
    fontSize: 18,
    transform: [{ rotate: '0deg' }],
  },
  sendIconActive: {
    color: '#FFFFFF',
  },
  sendIconDisabled: {
    color: '#9CA3AF',
  },
});
