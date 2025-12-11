import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, GestureResponderEvent } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Message } from '@/database/models';
import { cloudinaryUrl } from '@/lib/helpers';
import ImageGrid from '@/app/(dashboard)/messages/imagegrid'; // Adjust path if needed

dayjs.extend(relativeTime);

const formatTime = (timestamp?: number) => {
  if (!timestamp) return '';
  const d = dayjs(timestamp);
  if (d.isSame(dayjs(), 'day')) return d.format('h:mm A');
  return d.fromNow();
};

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
  onSwipeReply?: (msg: Message) => void;
  highlighted?: boolean;
}

const MessageBubble = React.memo(({ message, isMine, onSwipeReply, highlighted }: MessageBubbleProps) => {
  const containerStyle = isMine ? styles.bubbleRowRight : styles.bubbleRowLeft;
  const bubbleStyle = [
    styles.bubble,
    isMine ? styles.bubbleMine : styles.bubbleTheirs,
    highlighted ? { backgroundColor: isMine ? '#16a34a' : '#fff9c4' } : null,
  ];

  const panResponderRef = useRef<{ startX: number; hasSwiped: boolean }>({ startX: 0, hasSwiped: false });

  const onTouchStart = (e: GestureResponderEvent) => {
    panResponderRef.current.startX = e.nativeEvent.pageX;
    panResponderRef.current.hasSwiped = false;
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    const dx = e.nativeEvent.pageX - panResponderRef.current.startX;
    const threshold = 50;
    if (dx > threshold && !panResponderRef.current.hasSwiped && onSwipeReply) {
      panResponderRef.current.hasSwiped = true;
      onSwipeReply(message);
    }
  };

  const attachments = message.attachmentsArray;
  const replyTo = message.replyToObject;

  return (
    <Pressable
      onPress={() => {}}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      style={[styles.bubbleRow, containerStyle]}
    >
      {/* {!isMine && (
        <Image
          source={{ uri: 'TODO: Sender Avatar' }} 
          style={styles.avatarSmall}
          contentFit="cover"
        />
      )} */}

      <View style={bubbleStyle}>
        {replyTo && (
          <TouchableOpacity style={styles.replyPreview}>
            <Text numberOfLines={1} style={styles.replyPreviewText}>
              {replyTo.text ?? 'Reply'}
            </Text>
          </TouchableOpacity>
        )}

        {message.type === 'text' && (
          <Text style={[styles.bubbleText, isMine ? styles.textMine : styles.textTheirs]}>
            {message.content}
          </Text>
        )}

        {message.type === 'image' && attachments.length > 0 && (
           <ImageGrid message={message} cloudinaryUrl={cloudinaryUrl} />
        )}

        <View style={styles.bubbleFooter}>
          <Text style={styles.timeText}>{formatTime(message.createdAt)}</Text>
          {isMine && (
            <View style={{ marginLeft: 4 }}>
              {message.status === 'sending' && <Ionicons name="time-outline" size={14} color="#6B7280" />}
              {message.status === 'sent' && <Ionicons name="checkmark-done" size={14} color="#3B82F6" />}
              {message.status === 'delivered' && <Ionicons name="checkmark-done-circle" size={14} color="#3B82F6" />}
              {message.status === 'failed' && <Ionicons name="alert-circle" size={14} color="#EF4444" />}
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  bubbleRow: {
    flexDirection: 'row',
    marginVertical: 4,
    alignItems: 'flex-end',
  },
  bubbleRowLeft: {
    justifyContent: 'flex-start',
  },
  bubbleRowRight: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bubbleMine: {
    backgroundColor: '#dcf8c6', // Light green
    borderBottomRightRadius: 0,
  },
  bubbleTheirs: {
    backgroundColor: '#f0f0f0', // Light gray
    borderBottomLeftRadius: 0,
  },
  bubbleText: {
    fontSize: 16,
    lineHeight: 22,
  },
  textMine: {
    color: '#000',
  },
  textTheirs: {
    color: '#000',
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    color: '#999',
  },
  replyPreview: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 6,
    borderRadius: 4,
    marginBottom: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#888',
  },
  replyPreviewText: {
    fontSize: 12,
    color: '#555',
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
});

export default MessageBubble;
