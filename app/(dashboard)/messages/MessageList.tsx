import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Message } from '@/store/chat-store';
import MessageBubble from '@/components/molecules/MessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  onSwipeReply?: (msg: Message) => void;
}

const MessageList = ({ messages, currentUserId, onSwipeReply }: MessageListProps) => {
  const renderItem = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUserId;
    return (
      <MessageBubble
        message={item}
        isMine={isMine}
        onSwipeReply={onSwipeReply}
      />
    );
  };

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      inverted
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default MessageList;
