import { Message } from "@/store/chat-store";
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Dimensions,
  FlatList,
  Pressable
} from 'react-native';
import { Image } from 'expo-image';

const WINDOW_WIDTH = Dimensions.get('window').width;
const GAP = 6;

function normalizeAttachments(input: any[]): string[] {
  if (!input) return [];
  if (Array.isArray(input)) {
    // could be array of strings or array of Attachment objects
    if (input.length === 0) return [];
    return input.map((a) => (typeof a === 'string' ? a : a.url)).filter(Boolean);
  }
  return [];
}

export default function ImageGrid({
  message,
  cloudinaryUrl, // function to convert stored path -> url if needed
}: {
  message: Message;
  cloudinaryUrl?: (p: any) => string | undefined; // optional helper
}) {
  const rawUrls = useMemo(() => {
      try {
          const parsed = message.attachments ? JSON.parse(message.attachments) : [];
          return normalizeAttachments(parsed);
      } catch (e) {
          return [];
      }
  }, [message.attachments]);

  // If your attachments sometimes hold paths that need cloudinaryUrl conversion, try converting:
  const urls = useMemo(() => {
    if (!cloudinaryUrl) return rawUrls;
    return rawUrls.map((u) => cloudinaryUrl(u) ?? u).filter(Boolean);
  }, [rawUrls, cloudinaryUrl]);

  const count = urls.length;
  const [modalVisible, setModalVisible] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  if (count === 0) return null;

  // columns rules: 1 => 1, 2 => 2, else => 3
  const cols = count === 1 ? 1 : count === 2 ? 2 : 3;

  const tileSize = (WINDOW_WIDTH - GAP * (cols + 1)) / cols;

  // show up to 4 tiles in the grid; if more, last tile gets +N overlay
  const displayLimit = 4;
  const displayUrls = urls.slice(0, displayLimit);
  const extraCount = Math.max(0, count - displayLimit);

  const openViewer = (index: number) => {
    setStartIndex(index);
    setModalVisible(true);
  };

  return (
    <View>
      <View style={[styles.grid, { padding: GAP / 2 }]}>
        {count === 1 ? (
          <TouchableOpacity onPress={() => openViewer(0)} activeOpacity={0.9}>
            <Image
              source={{ uri: urls[0] }}
              style={[styles.singleImage, { width: WINDOW_WIDTH - GAP, height: 300 }]}
              contentFit="cover"
            />
          </TouchableOpacity>
        ) : count === 3 ? (
          <View style={{ flexDirection: 'row', gap: GAP }}>
            {/* Column 1 */}
            <TouchableOpacity onPress={() => openViewer(0)} activeOpacity={0.9} style={{ flex: 1 }}>
              <Image
                source={{ uri: urls[0] }}
                style={{ width: '100%', height: 300, borderRadius: 8 }}
                contentFit="cover"
              />
            </TouchableOpacity>

            {/* Column 2 */}
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => openViewer(1)} activeOpacity={0.9}>
                <Image
                  source={{ uri: urls[1] }}
                  style={{ width: '100%', height: 147, borderRadius: 8 }}
                  contentFit="cover"
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openViewer(2)} activeOpacity={0.9}>
                <Image
                  source={{ uri: urls[2] }}
                  style={{ width: '100%', height: 147, borderRadius: 8 }}
                  contentFit="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // existing 2+ columns logic for other counts
          <View style={styles.gridRow}>
            {displayUrls.map((u, idx) => {
              const showOverlay = idx === displayUrls.length - 1 && extraCount > 0;
              return (
                <TouchableOpacity
                  key={u + idx}
                  onPress={() => openViewer(idx)}
                  activeOpacity={0.9}
                  style={{ margin: GAP / 2 }}
                >
                  <Image
                    source={{ uri: u }}
                    style={{ width: tileSize, height: tileSize, borderRadius: 8 }}
                    contentFit="cover"
                  />
                  {showOverlay && (
                    <View style={[styles.overlay, { width: tileSize, height: tileSize, borderRadius: 8 }]}>
                      <Text style={styles.overlayText}>+{extraCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Fullscreen modal viewer */}
      <Modal visible={modalVisible} animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={styles.modalSafe}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>

          <FlatList
            data={urls}
            keyExtractor={(item, i) => `${item}-${i}`}
            horizontal
            pagingEnabled
            initialScrollIndex={startIndex}
            getItemLayout={(_, index) => ({ length: WINDOW_WIDTH, offset: WINDOW_WIDTH * index, index })}
            renderItem={({ item }) => (
              <View style={{ width: WINDOW_WIDTH, height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  source={{ uri: item }}
                  style={{ width: WINDOW_WIDTH, height: '100%' }}
                  contentFit="contain"
                />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    width: '100%',           // take full width of parent
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',    // for multiple columns
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  singleImage: {
    width: '100%',
    height: 200,             // or any dynamic height you prefer
    borderRadius: 12,
    overflow: 'hidden',
  },
  gridItem: {
    flex: 1,
    margin: GAP / 2,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayText: {
    color: 'white',
    fontSize: 28,
    fontWeight: '700',
  },
  modalSafe: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: 'white',
    fontSize: 16,
  },
});