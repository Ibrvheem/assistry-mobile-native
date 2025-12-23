import { useState, useCallback, useEffect } from 'react';
import constate from 'constate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '@/lib/api';
import { onMessageReceived } from '@/lib/sockets';

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
}

function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      // Try to fetch from API if endpoint exists, otherwise we might need to rely on what was synced or use a placeholder
      // Assuming GET /conversations or similar exists based on sync logic. 
      // If not, we'll implement a basic structure.
      // Based on sync.ts, it was using /sync. We will try to fetch conversations.
      // If no dedicated endpoint, we might default to empty or rely on sockets.
      
      const response = await api.get('chat/conversations'); // Guessing endpoint, can adjust
      if (response && Array.isArray(response)) {
          // formatting response to match interface if needed
          setConversations(response);
      }
    } catch (e) {
      console.warn("Failed to fetch conversations, maybe endpoint doesn't exist yet", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMessage = useCallback((message: Message) => {
    setConversations(prev => {
      const convIndex = prev.findIndex(c => c.id === message.conversationId);
      if (convIndex >= 0) {
        const updatedConv = { ...prev[convIndex] };
        // Avoid duplicates
        if (!updatedConv.messages.some(m => m.id === message.id)) {
             updatedConv.messages = [...updatedConv.messages, message].sort((a, b) => b.createdAt - a.createdAt);
             updatedConv.lastMessageId = message.id;
             updatedConv.updatedAt = message.createdAt;
        } else {
             // If duplicate (e.g. from socket after optimistic), update it
             const msgIndex = updatedConv.messages.findIndex(m => m.id === message.id);
             if (msgIndex >= 0) {
                 const newMessages = [...updatedConv.messages];
                 newMessages[msgIndex] = { ...newMessages[msgIndex], ...message };
                 updatedConv.messages = newMessages;
             }
        }
        
        const newConvs = [...prev];
        newConvs[convIndex] = updatedConv;
        return newConvs.sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return prev;
    });
  }, []);

  const setMessagesForConversation = useCallback((conversationId: string, messages: Message[]) => {
      setConversations(prev => {
          return prev.map(c => {
              if (c.id === conversationId) {
                  return { ...c, messages: messages.sort((a, b) => b.createdAt - a.createdAt) };
              }
              return c;
          });
      });
  }, []);

  const markAsRead = useCallback((conversationId: string) => {
      setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unreadCount: 0 } : c));
  }, []);

  useEffect(() => {
    const unsub = onMessageReceived((payload) => {
        console.log("ChatStore received message:", payload);
        const message: Message = {
            id: payload._id,
            conversationId: payload.roomId,
            senderId: payload.sender,
            content: payload.text,
            type: payload.type || 'text',
            status: 'delivered',
            createdAt: new Date(payload.createdAt).getTime(),
        };
        addMessage(message);
    });
    return () => unsub();
  }, [addMessage]);

  return {
    conversations,
    loading,
    fetchConversations,
    addMessage,
    setMessagesForConversation,
    markAsRead
  };
}

export const [ChatProvider, useChatStore] = constate(useChat);
