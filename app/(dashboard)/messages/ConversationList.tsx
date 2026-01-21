import React, { useEffect } from 'react';
import Colors from "@/constants/Colors";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useChatStore, Conversation } from '@/store/chat-store';
import { Link } from 'expo-router';
import { Image } from 'expo-image';
import { formatDistanceToNowStrict, isToday, isYesterday, format } from 'date-fns';
import { useGobalStoreContext } from '@/store/global-context';
import { useColorScheme } from "@/components/useColorScheme";
import { Check, CheckCheck } from 'lucide-react-native';
import { router } from "expo-router";

const logoImg = require("@/assets/logos/logo.png");

const formatMessageTime = (timestamp: number | string): string => {
  const date = new Date(timestamp);
  if (isToday(date)) return format(date, "h:mm a");
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd/MM/yy");
};

const ConversationItem = ({ conversation, currentUserId }: { conversation: Conversation; currentUserId?: string }) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const otherUser = conversation.users?.find(u => u._id !== currentUserId);
  const userImage = otherUser?.profile_picture;
  const taskImage = conversation.task_picture;

  let lastMessageText = "No messages";
  let lastMessageTime = "";
  let isFromMe = false;
  let messageStatus: 'sent' | 'delivered' | 'read' = 'sent';
  
  const lastMsg = conversation.lastMessage || (conversation.messages && conversation.messages.length > 0 ? conversation.messages[conversation.messages.length - 1] : null);

  if (lastMsg) {
      isFromMe = (lastMsg as any).sender === currentUserId || (lastMsg as any).senderId === currentUserId;
      const content = (lastMsg as any).text || (lastMsg as any).content || "";
      const type = (lastMsg as any).type;
      
      let displayContent = content;
      if (type === 'image') displayContent = "Photo";
      else if (type === 'audio') displayContent = "Voice message";

      lastMessageText = displayContent;
      lastMessageTime = formatMessageTime((lastMsg as any).createdAt);
      messageStatus = (lastMsg as any).status || 'sent';
  }

  const renderStatus = () => {
    if (!isFromMe) return null;
    const size = 16;
    const color = messageStatus === 'read' ? "#34B7F1" : themeColors.textMuted;
    
    if (messageStatus === 'read' || messageStatus === 'delivered') {
        return <CheckCheck size={size} color={color} style={styles.statusIcon} />;
    }
    return <Check size={size} color={color} style={styles.statusIcon} />;
  };

  return (
    <TouchableOpacity
  style={[styles.chatRow, { backgroundColor: themeColors.background }]}
  activeOpacity={0.7}
  onPress={() =>
    router.push({
      pathname: "/messages/[id]",
      params: { id: conversation.id },
    })
  }
>
        <View style={styles.avatarWrapper}>
            {(userImage || taskImage) ? (
                <View style={styles.dualAvatarContainer}>
                    <Image
                        source={taskImage ? { uri: taskImage.replace("auto/upload", "image/upload") } : logoImg}
                        style={styles.taskAvatar}
                        contentFit="cover"
                    />
                    <View style={[styles.userAvatarBorder, { backgroundColor: themeColors.background }]}>
                        <Image
                            source={userImage ? { uri: userImage } : logoImg}
                            style={styles.userAvatar}
                            contentFit="cover"
                        />
                    </View>
                </View>
            ) : (
                <View style={[styles.singleAvatar, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                    <Image
                        source={logoImg}
                        style={styles.logoAvatar}
                        contentFit="contain"
                    />
                </View>
            )}
        </View>

        <View style={[styles.chatInfo, { borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
          <View style={styles.infoTop}>
            <Text style={[styles.userName, { color: themeColors.text }]} numberOfLines={1}>
                {conversation.name || 'Chat'}
            </Text>
            <Text style={[styles.messageTime, { color: conversation.unreadCount > 0 ? Colors.brand.secondary : themeColors.textMuted }]}>
              {lastMessageTime}
            </Text>
          </View>

          <View style={styles.infoBottom}>
            <View style={styles.messagePreviewWrapper}>
                {renderStatus()}
                <Text 
                    style={[
                        styles.lastMessage, 
                        { color: themeColors.textMuted }, 
                        conversation.unreadCount > 0 && { color: themeColors.text, fontWeight: "500" }
                    ]} 
                    numberOfLines={1}
                >
                    {lastMessageText}
                </Text>
            </View>
            {conversation.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: Colors.brand.secondary }]}>
                <Text style={[styles.unreadText, { color: "#FFFFFF" }]}>
                    {conversation.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
  );
};

const ConversationList = () => {
    const { conversations, fetchConversations } = useChatStore();
    const { userData } = useGobalStoreContext();
    const colorScheme = useColorScheme();
    const themeColors = Colors[colorScheme ?? 'light'];

    useEffect(() => {
        fetchConversations();
    }, [fetchConversations]);

  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id || (item as any)._id}
      renderItem={({ item }) => <ConversationItem conversation={item} currentUserId={userData?._id} />}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={<Text style={[styles.emptyText, { color: themeColors.textMuted }]}>No chats yet</Text>}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 100,
  },
  chatRow: {
    // flexDirection: "row",
    // paddingHorizontal: 16,
    // height: 75,
    // alignItems: 'center',
    flexDirection: "row",
  paddingHorizontal: 16,
  paddingVertical: 12,
  alignItems: "center",
  },
  avatarWrapper: {
    marginRight: 12,
  },
  singleAvatar: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoAvatar: {
    width: '60%',
    height: '60%',
  },
  dualAvatarContainer: {
    width: 55,
    height: 55,
    position: 'relative',
  },
  taskAvatar: {
    width: 45,
    height: 45,
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  userAvatarBorder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    position: 'absolute',
    bottom: -2,
    right: -2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  userAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  chatInfo: {
    flex: 1,
    // height: '100%',
    justifyContent: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 17,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
  },
  infoBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  messagePreviewWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 4,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    paddingHorizontal: 4,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: "700",
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  }
});

export default ConversationList;
