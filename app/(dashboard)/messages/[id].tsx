

// app/messages/[id].tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { InfiniteData } from "@tanstack/react-query";
import { SafeAreaView } from "react-native-safe-area-context";

import { getSocket } from "@/lib/sockets";
import { useGobalStoreContext } from "@/store/global-context";
import { uploadFile as uploadFileHelper } from "./services";
import { getMessages as apiGetMessages, sendMessage as apiSendMessage } from "./services";

dayjs.extend(relativeTime);

/* ------------------------
 Types
-------------------------*/
type ChatUser = {
  _id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string | null;
};

type Chat = {
  _id: string;
  name: string;
  taskId: string;
  task_picture?: string;
  participants: string[];
  lastMessageAt: string;
  unreadCount: number;
  users: ChatUser[];
  task?: { _id: string; task: string };
};

type Message = {
  _id: string;
  roomId?: string;
  chatId?: string;
  sender: string;
  senderUser?: ChatUser;
  type: "text" | "image" | "video" | "file" | "voice";
  text?: string;
  url?: string;
  filename?: string;
  duration?: number;
  attachments?: any[];
  replyTo?: { _id: string; text?: string; senderUser?: ChatUser };
  createdAt: string;
  // client-side only:
  localId?: string;
  status?: "sending" | "sent" | "failed";
};

type GetMessagesResult = {
  messages: Message[];
  nextCursor?: string | null;
};

/* ------------------------
 Helpers
-------------------------*/
const formatTime = (iso?: string) => {
  if (!iso) return "";
  const d = dayjs(iso);
  if (d.isSame(dayjs(), "day")) return d.format("h:mm A");
  return d.fromNow();
};

