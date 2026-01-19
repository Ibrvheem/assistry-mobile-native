import React, { useEffect } from 'react';
import Colors from "@/constants/Colors";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useChatStore, Conversation } from '@/store/chat-store';
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

const ConversationList = () => {
    const { conversations, fetchConversations } = useChatStore();

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ConversationItem conversation={item} />}
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
    borderBottomColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    backgroundColor: Colors.brand.surface,
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
    color: Colors.brand.text,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.brand.textMuted,
    marginRight: 15,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: Colors.brand.textDim,
  },
  unreadMessage: {
    fontWeight: "700",
    color: Colors.brand.text,
  },
  unreadBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    marginRight: 15,
  },
  unreadText: {
    color: Colors.brand.darkGreen,
    fontSize: 12,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.brand.textMuted,
  }
});

export default ConversationList;
