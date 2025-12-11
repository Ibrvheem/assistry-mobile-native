import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ActivityIndicator, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { database } from '@/database';
import { Conversation } from '@/database/models';
import MessageList from './MessageList';
import { sendMessage } from '@/lib/sockets';
import { useGobalStoreContext } from '@/store/global-context';
import { Ionicons } from '@expo/vector-icons';

// Simple Composer Component (Inline for now, can be extracted)
const Composer = ({ onSend }: { onSend: (text: string) => void }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View style={styles.composerContainer}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type a message..."
        multiline
      />
      <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
        <Ionicons name="send" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const { userData } = useGobalStoreContext();
  const router = useRouter();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const chat = await database.get<Conversation>('conversations').find(id as string);
        setConversation(chat);
      } catch (error) {
        console.log('Conversation not found locally', error);
        // Fallback: If passed via params, maybe create it? 
        // For now, just show error or go back
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConversation();
    }
  }, [id]);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!conversation || !userData) return;

    const tempId = `temp-${Date.now()}`;
    const payload = {
      roomId: conversation.id,
      text,
      type: 'text',
      sender: userData._id,
      tempId,
      createdAt: new Date().toISOString(),
    };

    try {
      await sendMessage(payload);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [conversation, userData]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!conversation) {
    return (
      <View style={styles.center}>
        <Text>Chat not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: 'blue' }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{conversation.name || 'Chat'}</Text>
      </View>
      
      <View style={styles.listContainer}>
        <MessageList conversation={conversation} currentUserId={userData?._id || ''} />
      </View>

      <Composer onSend={handleSendMessage} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
  },
  composerContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
