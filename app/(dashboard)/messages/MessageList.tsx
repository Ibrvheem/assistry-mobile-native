import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { Conversation, Message } from '@/database/models';
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

const enhance = withObservables(['conversation'], ({ conversation }: { conversation: Conversation }) => ({
  messages: conversation.messages.observe().map((messages: Message[]) => messages.sort((a: Message, b: Message) => b.createdAt - a.createdAt)),
}));

export default enhance(MessageList);
