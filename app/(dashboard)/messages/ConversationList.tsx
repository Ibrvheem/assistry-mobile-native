import React from 'react';
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withObservables } from '@nozbe/watermelondb/react';
import { Conversation } from '@/database/models';
import { database } from '@/database';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';
import { Avatar } from '@/app/avatar';

const formatMessageTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return formatDistanceToNowStrict(date, { addSuffix: true });
};

const ConversationItem = ({ conversation }: { conversation: Conversation }) => {
  return (
    <Link href={{ pathname: "/messages/[id]", params: { id: conversation.id } }} asChild>
      <TouchableOpacity style={styles.chatRow}>
        <View style={styles.avatarContainer}>
          {conversation.avatar ? (
            <Image
              source={{ uri: conversation.avatar }}
              style={styles.profileImage}
              contentFit="cover"
            />
          ) : (
            <Avatar size={55} />
          )}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName}>{conversation.name || 'Unknown'}</Text>
            <Text style={styles.messageTime}>
              {conversation.updatedAt ? formatMessageTime(conversation.updatedAt) : ''}
            </Text>
          </View>

          <View style={styles.messageRow}>
            <Text style={[styles.lastMessage, conversation.unreadCount > 0 && styles.unreadMessage]} numberOfLines={1}>
              {/* TODO: Fetch last message content if needed, or store snippet in conversation model */}
              Click to view messages
            </Text>
            {conversation.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const EnhancedConversationItem = withObservables(['conversation'], ({ conversation }) => ({
  conversation,
}))(ConversationItem);

const ConversationList = ({ conversations }: { conversations: Conversation[] }) => {
  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <EnhancedConversationItem conversation={item} />}
      ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
      ListEmptyComponent={<Text style={styles.emptyText}>No chats yet</Text>}
    />
  );
};

const styles = StyleSheet.create({
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    marginRight: 14,
    marginLeft: 5,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 15,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },
  unreadMessage: {
    fontWeight: "700",
    color: "#111827",
  },
  unreadBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    marginRight: 15,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  }
});

const enhance = withObservables([], () => ({
  conversations: database.get<Conversation>('conversations').query().observe(),
}));

export default enhance(ConversationList);
