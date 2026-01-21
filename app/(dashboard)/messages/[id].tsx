import React, { useState, useEffect, useRef, useCallback } from "react";
import Colors from "@/constants/Colors";
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { useChatStore, Conversation, Message } from "@/store/chat-store";
import { useGobalStoreContext } from "@/store/global-context";
import { Image } from "expo-image";
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { format, isToday, isYesterday } from "date-fns";
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { uploadMedia } from "./services";
import { useColorScheme } from "@/components/useColorScheme";

const logoImg = require("@/assets/logos/logo.png");
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.assistry.co'; 

export default function ChatScreen() {
  const { id, data } = useLocalSearchParams();
  const roomId = id as string;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  
  const { conversations, addMessage, fetchConversations, joinRoom, leaveRoom, fetchMessages, sendTyping, onlineUsers, typingUsers, upsertConversation } = useChatStore();
  const { userData } = useGobalStoreContext();
  
  const [conversation, setConversation] = useState<Conversation | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);
  
  // Audio Recording State
  const [recording, setRecording] = useState<Audio.Recording | undefined>();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [audioUploading, setAudioUploading] = useState(false);
  const [playingSound, setPlayingSound] = useState<Audio.Sound | undefined>();
  const [playingUri, setPlayingUri] = useState<string | null>(null);

  // Typing debounce
  const typingTimeoutRef = useRef<any>(null);

  // Load Conversation Logic
  // Separate Socket Connection Logic
  useEffect(() => {
    if (roomId) {
        joinRoom(roomId);
        fetchMessages(roomId);
        
        return () => {
            leaveRoom(roomId);
            if (playingSound) {
                playingSound.unloadAsync();
            }
        };
    }
  }, [roomId, joinRoom, leaveRoom, fetchMessages]); // Removed conversations dependency

  // Initial Load & Store Sync
  useEffect(() => {
    let active = true;

    const updateConv = () => {
        const chat = conversations.find(c => c.id === roomId);
        if (chat) {
            setConversation(chat);
            setLoading(false);
        } else if (data && typeof data === 'string') {
            // Fallback from params & Upsert to Store
             try {
                const parsed = JSON.parse(data);
                if(active) {
                    const newConv = {
                        id: parsed._id || parsed.id || roomId,
                        name: parsed.name || parsed.task?.task || 'Chat',
                        avatar: parsed.task_picture || '',
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                        unreadCount: 0,
                        messages: [],
                        task_picture: parsed.task_picture,
                        users: parsed.users,
                        lastMessageId: undefined
                    };
                    
                    if (!conversation) {
                         setConversation(newConv);
                         setLoading(false);
                    }
                    // IMPORTANT: Add to global store so socket updates work!
                    upsertConversation(newConv);
                }
            } catch (e) {
                 console.error("Parse error", e);
            }
        }
    };

    updateConv();
  }, [roomId, conversations, data, upsertConversation]);

  // Keep local conversation state in sync with store (important for new messages)
  useEffect(() => {
      const chat = conversations.find(c => c.id === roomId);
      if (chat) setConversation(chat);
  }, [conversations, roomId]);

  const uploadMedia66 = async (uri: string, type: 'image' | 'audio') => {
      try {
          const uploadUrl = API_URL.endsWith('/') ? `${API_URL}upload` : `${API_URL}/upload`;
          const response = await FileSystem.uploadAsync(uploadUrl, uri, {
              fieldName: 'file',
              httpMethod: 'POST',
              uploadType: FileSystem.FileSystemUploadType.MULTIPART,
              headers: {
                  // Authorization: `Bearer ${token}` // If needed, get token from storage
              }
          });
          
          if (response.status === 201 || response.status === 200) {
              const result = JSON.parse(response.body);
              // Assuming result is { url: string } or similar, adjust based on actual response
              // Based on controller, it returns whatever uploadService.upload returns.
              // Assuming it returns an object with 'url' or 'secure_url' (cloudinary style) or just the object.
              return result.url || result.secure_url || result.location; 
          } else {
              console.error("Upload failed", response.body);
              Alert.alert("Upload Failed", "Could not upload media.");
              return null;
          }
      } catch (e) {
          console.error("Upload error", e);
          Alert.alert("Error", "Failed to upload file.");
          return null;
      }
  };

  // New Optimistic Media Sending Logic
  // Pure Text Sending Logic
  const handleSendMessage = useCallback(async (content: string) => {
    if (!content || !conversation || !userData) return;
    
    setInputText(""); 
    
    const tempId = Math.random().toString(36).substring(7);
    const message: Message = {
      id: tempId,
      conversationId: conversation.id,
      senderId: userData._id,
      content: content,
      type: 'text',
      status: "sending", // Initially 'sending'
      createdAt: Date.now(),
      tempId: tempId,
    };

    // Optimistic Update
    addMessage(message);
    
    // Stop typing
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendTyping(roomId, false);

    try {
        const socket = await import("@/lib/sockets").then(m => m.getSocket());
        socket.emit("sendMessage", {
            roomId: conversation.id,
            text: content,
            type: 'text',
            tempId,
        });
    } catch (e) {
        console.error("Failed to send", e);
    }
  }, [conversation, userData, addMessage, roomId, sendTyping]);

  const handleTextChange = (text: string) => {
    setInputText(text);

    if (text.length > 0) {
      sendTyping(roomId, true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(roomId, false);
      }, 3000);
    } else {
      sendTyping(roomId, false);
    }
  };

  const handleSendMedia = async (localUri: string, type: 'image' | 'audio') => {
      if (!conversation || !userData) return;
      
      const tempId = Math.random().toString(36).substring(7);
      const message: Message = {
        id: tempId,
        conversationId: conversation.id,
        senderId: userData._id,
        content: localUri, // Show partial/local content immediately
        type: type,
        status: "sending", // New status?
        createdAt: Date.now(),
        tempId: tempId,
      };
      
      // 1. Show immediately
      addMessage(message);

      try {
          // 2. Upload in background
          let uploadedUrl: string | null = null;
          if (type === 'image') {
              const res = await uploadMedia(localUri, 'image');
              // Ensure we extract the URL string
              uploadedUrl = res?.url || (res as any); 
          } else {
              const res = await uploadMedia(localUri, 'audio');
              uploadedUrl = res?.url || (res as any);
          }

          if (uploadedUrl && typeof uploadedUrl === 'string') {
               // 3. Emit socket with REAL url
               const socket = await import("@/lib/sockets").then(m => m.getSocket());
               const msgType = type === 'audio' ? 'voice' : type;
               socket.emit("sendMessage", {
                    roomId: conversation.id,
                    text: uploadedUrl,
                    type: msgType,
                    tempId,
                    attachments: [uploadedUrl]
               });

               // Note: Store will update when socket confirms 'sent' or we can manually update local here if we want instant 'sent' tick.
               // For now, reliance on `sendMessage` ack or `onMessageReceived` via socket reflection needed?
               // Usually `sendMessage` returns ack. The store handles `onMessageReceived`. 
               // Be careful of duplicates. The store's `addMessage` handles dedupe by tempId.
          } else {
              console.error("Upload returned invalid URL", uploadedUrl);
              // Mark as error? 
              // TODO: Update message status to 'failed' in store (requires store action)
          }

      } catch (e) {
          console.error("Media send failed", e);
      }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
       const uri = result.assets[0].uri;
       handleSendMedia(uri, 'image');
    }
  };

  const startRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      sendTyping(roomId, true, true); // Send recording indicator
      const { recording } = await Audio.Recording.createAsync(
         Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording..');
    setRecording(undefined);
    sendTyping(roomId, false, false); 
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    
    if (uri) {
        handleSendMedia(uri, 'audio');
    }
  };

  const playSound = async (uri: string) => {
      if (playingSound) {
          await playingSound.unloadAsync();
          setPlayingSound(undefined);
          setPlayingUri(null);
          // If clicking same sound, toggle off
          if (playingUri === uri) return;
      }
      
      const { sound } = await Audio.Sound.createAsync({ uri });
      setPlayingSound(sound);
      setPlayingUri(uri);
      await sound.playAsync();
      
      sound.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
              setPlayingSound(undefined);
              setPlayingUri(null);
          }
      });
  };


  // Derived Header Status
  const otherUser = conversation?.users?.find(u => u._id !== userData?._id);
  const isOnline = otherUser ? onlineUsers.has(otherUser._id) : false;
  
  const roomTypers = typingUsers[roomId] || {};
  // strict filter: exclude self
  const otherTypers = Object.entries(roomTypers).filter(([uid]) => uid !== userData?._id);
  const isOtherTyping = otherTypers.some(([_, status]) => status === 'typing');
  const isOtherRecording = otherTypers.some(([_, status]) => status === 'recording');
  
  let statusText = "";
  if (isOtherRecording) statusText = "recording...";
  else if (isOtherTyping) statusText = "typing...";
  else if (isOnline) statusText = "Online";

  // Message Grouping (Newest First for Inverted List)
  const messagesReversed = conversation?.messages ? [...conversation.messages].sort((a, b) => b.createdAt - a.createdAt) : [];
  
  const groupedMessages = messagesReversed.reduce((acc: any[], msg, index, array) => {
      const nextMsg = array[index + 1]; 
      acc.push(msg);
      if (!nextMsg || !isSameDay(msg.createdAt, nextMsg.createdAt)) {
          acc.push({ type: 'date', date: msg.createdAt, id: `date-${msg.id}` });
      }
      return acc;
  }, []);

  function isSameDay(d1: number, d2: number) {
      return new Date(d1).toDateString() === new Date(d2).toDateString();
  }
  
  function getDateLabel(timestamp: number) {
      if (isToday(timestamp)) return "Today";
      if (isYesterday(timestamp)) return "Yesterday";
      return format(timestamp, "MMMM d, yyyy");
  }


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={[styles.header, { backgroundColor: themeColors.background, borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderBottomWidth: 1 }]}>
          {/* Header Implementation (Same as before) */}
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 5 }}>
                  <Ionicons name="arrow-back" size={24} color={themeColors.text} />
              </TouchableOpacity>
              
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Image 
                    source={conversation?.task_picture ? { uri: conversation?.task_picture.replace("auto/upload", "image/upload") } : logoImg}
                    style={styles.headerAvatar}
                    contentFit="cover"
                />
                <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.headerTitle, { color: themeColors.text }]} numberOfLines={1}>{conversation?.name || "Chat"}</Text>
                    {statusText !== "" && (
                        <Text style={[styles.headerSubtitle, (statusText === 'typing...' || statusText === 'recording...') ? { color: Colors.brand.secondary } : { color: themeColors.textMuted }]}>
                            {statusText}
                        </Text>
                    )}
                </View>
              </TouchableOpacity>
          </View>
          
          <View style={styles.headerIcons}>
              {/* <TouchableOpacity style={styles.iconButton}><Ionicons name="videocam" size={22} color={WAColors.textPrimary} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}><Ionicons name="call" size={20} color={WAColors.textPrimary} /></TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}><Ionicons name="ellipsis-vertical" size={20} color={WAColors.textPrimary} /></TouchableOpacity> */}
          </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} 
        style={{ flex: 1 }}
     >
         
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color={themeColors.primary} />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={groupedMessages}
          inverted
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 10, paddingBottom: 10 }}
          renderItem={({ item }) => {
              if (item.type === 'date') {
                  return (
                      <View style={styles.dateBadgeContainer}>
                          <View style={[styles.dateBadge, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                              <Text style={[styles.dateBadgeText, { color: themeColors.textMuted }]}>{getDateLabel(item.date)}</Text>
                          </View>
                      </View>
                  )
              }
            //   console.log(item)
              
              const isMe = item.senderId === userData?._id;
              
              return (
                  <View style={[
                      styles.messageContainer, 
                      isMe ? [styles.messageMy, { backgroundColor: isDark ? Colors.brand.secondary : '#E1FFC7' }] : [styles.messageOther, { backgroundColor: isDark ? '#262626' : '#fff' }]
                  ]}>
                      {item.type === 'image' ? (
                          <Image 
                            // source={{ uri: (item.content || "").replace("auto/upload", "image/upload") }} 
                            source={{
  uri:
    (item.content ?? item.attachment?.[0]?.url ?? "")?.replace(
      "auto/upload",
      "image/upload"
    ),
}}

                            style={{ width: 200, height: 200, borderRadius: 8 }} 
                            contentFit="cover"
                          />
                      ) : (item.type === 'audio' || item.type === 'voice') ? (
                          <View style={styles.audioContainer}>
                              <TouchableOpacity onPress={() => playSound(item.content)}>
                                  <Ionicons name={playingUri === item.content ? "pause" : "play"} size={24} color={isMe ? (isDark ? "#000" : "#000") : themeColors.text} />
                              </TouchableOpacity>
                              <View style={{ marginLeft: 10 }}>
                                  <Text style={{ color: isMe ? (isDark ? "#000" : "#000") : themeColors.text, fontSize: 14 }}>Voice Note</Text>
                                  <Text style={{ color: isMe ? (isDark ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)") : themeColors.textMuted, fontSize: 11 }}>Audio Message</Text>
                              </View>
                          </View>
                      ) : (
                          <Text style={[styles.messageText, { color: isMe ? (isDark ? '#000' : '#000') : themeColors.text }]}>{item.content}</Text>
                      )}

                      <View style={styles.messageMeta}>
                          <Text style={[styles.messageTime, { color: isMe ? (isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.5)") : themeColors.textMuted }]}>
                              {format(item.createdAt, "h:mm a")}
                          </Text>
                          {isMe && (
                              <Ionicons 
                                name="checkmark-done" 
                                size={16} 
                                color={item.status === 'read' || item.status === 'seen' || item.status === 'delivered' ? (isDark ? "#000" : "#34B7F1") : (isDark ? "rgba(0,0,0,0.5)" : "#999")} 
                                style={{ marginLeft: 3 }}
                              />
                          )}
                      </View>
                  </View>
              );
          }}
        />
      )}

      {/* Input Bar */}
      <View style={[styles.inputContainer, { backgroundColor: themeColors.background, borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", borderTopWidth: 1 }]}>
          <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
              <Ionicons name="add" size={24} color={themeColors.textMuted} />
          </TouchableOpacity>
           
           <View style={[styles.textInputWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
               <TextInput
                 style={[styles.textInput, { color: themeColors.text }]}
                 placeholder="Message"
                 placeholderTextColor={themeColors.textMuted}
                 multiline
                 value={inputText}
                 onChangeText={handleTextChange}
               />
               {!inputText && (
                   <TouchableOpacity style={{ marginRight: 5 }} onPress={pickImage}>
                        <Ionicons name="camera-outline" size={22} color={themeColors.textMuted} /> 
                   </TouchableOpacity>
               )}
           </View>

           <TouchableOpacity 
             style={[styles.sendButton, { backgroundColor: recording ? '#ef4444' : Colors.brand.secondary }]} 
             onPress={() => {
                 if (inputText.trim()) {
                     handleSendMessage(inputText);
                 } else {
                     if (recording) {
                         stopRecording();
                     } else {
                         startRecording();
                     }
                 }
             }}
           >
               {inputText.trim() ? (
                   <Ionicons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
               ) : (
                   <MaterialCommunityIcons name={recording ? "stop" : "microphone"} size={24} color="#fff" />
               )}
           </TouchableOpacity>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        // elevation: 4,
        zIndex: 10,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#ccc',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        maxWidth: 150,
    },
    headerSubtitle: {
        fontSize: 12,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 18,
    },
    dateBadgeContainer: {
        alignItems: 'center',
        marginVertical: 8,
    },
    dateBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    dateBadgeText: {
        fontSize: 11,
        fontWeight: '500',
    },
    messageContainer: {
        maxWidth: '80%',
        borderRadius: 12,
        padding: 5,
        paddingHorizontal: 8,
        marginVertical: 2,
        marginBottom: 8, // slight spacing
        minWidth: 80,
    },
    messageMy: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    messageOther: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 15,
        paddingRight: 60, // Space for timestamp
        paddingBottom: 4,
    },
    messageMeta: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 3,
        right: 6,
        alignItems: 'center',
    },
    messageTime: {
        fontSize: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 8,
    },
    attachButton: {
        padding: 6,
    },
    textInputWrapper: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 20,
        alignItems: 'center',
        marginHorizontal: 5,
        paddingHorizontal: 12,
        paddingVertical:Platform.OS === 'ios' ? 8 : 4
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 4,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 2,
    },
    audioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        minWidth: 120,
    }
});
