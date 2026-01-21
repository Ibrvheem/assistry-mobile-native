import { useState, useCallback, useEffect } from "react";
import constate from "constate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "@/lib/api";
import { onMessageReceived, getSocket } from "@/lib/sockets";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: string; // 'text' | 'image' | 'video' | 'audio'
  status: string; // 'sent' | 'delivered' | 'read'
  attachments?: string; // JSON string
  replyTo?: string; // JSON string
  createdAt: number;
  tempId?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
  updatedAt: number;
  lastMessageId?: string;
  unreadCount: number;
  messages: Message[];
  task_picture?: string;
  users?: {
    _id: string;
    first_name: string;
    last_name: string;
    profile_picture: string;
  }[];
  lastMessage?: {
    text: string;
    sender: string;
    createdAt: string;
  };
}

function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [typingUsers, setTypingUsers] = useState<
    Record<string, Record<string, "typing" | "recording">>
  >({}); // roomId -> { userId: status }
  const [unreadConversationCount, setUnreadConversationCount] = useState(0);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API if endpoint exists, otherwise we might need to rely on what was synced or use a placeholder
      // Assuming GET /conversations or similar exists based on sync logic.
      // If not, we'll implement a basic structure.
      // Based on sync.ts, it was using /sync. We will try to fetch conversations.
      // If no dedicated endpoint, we might default to empty or rely on sockets.

      const response = await api.get("chat/rooms");
      if (response && Array.isArray(response)) {
        // formatting response to match interface if needed
        const formatted = response.map((r: any) => ({
          ...r,
          id: r.id || r._id,
        }));
        setConversations(formatted);
      }
    } catch (e) {
      console.warn(
        "Failed to fetch conversations, maybe endpoint doesn't exist yet",
        e,
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const setMessagesForConversation = useCallback(
    (conversationId: string, messages: Message[]) => {
      setConversations((prev) => {
        return prev.map((c) => {
          if (c.id === conversationId) {
            return {
              ...c,
              messages: messages.sort((a, b) => b.createdAt - a.createdAt),
            };
          }
          // console.log("MESSAGES 22", c.messages);
          return c;
          // console.log("MESSAGES", messages);
        });
      });
    },
    [],
  );

  const fetchMessages = useCallback(
    async (roomId: string) => {
      try {
        const response = await api.get(`chat/rooms/${roomId}/messages`);
        if (Array.isArray(response)) {
          // Normalize messages
          const messages: Message[] = response.map((m: any) => ({
            id: m._id || m.id,
            conversationId: m.roomId,
            senderId: m.sender,
            content: m.text,
            type: m.type,
            status: "delivered", // stored messages are delivered
            createdAt: new Date(m.createdAt).getTime(),
            attachments: m.attachments,
            replyTo: m.replyTo,
          }));
          // console.log("MESSA", messages);
          setMessagesForConversation(roomId, messages);
        }
      } catch (e) {
        console.error("Failed to fetch messages", e);
      }
    },
    [setMessagesForConversation],
  );

  // Upsert a conversation (update if exists, add if not)
  const upsertConversation = useCallback((conversation: Conversation) => {
    setConversations((prev) => {
      const index = prev.findIndex((c) => c.id === conversation.id);
      if (index >= 0) {
        const newConvs = [...prev];
        // Merge existing with new data
        newConvs[index] = { ...newConvs[index], ...conversation };
        return newConvs.sort((a, b) => b.updatedAt - a.updatedAt);
      } else {
        // Add new
        return [conversation, ...prev].sort(
          (a, b) => b.updatedAt - a.updatedAt,
        );
      }
    });
  }, []);

  const addMessage = useCallback((message: Message) => {
    setConversations((prev) => {
      const convIndex = prev.findIndex((c) => c.id === message.conversationId);

      // If conversation exists, update it
      if (convIndex >= 0) {
        const updatedConv = { ...prev[convIndex] };
        const existingIdx = updatedConv.messages.findIndex(
          (m) =>
            m.id === message.id || (message.tempId && m.id === message.tempId),
        );

        if (existingIdx >= 0) {
          const newMessages = [...updatedConv.messages];
          newMessages[existingIdx] = { ...message };
          updatedConv.messages = newMessages.sort(
            (a, b) => b.createdAt - a.createdAt,
          );
        } else {
          updatedConv.messages = [...updatedConv.messages, message].sort(
            (a, b) => b.createdAt - a.createdAt,
          );
        }

        updatedConv.lastMessageId = message.id;
        updatedConv.updatedAt = message.createdAt;
        // Also update lastMessage snippet
        updatedConv.lastMessage = {
          text:
            message.type === "image"
              ? "Image"
              : message.type === "audio" || message.type === "voice"
                ? "Audio"
                : message.content,
          sender: message.senderId,
          createdAt: new Date(message.createdAt).toISOString(),
        };

        const newConvs = [...prev];
        newConvs[convIndex] = updatedConv;
        return newConvs.sort((a, b) => b.updatedAt - a.updatedAt);
      }

      // If conversation does NOT exist, we can't easily create a full conversation object
      // without more info (like user names).
      // Ideally, the global socket event for 'newMessage' should also optionally fetch the conversation or
      // the backend sends the full conversation data.
      // For now, we will create a placeholder or just ignore until the user enters that chat
      // (where upsertConversation will handle it).
      // BUT, to fix the "reloading" issue, the ChatScreen will call upsertConversation.

      return prev;
    });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    );
  }, []);

  const joinRoom = useCallback(async (roomId: string) => {
    const socket = await getSocket();
    socket.emit("joinRoom", { roomId });
  }, []);

  const leaveRoom = useCallback(async (roomId: string) => {
    const socket = await getSocket();
    socket.emit("leaveRoom", { roomId });
  }, []);

  useEffect(() => {
    const unsub = onMessageReceived((payload) => {
      console.log("ChatStore received message:", payload);
      const message: Message = {
        id: payload._id,
        conversationId: payload.roomId,
        senderId: payload.sender,
        content: payload.text,
        type: payload.type || "text",
        status: "delivered",
        createdAt: new Date(payload.createdAt).getTime(),
        tempId: payload.tempId,
      };
      addMessage(message);
    });

    const socketPromise = getSocket();
    socketPromise.then((socket) => {
      socket.emit("getOnlineUsers"); // Request initial state

      socket.on("userOnline", ({ userId }) => {
        setOnlineUsers((prev) => new Set(prev).add(userId));
      });

      socket.on("userOffline", ({ userId }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      });

      socket.on("onlineUsers", (users: string[]) => {
        setOnlineUsers(new Set(users));
      });

      socket.on(
        "userTyping",
        (payload: {
          roomId: string;
          userId: string;
          isTyping: boolean;
          isRecording?: boolean;
        }) => {
          // No need to show typing if it's the current user
          // Note: We need to know who the current user is.
          // However, the gateway already sends this to the room.
          // The socket.data.user is present on connection but not easily accessible here without state.
          // We can just rely on the UI component filtering it out as well,
          // or pass the current userId to this listener if possible.
          // Given the component already filters it, I will ensure the component logic is robust.
          // But it's better to filter here if possible.

          setTypingUsers((prev) => {
            const roomTypers = { ...(prev[payload.roomId] || {}) };
            if (payload.isTyping) {
              roomTypers[payload.userId] = payload.isRecording
                ? "recording"
                : "typing";
            } else {
              delete roomTypers[payload.userId];
            }
            return { ...prev, [payload.roomId]: roomTypers };
          });
        },
      );

      socket.on("unreadCountUpdate", ({ count }: { count: number }) => {
        setUnreadConversationCount(count);
      });

      // Request initial count
      socket.emit("getUnreadCount");
    });

    return () => {
      unsub();
      socketPromise.then((socket) => {
        socket.off("userOnline");
        socket.off("userOffline");
        socket.off("onlineUsers");
        socket.off("userTyping");
        socket.off("unreadCountUpdate");
      });
    };
  }, [addMessage]);

  const sendTyping = useCallback(
    async (roomId: string, isTyping: boolean, isRecording: boolean = false) => {
      const socket = await getSocket();
      socket.emit("typing", { roomId, isTyping, isRecording });
    },
    [],
  );

  return {
    conversations,
    loading,
    fetchConversations,
    fetchMessages,
    addMessage,
    setMessagesForConversation,
    markAsRead,
    joinRoom,
    leaveRoom,
    onlineUsers,
    typingUsers,
    sendTyping,
    unreadConversationCount,
    upsertConversation,
  };
}

export const [ChatProvider, useChatStore] = constate(useChat);
