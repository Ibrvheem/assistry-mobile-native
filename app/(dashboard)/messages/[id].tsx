

// ChatScreen.tsx

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
  GestureResponderEvent
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { DualAvatar } from './helper'
import { Avatar, SingleAvatar } from '@/app/avatar'
import * as DocumentPicker from 'expo-document-picker'
import { Audio } from 'expo-av'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getSocket } from '@/lib/sockets'
import { useGobalStoreContext } from '@/store/global-context'
import {
  uploadFile as uploadFileHelper,
  getMessages as apiGetMessages,
  sendMessage as apiSendMessage
} from './services'
import { cloudinaryUrl } from '@/lib/helpers'
import { Upload } from 'lucide-react-native'
import ImageGrid from './imagegrid'
import { Socket } from 'socket.io-client'


dayjs.extend(relativeTime)

type ChatUser = {
  _id: string
  first_name: string
  last_name: string
  profile_picture?: string | null
}

type MessageType = 'text' | 'image' | 'video' | 'file' | 'voice'
export type Attachment = {
  url: string;
  key?: string;
  kind?: string;
};


export type Message = {
  _id: string
  roomId: string
  sender: string
  senderUser?: ChatUser
  type: MessageType
  text?: string
  url?: string
  filename?: string
  duration?: number
  attachments?: Attachment[]
  replyTo?: { _id: string; text?: string }
  createdAt: string
  localId?: string
  status?: 'sending' | 'sent' | 'delivered' | 'seen' | 'failed'
}

type GetMessagesResult = {
  messages: Message[]
  nextCursor?: string | null
}

const formatTime = (iso?: string) => {
  if (!iso) return ''
  const d = dayjs(iso)
  if (d.isSame(dayjs(), 'day')) return d.format('h:mm A')
  return d.fromNow()
}