const localId = () => `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const normalizeGetMessagesResponse = async (res: any): Promise<GetMessagesResult> => {
  if (!res) return { messages: [], nextCursor: undefined };
  if (Array.isArray(res)) return { messages: res, nextCursor: undefined };
  if (res.messages) return { messages: res.messages, nextCursor: res.nextCursor ?? undefined };
  return { messages: Array.isArray(res) ? res : [], nextCursor: undefined };
};

/* ------------------------
 MessageBubble (memoized)
-------------------------*/
const MessageBubble = React.memo(
  function MessageBubble({
    message,
    isMine,
    onLongPress,
    onPressReply,
    highlighted,
  }: {
    message: Message;
    isMine: boolean;
    onLongPress: (m: Message) => void;
    onPressReply: (replyToId: string) => void;
    highlighted?: boolean;
  }) {
    const containerStyle = [styles.bubbleRow, isMine ? styles.bubbleRowRight : styles.bubbleRowLeft];

    const bubbleStyle = [
      styles.bubble,
      isMine ? styles.bubbleMine : styles.bubbleTheirs,
      highlighted ? { backgroundColor: isMine ? "#16a34a" : "#fff9c4" } : {},
    ];

    return (
      <Pressable onLongPress={() => onLongPress(message)} style={containerStyle}>
        {!isMine && message.senderUser && (
          <Image
            source={{ uri: message.senderUser.profile_picture || "" }}
            style={styles.avatarSmall}
            contentFit="cover"
          />
        )}

        <View style={bubbleStyle}>
          {message.replyTo && (
            <TouchableOpacity onPress={() => onPressReply(message.replyTo!._id)} style={styles.replyPreview}>
              <Text numberOfLines={1} style={styles.replyPreviewText}>
                {message.replyTo.text ?? "Reply"}
              </Text>
            </TouchableOpacity>
          )}

          {message.type === "text" && (
            <Text style={[styles.bubbleText, isMine ? styles.textMine : styles.textTheirs]}>{message.text}</Text>
          )}

          {message.type === "image" && message.url && (
            <Image source={{ uri: message.url }} style={styles.media} contentFit="cover" />
          )}

          {message.type === "video" && message.url && (
            <View style={styles.media}>
              <Image source={{ uri: message.url }} style={styles.media} contentFit="cover" />
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={34} color="#fff" />
              </View>
            </View>
          )}

          {message.type === "file" && (
            <View style={styles.fileContainer}>
              <Ionicons name="document" size={18} color="#111" />
              <Text style={styles.fileName} numberOfLines={1}>
                {message.filename ?? "Attachment"}
              </Text>
            </View>
          )}

          {message.type === "voice" && (
            <View style={styles.voiceContainer}>
              <Ionicons name="mic" size={16} color={isMine ? "#fff" : "#111"} />
              <Text style={[styles.bubbleText, isMine ? styles.textMine : styles.textTheirs]}>
                {message.duration ? `${Math.round(message.duration)}s` : "Voice"}
              </Text>
            </View>
          )}

          <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
        </View>

        {isMine && <View style={{ width: 24 }} />}
      </Pressable>
    );
  },
  (a, b) => a.message._id === b.message._id && a.highlighted === b.highlighted
);

/* ------------------------
 Composer UI
-------------------------*/
function Composer({
  value,
  setValue,
  onSend,
  onPickImage,
  onPickFile,
  onStartRecording,
  onStopRecording,
  recording,
  replyingTo,
  cancelReply,
  sending,
}: {
  value: string;
  setValue: (s: string) => void;
  onSend: (text: string) => void;
  onPickImage: () => Promise<void>;
  onPickFile: () => Promise<void>;
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  recording: boolean;
  replyingTo?: Message | null;
  cancelReply: () => void;
  sending: boolean;
}) {
  const canSend = value.trim().length > 0;

  return (
    <View style={composerStyles.container}>
      {replyingTo && (
        <View style={composerStyles.replyRow}>
          <View style={{ flex: 1 }}>
            <Text style={composerStyles.replyLabel}>Replying to</Text>
            <Text numberOfLines={1} style={composerStyles.replyText}>
              {replyingTo.text ?? (replyingTo.type === "image" ? "Image" : "Attachment")}
            </Text>
          </View>
          <TouchableOpacity onPress={cancelReply} style={composerStyles.replyClose}>
            <Ionicons name="close" size={18} color="#374151" />
          </TouchableOpacity>
        </View>
      )}

      <View style={composerStyles.row}>
        <TouchableOpacity onPress={onPickImage} style={composerStyles.iconBtn}>
          <Ionicons name="image" size={22} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPickFile} style={composerStyles.iconBtn}>
          <Ionicons name="attach" size={22} color="#111" />
        </TouchableOpacity>

        <TextInput
          value={value}
          onChangeText={setValue}
          style={composerStyles.input}
          placeholder="Message"
          multiline
          placeholderTextColor="#9CA3AF"
          returnKeyType="send"
          onSubmitEditing={() => canSend && onSend(value.trim())}
        />

        <TouchableOpacity
          onPress={() => canSend && onSend(value.trim())}
          style={[composerStyles.sendBtn, !canSend && { opacity: 0.6 }]}
          disabled={!canSend || sending}
        >
          {sending ? <ActivityIndicator color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
        </TouchableOpacity>

        <Pressable
          onPressIn={onStartRecording}
          onPressOut={onStopRecording}
          style={[composerStyles.recordBtn, recording ? { backgroundColor: "#ef4444" } : undefined]}
        >
          <Ionicons name="mic" size={18} color={recording ? "#fff" : "#111"} />
        </Pressable>
      </View>
    </View>
  );
}

/* ------------------------
 Main Screen
-------------------------*/
export default function ChatScreen() {
  const { id, data } = useLocalSearchParams();
  const chatData = data ? (JSON.parse(data as string) as Chat) : null;
  const chatId: string | undefined = (id as string) ?? chatData?._id ?? undefined;

  const router = useRouter();
  const qc = useQueryClient();
  const { userData } = useGobalStoreContext();
  const meId = userData?._id ?? "me";

  // UI & local state
  const [textValue, setTextValue] = useState("");
  const [recording, setRecording] = useState(false);
  const [audioRec, setAudioRec] = useState<Audio.Recording | null>(null);
  const [sending, setSending] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<Message> | null>(null);
  const socketRef = useRef<any>(null);

  /* ------------------------
   Messages infinite query
  -------------------------*/
  const PAGE_SIZE = 40;
  const {
  data: pages,
  isLoading,
  isFetchingNextPage,
  fetchNextPage,
  hasNextPage,
  refetch,
} = useInfiniteQuery<GetMessagesResult, Error>({
  queryKey: ["messages", chatId ?? ""],
  queryFn: async ({ pageParam }) => {
    const res = await apiGetMessages(
      chatId,
      (pageParam as string | null) ?? null,
      PAGE_SIZE,
    );
    return normalizeGetMessagesResponse(res);
  },
  initialPageParam: null, // ✅ required
  getNextPageParam: (lastPage: GetMessagesResult) => lastPage?.nextCursor ?? undefined,
  enabled: !!chatId,
  staleTime: 30_000,
  gcTime: 1000 * 60 * 60,
});

const messages = useMemo(() => {
  if (!pages?.pages) return [] as Message[];
  const all = pages.pages.flatMap((p: GetMessagesResult) => p.messages ?? []);
  return [...all].reverse();
}, [pages]);

  /* ------------------------
   Socket: connect, join room, receive messages
  -------------------------*/
  useEffect(() => {
    if (!chatId) return;
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", { roomId: chatId });

    const onMessage = (msg: any) => {
      const incoming: Message = {
        _id: msg._id,
        roomId: msg.roomId ?? msg.chatId ?? chatId,
        sender: msg.sender,
        senderUser: msg.senderUser ?? undefined,
        type: msg.type ?? "text",
        text: msg.text,
        url: msg.url,
        filename: msg.filename,
        attachments: msg.attachments,
        replyTo: msg.replyTo ?? msg.replyToMessage ?? undefined,
        createdAt: msg.createdAt ?? new Date().toISOString(),
      };

      qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
        if (!old) {
          return { pages: [{ messages: [incoming], nextCursor: undefined }] };
        }
        const already = old.pages.some((p: any) => p.messages?.some((m: Message) => m._id === incoming._id));
        if (already) return old;
        const newPages = [...old.pages];
        if (!newPages[0]) newPages[0] = { messages: [incoming], nextCursor: undefined };
        else newPages[0] = { ...newPages[0], messages: [incoming, ...(newPages[0].messages ?? [])] };
        return { ...old, pages: newPages };
      });

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 60);
    };

    socket.on("message", onMessage);

    return () => {
      socket.off("message", onMessage);
      socket.emit("leaveRoom", { roomId: chatId });
    };
  }, [chatId, qc]);

  /* ------------------------
   Optimistic send mutation (server fallback via HTTP)
  -------------------------*/
  const sendMut = useMutation({
    mutationFn: async (payload: {
      roomId: string;
      type: Message["type"];
      text?: string;
      url?: string;
      filename?: string;
      duration?: number;
      replyTo?: string;
    }) => {
      const srv = await apiSendMessage(payload);
      return srv;
    },
    onMutate: async (payload) => {
      const lid = localId();
      const optimistic: Message = {
        _id: lid,
        roomId: payload.roomId,
        sender: meId,
        senderUser: {
          _id: meId,
          first_name: userData?.first_name ?? "You",
          last_name: userData?.last_name ?? "",
          profile_picture: userData?.profile_picture,
        },
        type: payload.type,
        text: payload.text,
        url: payload.url,
        filename: payload.filename,
        duration: payload.duration,
        replyTo: payload.replyTo ? { _id: payload.replyTo } : undefined,
        createdAt: new Date().toISOString(),
        localId: lid,
        status: "sending",
      };

      await qc.cancelQueries({ queryKey: ["messages", chatId ?? ""] });
      qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
        if (!old) return { pages: [{ messages: [optimistic], nextCursor: undefined }] };
        const newPages = [...old.pages];
        if (!newPages[0]) newPages[0] = { messages: [optimistic], nextCursor: undefined };
        else newPages[0] = { ...newPages[0], messages: [optimistic, ...(newPages[0].messages ?? [])] };
        return { ...old, pages: newPages };
      });

      return { localId: lid };
    },
    onSuccess: (serverMsg, _vars, context) => {
      qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
        if (!old) return old;
        const newPages = old.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((m: Message) => (m.localId === context?.localId ? serverMsg : m)),
        }));
        return { ...old, pages: newPages };
      });
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
        if (!old) return old;
        const newPages = old.pages.map((page: any) => ({
          ...page,
          messages: page.messages.map((m: Message) =>
            m.localId === context?.localId ? { ...m, status: "failed" } : m
          ),
        }));
        return { ...old, pages: newPages };
      });
    },
  });

  /* ------------------------
   Sending via socket (primary)
  -------------------------*/
  const socketSend = useCallback(
    async (payload: {
      roomId: string;
      type: Message["type"];
      text?: string;
      url?: string;
      filename?: string;
      duration?: number;
      replyTo?: string;
    }) => {
      const socket = getSocket();
      if (!socket || !socket.connected) {
        await sendMut.mutateAsync(payload);
        return;
      }

      const lid = localId();
      const optimistic: Message = {
        _id: lid,
        roomId: payload.roomId,
        sender: meId,
        senderUser: { _id: meId, first_name: userData?.first_name ?? "You", last_name: userData?.last_name ?? "", profile_picture: userData?.profile_picture },
        type: payload.type,
        text: payload.text,
        url: payload.url,
        filename: payload.filename,
        duration: payload.duration,
        replyTo: payload.replyTo ? { _id: payload.replyTo } : undefined,
        createdAt: new Date().toISOString(),
        localId: lid,
        status: "sending",
      };

      qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
        if (!old) return { pages: [{ messages: [optimistic], nextCursor: undefined }] };
        const newPages = [...old.pages];
        if (!newPages[0]) newPages[0] = { messages: [optimistic], nextCursor: undefined };
        else newPages[0] = { ...newPages[0], messages: [optimistic, ...(newPages[0].messages ?? [])] };
        return { ...old, pages: newPages };
      });

      socket.emit(
        "sendMessage",
        {
          roomId: payload.roomId,
          type: payload.type,
          text: payload.text,
          replyTo: payload.replyTo,
        },
        (ack: any) => {
          if (ack && ack.message) {
            qc.setQueryData(["messages", chatId ?? ""], (old: any) => {
              if (!old) return old;
              const newPages = old.pages.map((page: any) => {
                const msgs: Message[] = page.messages ?? [];
                return {
                  ...page,
                  messages: msgs.map((m) => (m.localId === optimistic.localId ? ack.message : m)),
                };
              });
              return { ...old, pages: newPages };
            });
          }
        }
      );

      // fallback HTTP persist
      sendMut.mutateAsync(payload).catch(() => {});
    },
    [meId, userData, qc, chatId, sendMut]
  );

  /* ------------------------
   Handlers: pick image/file & send
  -------------------------*/
  const pickImage = useCallback(async () => {
    try {
      const p = (await ImagePicker.requestMediaLibraryPermissionsAsync()) as ImagePicker.MediaLibraryPermissionResponse;
      if (!p.granted) {
        Alert.alert("Permission required", "Please allow access to photos.");
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      // new API returns { canceled, assets } shape
      if ((res as any).canceled || (res as any).cancelled) return;

      const asset = (res as any).assets?.[0] ?? (res as any);
      if (!asset?.uri) return;

      setSending(true);
      const uploaded = await uploadFileHelper(asset.uri);
      await socketSend({ roomId: chatId!, type: "image", url: uploaded.url, 
        // filename: uploaded.filename ?? undefined
       });
    } catch (err) {
      console.warn(err);
      Alert.alert("Image upload failed");
    } finally {
      setSending(false);
    }
  }, [chatId, socketSend]);

  const pickFile = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });

      // support multiple shapes across SDK versions
      if ((res as any).type === "cancel" || (res as any).canceled) return;

      const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri;
      const name = (res as any).name ?? (res as any).assets?.[0]?.name;
      const mime = (res as any).mimeType ?? (res as any).assets?.[0]?.mimeType ?? undefined;
      if (!uri) return;

      setSending(true);
      const uploaded = await uploadFileHelper(uri, 
        // mime
      );
      await socketSend({ roomId: chatId!, type: "file", url: uploaded.url, filename: name });
    } catch (err) {
      console.warn(err);
      Alert.alert("File upload failed");
    } finally {
      setSending(false);
    }
  }, [chatId, socketSend]);

  /* ------------------------
   Voice record
  -------------------------*/
  const startRecording = useCallback(async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission required", "Please allow microphone access.");
        return;
      }
      setRecording(true);
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setAudioRec(rec);
    } catch (err) {
      console.warn(err);
      setRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!audioRec) {
      setRecording(false);
      return;
    }
    try {
      await audioRec.stopAndUnloadAsync();
      const uri = audioRec.getURI();
      const status = await audioRec.getStatusAsync();
      const duration = status.durationMillis ? Math.round(status.durationMillis / 1000) : undefined;
      setRecording(false);
      setAudioRec(null);

      if (!uri) {
        Alert.alert("Recording failed");
        return;
      }
      setSending(true);
      const uploaded = await uploadFileHelper(uri);
      await socketSend({ roomId: chatId!, type: "voice", url: uploaded.url, 
        // filename: uploaded.filename ?? undefined,
         duration });
    } catch (err) {
      console.warn(err);
      Alert.alert("Recording error");
      setRecording(false);
      setAudioRec(null);
    } finally {
      setSending(false);
    }
  }, [audioRec, chatId, socketSend]);

  /* ------------------------
   Text send
  -------------------------*/
  const sendText = useCallback(
    async (text: string) => {
      if (!text || !chatId) return;
      const payload: any = { roomId: chatId, type: "text", text };
      if (replyingTo) payload.replyTo = replyingTo._id;
      setSending(true);
      try {
        await socketSend(payload);
        setTextValue("");
        setReplyingTo(null);
      } catch (err) {
        console.warn(err);
        Alert.alert("Send failed");
      } finally {
        setSending(false);
      }
    },
    [chatId, socketSend, replyingTo]
  );

  /* ------------------------
   Reply / scroll / render helpers
  -------------------------*/
  const onLongPressMessage = useCallback((m: Message) => setReplyingTo(m), []);
  const cancelReply = useCallback(() => setReplyingTo(null), []);

  const scrollToMessage = useCallback(
    (messageId: string) => {
      const foundIndex = messages.findIndex((m) => m._id === messageId);
      if (foundIndex === -1) {
        refetch().then(() => {
          const idx = messages.findIndex((m) => m._id === messageId);
          if (idx === -1) return;
          const invertedIndex = messages.length - 1 - idx;
          flatListRef.current?.scrollToIndex({ animated: true, index: invertedIndex, viewPosition: 0.5 });
        });
        return;
      }
      const invertedIndex = messages.length - 1 - foundIndex;
      try {
        flatListRef.current?.scrollToIndex({ animated: true, index: invertedIndex, viewPosition: 0.5 });
        setHighlightedMessageId(messageId);
        setTimeout(() => setHighlightedMessageId(null), 2200);
      } catch {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
      }
    },
    [messages, refetch]
  );

  const onPressReplyPreview = useCallback((replyToId: string) => scrollToMessage(replyToId), [scrollToMessage]);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isMine = item.sender === meId;
      return (
        <MessageBubble
          message={item}
          isMine={isMine}
          onLongPress={onLongPressMessage}
          onPressReply={onPressReplyPreview}
          highlighted={highlightedMessageId === item._id}
        />
      );
    },
    [meId, onLongPressMessage, onPressReplyPreview, highlightedMessageId]
  );

  const keyExtractor = useCallback((m: Message) => m._id, []);

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, 120);
  }, []);

  // const otherUsersLabel = useMemo(() => {
  //   if (!chatData?.users) return "";
  //   return chatData
  //     .filter ? chatData.users.filter((u) => u._id !== meId).map((u) => `${u.first_name.trim()} ${u.last_name.trim()}`).join(", ")
  //     : "";
  // }, [chatData, meId]);

  const otherUsersLabel = useMemo(() => {
  if (!chatData?.users) return "";
  return chatData.users
    .filter((u) => u._id !== meId)
    .map((u) => `${u.first_name.trim()} ${u.last_name.trim()}`)
    .join(", ");
}, [chatData, meId]);


  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={22} color="#111" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {chatData?.name ?? otherUsersLabel ?? "Chat"}
          </Text>
          <Text numberOfLines={1} style={styles.headerSubtitle}>
            {otherUsersLabel}
          </Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 80}>
        <View style={styles.messagesWrap}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No messages yet — say hi 👋</Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={keyExtractor}
              renderItem={renderItem}
              inverted
              onEndReached={loadMore}
              onEndReachedThreshold={0.1}
              initialNumToRender={30}
              maxToRenderPerBatch={30}
              windowSize={21}
              removeClippedSubviews
              contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 12 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        <Composer
          value={textValue}
          setValue={setTextValue}
          onSend={sendText}
          onPickImage={pickImage}
          onPickFile={pickFile}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          recording={recording}
          replyingTo={replyingTo}
          cancelReply={cancelReply}
          sending={sending}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ------------------------
 Styles
-------------------------*/
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFB" },
  header: {
    height: 72,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E6EEF3",
    backgroundColor: "#fff",
  },
  headerBack: { width: 44, alignItems: "flex-start" },
  headerInfo: { flex: 1, paddingHorizontal: 8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#0F172A" },
  headerSubtitle: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  messagesWrap: { flex: 1 },

  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#9CA3AF" },

  bubbleRow: { flexDirection: "row", alignItems: "flex-end", marginVertical: 6 },
  bubbleRowLeft: { justifyContent: "flex-start" },
  bubbleRowRight: { justifyContent: "flex-end" },

  avatarSmall: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },

  bubble: {
    maxWidth: "78%",
    borderRadius: 14,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleMine: { backgroundColor: "#22C55E", borderBottomRightRadius: 4 },
  bubbleTheirs: { backgroundColor: "#fff", borderBottomLeftRadius: 4, borderWidth: 1, borderColor: "#EEF2F5" },

  bubbleText: { fontSize: 15, lineHeight: 20 },
  textMine: { color: "#fff" },
  textTheirs: { color: "#0F172A" },

  timeText: { fontSize: 11, color: "#94A3B8", marginTop: 6, alignSelf: "flex-end" },

  media: { width: 240, height: 160, borderRadius: 12, overflow: "hidden" },
  playOverlay: { position: "absolute", left: "45%", top: "40%" },

  fileContainer: { flexDirection: "row", alignItems: "center", gap: 8 },
  fileName: { flex: 1, marginLeft: 8, color: "#111" },

  voiceContainer: { flexDirection: "row", alignItems: "center", gap: 8 },

  replyPreview: { borderLeftWidth: 3, borderLeftColor: "#E6EEF3", paddingLeft: 8, marginBottom: 6 },
  replyPreviewText: { color: "#6B7280", fontSize: 13 },
});

const composerStyles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E6EEF3",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  row: { flexDirection: "row", alignItems: "flex-end" },
  iconBtn: { padding: 8, marginRight: 6 },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 140,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#F3F6F9",
    borderRadius: 18,
    color: "#0F172A",
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    marginLeft: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recordBtn: {
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: "#E6EEF3",
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F6F9",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  replyLabel: { fontSize: 12, color: "#374151", fontWeight: "600" },
  replyText: { fontSize: 13, color: "#6B7280" },
  replyClose: { padding: 6, marginLeft: 8 },
});