const generateLocalId = () =>
  `local-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

const MessageBubble = React.memo(
  ({
    message,
    isMine,
    onSwipeReply,
    highlighted
  }: {
    message: Message
    isMine: boolean
    onSwipeReply: (msg: Message) => void
    highlighted: boolean
  }) => {
    const containerStyle = isMine ? styles.bubbleRowRight : styles.bubbleRowLeft
    const bubbleStyle = [
      styles.bubble,
      isMine ? styles.bubbleMine : styles.bubbleTheirs,
      highlighted ? { backgroundColor: isMine ? '#16a34a' : '#fff9c4' } : null
    ]

    // Simple horizontal gesture: we detect a move to right beyond threshold
    const panResponderRef = useRef<{
      startX: number
      hasSwiped: boolean
    }>({ startX: 0, hasSwiped: false })

    const onTouchStart = (e: GestureResponderEvent) => {
      panResponderRef.current.startX = e.nativeEvent.pageX
      panResponderRef.current.hasSwiped = false
    }
    const onTouchMove = (e: GestureResponderEvent) => {
      const dx = e.nativeEvent.pageX - panResponderRef.current.startX
      const threshold = 50 // px to consider a swipe right
      if (dx > threshold && !panResponderRef.current.hasSwiped) {
        panResponderRef.current.hasSwiped = true
        onSwipeReply(message)
      }
    }
    // console.log('URL',message.url)

    return (
      <Pressable
        onPress={() => {}}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        style={[styles.bubbleRow, containerStyle]}
      >
        {!isMine && message.senderUser && (
          <Image
            source={{ uri: message.senderUser.profile_picture || '' }}
            style={styles.avatarSmall}
            contentFit='cover'
          />
        )}

        <View style={bubbleStyle}>
          {message.replyTo && (
            <TouchableOpacity
              onPress={() => {
                // Could scroll to message, or open thread
              }}
              style={styles.replyPreview}
            >
              <Text numberOfLines={1} style={styles.replyPreviewText}>
                {message.replyTo.text ?? 'Reply'}
              </Text>
            </TouchableOpacity>
          )}

          {message.type === 'text' && (
            <Text
              style={[
                styles.bubbleText,
                isMine ? styles.textMine : styles.textTheirs
              ]}
            >
              {message.text}
            </Text>
          )}
          {message.type === 'image' && message.attachments && (
            <ImageGrid message={message} cloudinaryUrl={cloudinaryUrl} />
            // <Image
            //   source={{ uri: cloudinaryUrl(message.url) }}
            //   style={styles.media}
            //   contentFit='cover'
            // />
          )}
          {message.type === 'video' && message.url && (
            <View style={styles.media}>
              <Image
                source={{ uri: message.url }}
                style={styles.media}
                contentFit='cover'
              />
              <View style={styles.playOverlay}>
                <Ionicons name='play-circle' size={34} color='#fff' />
              </View>
            </View>
          )}
          {message.type === 'file' && (
            <View style={styles.fileContainer}>
              <Ionicons name='document' size={18} color='#111' />
              <Text style={styles.fileName} numberOfLines={1}>
                {message.filename ?? 'Attachment'}
              </Text>
            </View>
          )}
          {message.type === 'voice' && (
            <View style={styles.voiceContainer}>
              <Ionicons name='mic' size={16} color={isMine ? '#fff' : '#111'} />
              <Text
                style={[
                  styles.bubbleText,
                  isMine ? styles.textMine : styles.textTheirs
                ]}
              >
                {message.duration
                  ? `${Math.round(message.duration)}s`
                  : 'Voice'}
              </Text>
            </View>
          )}

          <View style={styles.bubbleFooter}>
            <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
            {isMine && message.status && (
              // <Text style={styles.statusText}>{message.status}</Text>
              <View style={{ marginLeft: 4 }}>
    {message.status === 'sending' && (
      <Ionicons name="time-outline" size={14} color="#6B7280" /> // small clock
    )}
    {message.status === 'sent' && (
      <Ionicons name="checkmark-done" size={14} color="#3B82F6" /> // blue tick
    )}
    {message.status === 'failed' && (
      <Ionicons name="alert-circle" size={14} color="#EF4444" /> // red caution
    )}
  </View>

            )}
          </View>
        </View>

        {isMine && <View style={{ width: 24 }} />}
      </Pressable>
    )
  },
  (prev, next) =>
    prev.message._id === next.message._id &&
    prev.highlighted === next.highlighted
)

const Composer = ({
  value,
  setValue,
  onSendText,
  onPickImage,
  onPickFile,
  onStartRecording,
  onStopRecording,
  recording,
  replyingTo,
  cancelReply,
  sending
}: {
  value: string
  setValue: (s: string) => void
  onSendText: (text: string) => void
  onPickImage: () => Promise<void>
  onPickFile: () => Promise<void>
  onStartRecording: () => Promise<void>
  onStopRecording: () => Promise<void>
  recording: boolean
  replyingTo?: Message | null
  cancelReply: () => void
  sending: boolean
}) => {
  const canSend = value.trim().length > 0

  return (
    <View style={composerStyles.container}>
      {replyingTo && (
        <View style={composerStyles.replyRow}>
          <View style={{ flex: 1 }}>
            <Text style={composerStyles.replyLabel}>Replying to</Text>
            <Text numberOfLines={1} style={composerStyles.replyText}>
              {replyingTo.text ??
                (replyingTo.type === 'image' ? 'Image' : 'Attachment')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={cancelReply}
            style={composerStyles.replyClose}
          >
            <Ionicons name='close' size={18} color='#374151' />
          </TouchableOpacity>
        </View>
      )}

      <View style={composerStyles.row}>
        <TouchableOpacity onPress={onPickImage} style={composerStyles.iconBtn}>
          <Ionicons name='image' size={22} color='#111' />
        </TouchableOpacity>

        <TouchableOpacity onPress={onPickFile} style={composerStyles.iconBtn}>
          <Ionicons name='attach' size={22} color='#111' />
        </TouchableOpacity>

        <TextInput
          value={value}
          onChangeText={setValue}
          style={composerStyles.input}
          placeholder='Message'
          multiline
          placeholderTextColor='#9CA3AF'
          returnKeyType='send'
          onSubmitEditing={() => canSend && onSendText(value.trim())}
        />

        <TouchableOpacity
          onPress={() => canSend && onSendText(value.trim())}
          style={[composerStyles.sendBtn, !canSend && { opacity: 0.6 }]}
          // disabled={!canSend || sending}
        >
          <Ionicons name='send' size={18} color='#fff' />
          {/* {sending ? (
            <ActivityIndicator color='#fff' />
          ) : (
            <Ionicons name='send' size={18} color='#fff' />
          )} */}
        </TouchableOpacity>

        <Pressable
          onPressIn={onStartRecording}
          onPressOut={onStopRecording}
          style={[
            composerStyles.recordBtn,
            recording ? { backgroundColor: '#ef4444' } : undefined
          ]}
        >
          <Ionicons name='mic' size={18} color={recording ? '#fff' : '#111'} />
        </Pressable>
      </View>
    </View>
  )
}

export default function ChatScreen () {
  const [status, setStatus] = useState<"connected" | "connecting" | "error">("connecting");

  useEffect(() => {
    let isMounted = true;
    let socketInstance: any;

    const initSocket = async () => {
      try {
        setStatus("connecting");
        socketInstance = await getSocket();

        if (!isMounted) return;

        // Update status when connected
        if (socketInstance.connected) setStatus("connected");

        // Listen to socket events
        socketInstance.on("connect", () => setStatus("connected"));
        socketInstance.on("disconnect", () => setStatus("error"));
        socketInstance.on("connect_error", () => setStatus("error"));
        socketInstance.io.on("reconnect_attempt", () => setStatus("connecting"));
      } catch (err) {
        console.error("Socket init error:", err);
        if (isMounted) setStatus("error");
      }
    };

    initSocket();

    return () => {
      isMounted = false;
      socketInstance?.off("connect");
      socketInstance?.off("disconnect");
      socketInstance?.off("connect_error");
      socketInstance?.io.off("reconnect_attempt");
    };
  }, []);

  // Determine dot color
  const dotColor = status === "connected" ? "green" : status === "connecting" ? "yellow" : "red";
  const { id, data } = useLocalSearchParams()
  const chatData = data ? (JSON.parse(data as string) as any) : null
  
  const chatId = (id as string) ?? chatData?._id

  const router = useRouter()
  const qc = useQueryClient()
  const { userData } = useGobalStoreContext()
  const meId = userData?._id ?? 'me'
  // // console.log('Other chat user',chatData.users where thser )
 
  
const otherUser = chatData.users.find((user: any) => user._id !== meId);
const OtherUserImg = otherUser ? cloudinaryUrl(otherUser.profile_picture): null;



  const [textValue, setTextValue] = useState('')
  const [recording, setRecording] = useState(false)
  const [audioRec, setAudioRec] = useState<Audio.Recording | null>(null)
  const [sending, setSending] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null)
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({})

  const flatListRef = useRef<FlatList<Message> | null>(null)
  const socketRef = useRef<any>(null)

  // Infinite messages query
  const PAGE_SIZE = 40
  const {
    data: pages,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch
  } = useInfiniteQuery<GetMessagesResult, Error>({
    queryKey: ['messages', chatId ?? ''],
    queryFn: async ({ pageParam }) => {
      const res = await apiGetMessages(
        chatId,
        (pageParam as string | null) ?? null,
        PAGE_SIZE
      )
      // console.log('RES_MSG', res)
      if (!res) return { messages: [], nextCursor: undefined }
      if (Array.isArray(res)) return { messages: res, nextCursor: undefined }
      return { messages: res.messages, nextCursor: res.nextCursor ?? undefined }
    },
    initialPageParam: null, // ✅ required
    // getNextPageParam: (lastPage: GetMessagesResult) =>
    //   lastPage?.nextCursor ?? undefined,
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    enabled: !!chatId,
    staleTime: 30_000,
    gcTime: 1000 * 60 * 60
  })

  const messages = useMemo(() => {
    if (!pages) return []
    const all = pages.pages.flatMap(p => p.messages ?? [])
    return [...all].reverse()
  }, [pages])

  // console.log('Messages',messages)

  // Connect socket, subscribe to events
  useEffect(() => {
    if (!chatId) return

    let isMounted = true
    ;(async () => {
      const socket = await getSocket()
      socketRef.current = socket
      if (!socket.connected) socket.connect()

      // Join the room
      socket.emit('joinRoom', { roomId: chatId })

      const handleIncoming = (msg: any) => {
        if (!isMounted) return
        if (msg.sender === meId) return
        const incoming: Message = {
          _id: msg._id,
          roomId: msg.roomId ?? chatId,
          sender: msg.sender,
          senderUser: msg.senderUser,
          type: msg.type ?? 'text',
          text: msg.text,
          url: msg.url,
          filename: msg.filename,
          attachments: msg.attachments,
          replyTo: msg.replyTo
            ? { _id: msg.replyTo._id || msg.replyTo, text: msg.replyTo.text }
            : undefined,
          createdAt: msg.createdAt ?? new Date().toISOString()
        }
        qc.setQueryData(['messages', chatId], (old: any) => {
          if (!old) {
            return { pages: [{ messages: [incoming], nextCursor: undefined }] }
          }
          // prevent duplicates
          const exists = old.pages.some((page: any) =>
            page.messages.some((m: Message) => m._id === incoming._id)
          )
          if (exists) return old
          const newPages = [...old.pages]
          newPages[0] = {
            ...newPages[0],
            // messages: [incoming, ...(newPages[0].messages ?? [])]
            messages: [...(newPages[0].messages ?? []), incoming]

          }
          return { ...old, pages: newPages }
        })

        // scroll to bottom after small delay
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        }, 50)
      }

      const handleTyping = (d: any) => {
        if (!isMounted) return
        const { userId, isTyping } = d
        setTypingUsers(prev => {
          const next = { ...prev }
          if (isTyping) next[userId] = true
          else delete next[userId]
          return next
        })
      }

      const handleStatus = (d: any) => {
        if (!isMounted) return
        const { messageId, status } = d
        // update the status of message in cache
        qc.setQueryData(['messages', chatId], (old: any) => {
          if (!old) return old
          const newPages = old.pages.map((page: any) => {
            const msgs = page.messages.map((m: Message) =>
              m._id === messageId ? { ...m, status } : m
            )
            return { ...page, messages: msgs }
          })
          return { ...old, pages: newPages }
        })
      }

      socket.on('message', handleIncoming)
      socket.on('userTyping', handleTyping)
      socket.on('messageStatus', handleStatus)

      return () => {
        isMounted = false
        socket.off('message', handleIncoming)
        socket.off('userTyping', handleTyping)
        socket.off('messageStatus', handleStatus)
        socket.emit('leaveRoom', { roomId: chatId })
      }
    })()

    return () => {
      // cleanup
    }
  }, [chatId, qc])

  // Typing emitter: debounce
  useEffect(() => {
    if (!socketRef.current) return
    const socket = socketRef.current
    let timeout: ReturnType<typeof setTimeout>

    if (textValue.length > 0) {
      socket.emit('typing', { roomId: chatId, isTyping: true })

      timeout = setTimeout(() => {
        socket.emit('typing', { roomId: chatId, isTyping: false })
      }, 2000)
    } else {
      socket.emit('typing', { roomId: chatId, isTyping: false })
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [textValue])

  // send message mutation (HTTP fallback)
  const sendMut = useMutation({
    mutationFn: async (payload: {
      roomId: string
      type: MessageType
      text?: string
      url?: string
      filename?: string
      duration?: number
      replyTo?: string
    }) => {
      const srv = await apiSendMessage(payload)
      return srv
    },
    onMutate: async payload => {
      const lid = generateLocalId()
      const optimistic: Message = {
        _id: lid,
        roomId: payload.roomId,
        sender: meId,
        senderUser: {
          _id: meId,
          first_name: userData?.first_name ?? 'You',
          last_name: userData?.last_name ?? '',
          profile_picture: userData?.profile_picture
        },
        type: payload.type,
        text: payload.text,
        url: payload.url,
        filename: payload.filename,
        duration: payload.duration,
        replyTo: payload.replyTo ? { _id: payload.replyTo } : undefined,
        createdAt: new Date().toISOString(),
        localId: lid,
        status: 'sending'
      }

      await qc.cancelQueries({ queryKey: ['messages', chatId] })
      qc.setQueryData(['messages', chatId], (old: any) => {
        if (!old)
          return { pages: [{ messages: [optimistic], nextCursor: undefined }] }
        const newPages = [...old.pages]
        newPages[0] = {
          ...newPages[0],
          // messages: [optimistic, ...(newPages[0].messages ?? [])]
          messages: [...(newPages[0].messages ?? []), optimistic]
        }
        return { ...old, pages: newPages }
      })

      return { localId: lid }
    },
    onSuccess: (serverMsg, _vars, ctx) => {
      qc.setQueryData(['messages', chatId], (old: any) => {
        if (!old) return old
        const newPages = old.pages.map((page: any) => {
          const msgs = page.messages.map((m: Message) =>
            m.localId === ctx?.localId ? serverMsg : m
          )
          return { ...page, messages: msgs }
        })
        return { ...old, pages: newPages }
      })
    },
    onError: (_err, _vars, ctx) => {
      qc.setQueryData(['messages', chatId], (old: any) => {
        if (!old) return old
        const newPages = old.pages.map((page: any) => {
          const msgs = page.messages.map((m: Message) =>
            m.localId === ctx?.localId ? { ...m, status: 'failed' } : m
          )
          return { ...page, messages: msgs }
        })
        return { ...old, pages: newPages }
      })
    }
  })

  const socketSend = useCallback(
    async (payload: {
      roomId: string
      type: MessageType
      text?: string
      url?: string
      filename?: string
      duration?: number
      replyTo?: string
     attachments?: Attachment[] | undefined;
    }) => {
      const socket = socketRef.current
      if (!socket || !socket.connected) {
        // fallback to HTTP
        await sendMut.mutateAsync(payload)
        return
      }

      const lid = generateLocalId()
      const optimistic: Message = {
        _id: lid,
        roomId: payload.roomId,
        sender: meId,
        senderUser: {
          _id: meId,
          first_name: userData?.first_name ?? 'You',
          last_name: userData?.last_name ?? '',
          profile_picture: userData?.profile_picture
        },
        type: payload.type,
        text: payload.text,
        url: payload.url,
        filename: payload.filename,
        duration: payload.duration,
        replyTo: payload.replyTo ? { _id: payload.replyTo } : undefined,
        createdAt: new Date().toISOString(),
        localId: lid,
        attachments:payload.attachments,
        status: 'sending'
      }

      qc.setQueryData(['messages', chatId], (old: any) => {
        if (!old)
          return { pages: [{ messages: [optimistic], nextCursor: undefined }] }
        const newPages = [...old.pages]
        newPages[0] = {
          ...newPages[0],
          // messages: [optimistic, ...(newPages[0].messages ?? [])]
          messages: [...(newPages[0].messages ?? []), optimistic]
        }
        return { ...old, pages: newPages }
      })

      const payloadToSend: {
  roomId: string;
  type: MessageType;
  text?: string;
  replyTo?: string;
  attachments?: Attachment[]; // optional
} = {
  roomId: payload.roomId,
  type: payload.type,
  text: payload.text,
  replyTo: payload.replyTo,
};

// include attachments only when present and non-empty
if (payload.attachments && payload.attachments.length > 0) {
  payloadToSend.attachments = payload.attachments;
}



      socket.emit(
        'sendMessage',
        payloadToSend,
        (ack: any) => {
          if (!ack) {
            console.warn('No ACK')
            return
          }
          if (ack.error) {
            console.error('ACK error:', ack.error)
            return
          }
          if (ack.message) {
            qc.setQueryData(['messages', chatId], (old: any) => {
              if (!old) return old
              const newPages = old.pages.map((page: any) => {
                const msgs = page.messages.map((m: Message) =>
                  m.localId === optimistic.localId ? ack.message : m
                )
                return { ...page, messages: msgs }
              })
              return { ...old, pages: newPages }
            })
          }
        }
      )
    

      // try {
      //   await apiSendMessage(payload)
      // } catch (err) {
      //   console.warn('HTTP fallback error', err)
      //   qc.setQueryData(['messages', chatId], (old: any) => {
      //     if (!old) return old
      //     const newPages = old.pages.map((page: any) => {
      //       const msgs = page.messages.map((m: Message) =>
      //         m.localId === optimistic.localId ? { ...m, status: 'failed' } : m
      //       )
      //       return { ...page, messages: msgs }
      //     })
      //     return { ...old, pages: newPages }
      //   })
      // }
    },
    [qc, meId, userData, chatId]
  )

  const sendText = useCallback(
    (text: string) => {
      if (!text || !chatId) return
      const payload: any = { roomId: chatId, type: 'text', text }
      if (replyingTo) payload.replyTo = replyingTo._id
      setSending(true)
      socketSend(payload)
        .then(() => {
          setTextValue('')
          setReplyingTo(null)
        })
        .catch(err => {
          console.warn('sendText error', err)
        })
        .finally(() => setSending(false))
    },
    [chatId, replyingTo, socketSend]
  )

  // const pickImage = useCallback(async () => {
  //   // console.log('ASSETSPICK')
  //   try {
  //     const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
  //     if (!perm.granted) {
  //       Alert.alert('Permission required', 'Allow access to photos')
  //       return
  //     }
  //     const res = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //       quality: 0.7
  //     })
  //     // new API
  //     if ((res as any).canceled) return
  //     const asset = (res as any).assets?.[0] ?? (res as any)
  //     // console.log('ASSETS', asset)
  //     if (!asset?.uri) return
  //     setSending(true)
  //     const uploaded = await uploadFileHelper(asset.uri)
  //     Alert.alert(uploaded.url)
  //     await socketSend({
  //       roomId: chatId!,
  //       type: 'image',
  //       url: uploaded.url
  //     })
  //   } catch (err) {
  //     console.warn(err)
  //     Alert.alert('Image upload failed')
  //   } finally {
  //     setSending(false)
  //   }
  // }, [chatId, socketSend])

 const pickImage = useCallback(async () => {
  // console.log('ASSETS PICK')
  try {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!perm.granted) {
      Alert.alert('Permission required', 'Allow access to photos')
      return
    }

    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    })

    if ((res as any).canceled) return

    const assets = (res as any).assets ?? [(res as any)]
    if (!assets.length) return

    // console.log('SELECTED ASSETS', assets)
    setSending(true)

    const attachments: Attachment[] = []

    for (const asset of assets) {
      if (!asset?.uri) continue
      try {
        const uploaded = await uploadFileHelper(asset.uri) // assume returns { url, key, ... }
        if (uploaded?.url) {
          attachments.push({
            url: uploaded.url,
            key: uploaded.assetStorageKey,
            kind:uploaded.kind,
          })
        } else {
          console.warn('upload returned no url for', asset.uri)
        }
      } catch (err) {
        console.warn('Upload failed for', asset.uri, err)
        // optionally push a failed marker or skip
      }
    }

    if (attachments.length > 0) {
      console.log("attach323",attachments)
      await socketSend({
        roomId: chatId!,
        type: 'image',
        attachments:attachments,
      })
      // Alert.alert('Uploaded', `${attachments.length} images uploaded successfully`)
    } else {
      Alert.alert('Upload', 'No images were uploaded')
    }
  } catch (err) {
    console.warn(err)
    Alert.alert('Image upload failed')
  } finally {
    setSending(false)
  }
}, [chatId, socketSend])


  const pickFile = useCallback(async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true
      })
      if ((res as any).type === 'cancel' || (res as any).canceled) return
      const uri = (res as any).uri ?? (res as any).assets?.[0]?.uri
      const name = (res as any).name ?? (res as any).assets?.[0]?.name
      if (!uri) return
      setSending(true)
      const uploaded = await uploadFileHelper(uri)
      await socketSend({
        roomId: chatId!,
        type: 'file',
        url: uploaded.url,
        filename: name
      })
    } catch (err) {
      console.warn(err)
      Alert.alert('File upload failed')
    } finally {
      setSending(false)
    }
  }, [chatId, socketSend])

  const startRecording = useCallback(async () => {
    try {
      const perm = await Audio.requestPermissionsAsync()
      if (!perm.granted) {
        Alert.alert('Permission required', 'Allow mic access')
        return
      }
      setRecording(true)
      const rec = new Audio.Recording()
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await rec.startAsync()
      setAudioRec(rec)
    } catch (err) {
      console.warn(err)
      setRecording(false)
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (!audioRec) {
      setRecording(false)
      return
    }
    try {
      await audioRec.stopAndUnloadAsync()
      const uri = audioRec.getURI()
      const st = await audioRec.getStatusAsync()
      const duration = st.durationMillis
        ? Math.round(st.durationMillis / 1000)
        : undefined
      setRecording(false)
      setAudioRec(null)
      if (!uri) {
        Alert.alert('Recording failed')
        return
      }
      setSending(true)
      const uploaded = await uploadFileHelper(uri)
      await socketSend({
        roomId: chatId!,
        type: 'voice',
        url: uploaded.url,
        duration
      })
    } catch (err) {
      console.warn(err)
      Alert.alert('Recording error')
      setRecording(false)
    } finally {
      // nothing
    }
  }, [audioRec, chatId, socketSend])

  const onSwipeReply = (msg: Message) => {
    setReplyingTo(msg)
  }

  const cancelReply = () => setReplyingTo(null)

  const scrollToMessage = (msgId: string) => {
    const idx = messages.findIndex(m => m._id === msgId)
    if (idx < 0) {
      refetch().then(() => {
        const newIdx = messages.findIndex(m => m._id === msgId)
        if (newIdx < 0) return
        const inv = messages.length - 1 - newIdx
        flatListRef.current?.scrollToIndex({
          animated: true,
          index: inv,
          viewPosition: 0.5
        })
      })
      return
    }
    const inv = messages.length - 1 - idx
    flatListRef.current?.scrollToIndex({
      animated: true,
      index: inv,
      viewPosition: 0.5
    })
    setHighlightedMessageId(msgId)
    setTimeout(() => {
      setHighlightedMessageId(null)
    }, 2200)
  }

  const renderItem = useCallback(
    ({ item }: { item: Message }) => {
      const isMine = item.sender === meId
      // console.log("senderID", item.sender)
      // console.log("meID", meId)
      return (
        <MessageBubble
          message={item}
          isMine={isMine}
          onSwipeReply={onSwipeReply}
          highlighted={highlightedMessageId === item._id}
        />
      )
    },
    [meId, highlightedMessageId]
  )

  const safeMessages = useMemo(
    () => messages.filter(m => m && m._id),
    [messages]
  )
  const keyExtractor = useCallback((m: Message) => m._id, [])

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) return
    fetchNextPage()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  // initial scroll
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
    }, 50)
  }, [])

  const otherUsersLabel = useMemo(() => {
    if (!chatData?.users) return ''
    return chatData.users
      .filter((u: ChatUser) => u._id !== meId)
      .map((u: ChatUser) => `${u.first_name} ${u.last_name}`)
      .join(', ')
  }, [chatData, meId])

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.headerBack}
        >
          <Ionicons name='arrow-back' size={22} color='#111' />
        </TouchableOpacity>
        <View style={styles.avatarContainer}>
            {chatData.users.length === 2 ? (
          //     <DualAvatar
          //   leftImage={cloudinaryUrl(chatData.task_picture) ?? ""}
          //   rightImage={cloudinaryUrl(OtherUserImg??"") ?? ""}
          //   size={45}
          // />
          //   ) : (
          //     <Avatar size={55} />

              !chatData.task_picture&& !OtherUserImg ? (
                    // <Avatar size={100} />
                    <SingleAvatar size={55} Imageurl="https://res.cloudinary.com/dvihh0qu2/image/upload/v1761258439/logo_bnxhkm.png"/>
                  ) : (
                    <DualAvatar
            leftImage={cloudinaryUrl(chatData.task_picture) ?? ""}
            rightImage={cloudinaryUrl(OtherUserImg??"") ?? ""}
            size={45}
          />
                  )
                ) : (
                  <Avatar size={55} />
            )}

            {/* Status Dot */}
      <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
        </View>
        <View style={styles.headerInfo}>
          <Text numberOfLines={1} style={styles.headerTitle}>
            {chatData?.name ?? otherUsersLabel ?? 'Chat'}
          </Text>

          {Object.keys(typingUsers).length > 0 ? (
            <Text
              numberOfLines={1}
              style={[
                styles.headerSubtitle,
                { fontStyle: 'italic', color: 'green', fontWeight: 'bold' }
              ]}
            >
              {Object.keys(typingUsers).join(', ')} is typing...
            </Text>
          ) : (
            <Text numberOfLines={1} style={styles.headerSubtitle}>
              {otherUsersLabel}
            </Text>
          )}
        </View>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        
        <View style={styles.messagesWrap}>
          {isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator />
            </View>
          ) : safeMessages.length === 0 ? (
            <View style={styles.empty}>
                        <View style={styles.avatarContainer}>
</View>
         {/* <Avatar size={55} /> */}
              <Text style={styles.emptyText}>No messages yet — say hi 👋</Text>
            </View>
          ) : (
            // <FlatList
            //   ref={flatListRef}
            //   data={safeMessages}
            //   keyExtractor={keyExtractor}
            //   renderItem={renderItem}
            //   inverted
            //   onEndReached={loadMore}
            //   onEndReachedThreshold={0.1}
            //   initialNumToRender={20}
            //   maxToRenderPerBatch={30}
            //   windowSize={21}
            //   removeClippedSubviews
            //   contentContainerStyle={{ paddingVertical: 12 }}
            //   showsVerticalScrollIndicator={false}
            // />

            <FlatList
  ref={flatListRef}
  data={safeMessages}
  keyExtractor={(m) => m._id}
  renderItem={renderItem}
  inverted
  onEndReached={loadMore}
  onEndReachedThreshold={0.1}
  initialNumToRender={15}
  maxToRenderPerBatch={20}
  windowSize={15}
  removeClippedSubviews
  updateCellsBatchingPeriod={50}
  contentContainerStyle={{ paddingVertical: 8 }}
  showsVerticalScrollIndicator={false}
/>

          )}
        </View>

        <Composer
          value={textValue}
          setValue={setTextValue}
          onSendText={sendText}
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
  )
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFB' },
  header: {
    height: 68,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6EEF3',
    backgroundColor: '#fff'
  },
  headerBack: { width: 44, alignItems: 'flex-start' },
  headerInfo: { flex: 1, paddingHorizontal: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  headerSubtitle: { fontSize: 12, color: '#6B7280', marginTop: 2 },

  messagesWrap: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#9CA3AF' },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6
  },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },

  avatarSmall: { width: 36, height: 36, borderRadius: 18, marginRight: 8 },

  bubble: {
    maxWidth: '78%',
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1
  },
  bubbleMine: {
    backgroundColor: '#dbf0dd',
    borderBottomRightRadius: 4
  },
  bubbleTheirs: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EEF2F5'
  },

  bubbleText: { fontSize: 15, lineHeight: 20 },
  textMine: { color: '#000' },
  textTheirs: { color: '#0F172A' },

  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6
  },
  statusDot: {
  position: 'absolute',
  bottom: 0,
  right: 0,
  width: 12,
  height: 12,
  borderRadius: 6,      // makes it circular
  borderWidth: 2,       // optional: adds a white border around the dot
  borderColor: 'white',
},
  timeText: { fontSize: 11, color: '#94A3B8' },
  statusText: { fontSize: 11, color: '#94A3B8', marginLeft: 8 },
  media: { width: 240, height: 160, borderRadius: 12, overflow: 'hidden' },
  playOverlay: { position: 'absolute', left: '45%', top: '40%' },

  fileContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  fileName: { flex: 1, marginLeft: 8, color: '#111' },

  voiceContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },

  replyPreview: {
    borderLeftWidth: 3,
    borderLeftColor: '#E6EEF3',
    paddingLeft: 8,
    marginBottom: 6
  },
  replyPreviewText: { color: '#6B7280', fontSize: 13 },
   avatarContainer: {
    position: "relative",
    // marginRight: 14,
    // marginLeft: 5,
  },

  typingIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#F0F0F0'
  },

  // Composer styles
  composerStyles: {}
})

const composerStyles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E6EEF3',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 10
  },

  row: { flexDirection: 'row', alignItems: 'flex-end' },
  iconBtn: { padding: 8, marginRight: 6 },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 140,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F3F6F9',
    borderRadius: 18,
    color: '#0F172A',
    fontSize: 15
  },
  sendBtn: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  recordBtn: {
    marginLeft: 8,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E6EEF3'
  },
  replyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F6F9',
    padding: 8,
    borderRadius: 8,
    marginBottom: 6
  },
  replyLabel: { fontSize: 12, color: '#374151', fontWeight: '600' },
  replyText: { fontSize: 13, color: '#6B7280' },
  replyClose: { padding: 6, marginLeft: 8 }
})

// end of ChatScreen.tsx
