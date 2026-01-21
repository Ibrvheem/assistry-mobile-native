

import { useState } from "react";
import React, { useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAvailable,
  getByYou,
  getForYou,
  getYourTaskAcceptedByOthers,
  getYourToDO,
  getYourOngoingTasks,
} from "../services";
import { useFocusEffect } from "expo-router";
import {
  chatTaskUser,
  performTaskAction, 
} from "./services";
import { formatCurrency } from "@/lib/helpers";
import { useGobalStoreContext } from "@/store/global-context";
import EmptyTaskState from "@/components/molecules/empty-task-state";
import TaskLoadingSkeleton from "@/components/tasks/task-loading-skeleton";
import { TaskSchema, TaskStatus } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreateTaskModal from "@/components/organism/create-task-modal";
import EditTaskModal from "@/components/organism/edit-tasl-modal";
import { MessageCircleMore, PlusCircle } from "lucide-react-native";
import { MessageCircle } from "lucide-react-native";
import { Dimensions } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

const { width } = Dimensions.get("window");

dayjs.extend(relativeTime);

type TabType =
  | "available"
  | "myPosts"
  | "yourToDo"
  | "accepted"
  | "ongoing";

/** ---------- ActionConfirmModal ---------- */
const ActionConfirmModal = ({
  visible,
  action,
  task,
  user,
  onCancel,
  onConfirm,
  loading,
}: {
  visible: boolean;
  action: string;
  task?: TaskSchema;
  user?: string;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}) => {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.container, { backgroundColor: themeColors.surface, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
          <Text style={[modalStyles.text, { color: themeColors.text }]}>
  {action === "chat" ? (
    <>
      You are about to start a chat with 
    </>
  ) : (
    <>Are you sure you want to {action?.toUpperCase() ?? ""}</>
  )}
</Text>

          <Text style={modalStyles.taskId}>
          {action === "chat" ? (
    <>
      <Text style={[modalStyles.bold, { color: themeColors.primary }]}>{user ?? "this user"}</Text>
    </>
  ) : (
    <>{task?.task}?</>
  )}
</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 20 }} />
          ) : (
            <View style={modalStyles.actions}>
              <Pressable style={[modalStyles.button, modalStyles.cancel, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : '#f0f0f0' }]} onPress={onCancel}>
                <Text style={[modalStyles.cancelText, { color: themeColors.text }]}>Exit</Text>
              </Pressable>
              <Pressable style={[modalStyles.button, modalStyles.confirm, { backgroundColor: themeColors.primary }]} onPress={onConfirm}>
                <Text style={[modalStyles.confirmText, { color: Colors.brand.darkGreen }]}>
                   {
              action === "chat" ? "Chat" : `Yes`
            }
                  </Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};


/** ---------- End Modal ---------- */

export default function TasksPage() {
  const [selectedTask, setSelectedTask] = useState<TaskSchema | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [chatconfirmVisible, setChatConfirmVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>("");
  const [loadingAction, setLoadingAction] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { userData } = useGobalStoreContext();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  useFocusEffect(
    useCallback(() => {
      const tabKeyMap: Record<TabType, string> = {
        available: "for-you",
        myPosts: "by-you",
        yourToDo: "your-todo",
        accepted: "your-task-accepted-by-others",
        ongoing: "your-ongoing-tasks",
      };
      queryClient.invalidateQueries({ queryKey: [tabKeyMap[activeTab]] });
    }, [activeTab])
  );

  // Queries
  const { data: forYou = [], isLoading: forYouIsLoading } = useQuery({
    queryKey: ["for-you"],
    queryFn: getForYou,
  });

  const { data: byYou = [], isLoading: byYouIsLoading } = useQuery({
    queryKey: ["by-you"],
    queryFn: getByYou,
  });

  const { data: yourToDo = [], isLoading: toDoLoading } = useQuery({
    queryKey: ["your-todo"],
    queryFn: getYourToDO,
  });

  const {
    data: yourTaskAcceptedByOthers = [],
    isLoading: yourTaskAcceptedByOthersLoading,
  } = useQuery({
    queryKey: ["your-task-accepted-by-others"],
    queryFn: getYourTaskAcceptedByOthers,
  });

  const { data: ongoingTasks = [], isLoading: ongoingLoading } = useQuery({
    queryKey: ["your-ongoing-tasks"],
    queryFn: getYourOngoingTasks,
  });

  const tasks = useMemo(() => {
  switch (activeTab) {
    case "myPosts":
      return byYou;
    case "yourToDo":
      return yourToDo;
    case "accepted":
      return yourTaskAcceptedByOthers;
    case "ongoing":
      return ongoingTasks;
    default:
      return forYou;
  }
}, [activeTab, forYou, byYou, yourToDo, yourTaskAcceptedByOthers, ongoingTasks]);

const queryKeyMap: Record<TabType, string> = {
  available: "for-you",
  myPosts: "by-you",
  yourToDo: "your-todo",
  accepted: "your-task-accepted-by-others",
  ongoing: "your-ongoing-tasks",
};

 const handleRefresh = async () => {
  try {
    setRefreshing(true);
    const key = queryKeyMap[activeTab];
    await queryClient.invalidateQueries({ queryKey: [key] });
  } catch (err) {
    console.error("Refresh failed:", err);
  } finally {
    setRefreshing(false);
  }
};

  const handleTaskAction = useCallback((task: TaskSchema, action: string) => {
  setSelectedTask(task);
  setCurrentAction(action);
  setConfirmVisible(true);
}, []);

const handleEdit = useCallback((task: TaskSchema) => {
  setSelectedTask(task);
  setEditOpen(true);
}, []);

  const handleConfirmAction = async () => {
  if (!selectedTask || !currentAction) return;
  setLoadingAction(true);

  try {
    if (currentAction === 'chat') {
      const chat = await chatTaskUser([selectedTask.user._id], selectedTask._id);
      const chatObj = chat?.data ?? chat;
      const chatId = chatObj?._id ?? chatObj?.id ?? chatObj?.key ?? chatObj?.roomId ?? chatObj;

      if (!chatId) {
        throw new Error('Chat created but no id was returned from server.');
      }
      console.log('data',chatObj)
      router.push({
        pathname: '/messages/[id]',
        params: { id: chatId, data: JSON.stringify(chatObj) },
      })
      return;
    }

    await performTaskAction(selectedTask._id, currentAction);

    const tabKeyMap: Record<TabType, string> = {
      available: "for-you",
      myPosts: "by-you",
      yourToDo: "your-todo",
      accepted: "your-task-accepted-by-others",
      ongoing: "your-ongoing-tasks",
    };

    const actionRedirects: Record<string, TabType> = {
      accept: "yourToDo",
      start: "ongoing",
      complete: "ongoing",
      approve: "myPosts",
      repost: "myPosts",
      cancel: "myPosts",
    };

    const nextTab = actionRedirects[currentAction] ?? activeTab;

    const refetchTabs = new Set([activeTab, nextTab]);
    await Promise.all(
      Array.from(refetchTabs).map((tab) =>
        queryClient.invalidateQueries({ queryKey: [tabKeyMap[tab]] })
      )
    );

    setActiveTab(nextTab);
  } catch (err) {
    console.error("Task action failed:", err);
  } finally {
    setLoadingAction(false);
    setConfirmVisible(false);
    setSelectedTask(null);
    setCurrentAction("");
  }
};

const isLoading =
  forYouIsLoading || byYouIsLoading || yourTaskAcceptedByOthersLoading || toDoLoading || ongoingLoading;


  const renderTaskCard = ({ item }: { item: TaskSchema }) => (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/tasks/[id]", params: { id: item._id } })
      }>
      <View style={[styles.taskCard, 
          { 
              backgroundColor: themeColors.surface, 
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          }
      ]}>
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: themeColors.text }]}>{item.task}</Text>
          <View >
            <Text style={[styles.incentive, { color: Colors.brand.secondary }]}>{formatCurrency(item.incentive)}</Text>
          </View>
        </View>

        <Text style={[styles.taskDescription, { color: themeColors.textDim }]} numberOfLines={2}>
          {item.description}
        </Text>

        {item.assets?.[0]?.url && (
          <Image
            source={{
              uri: item.assets[0].url.replace("auto/upload", "image/upload"),
            }}
            style={styles.taskImage}
            contentFit="cover"
          />
        )}

        <View style={styles.taskFooter}>
          <View style={[styles.locationContainer, { backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }]}>
            <Ionicons name="location" size={16} color={themeColors.textMuted} />
            <Text style={[styles.location, { color: themeColors.textMuted }]}>{item.location}</Text>
          </View>

          <View style={styles.taskActions}>
            {item?.user?._id !== userData?._id &&  activeTab !== 'myPosts' && (
                <Pressable
                  style={styles.chatButton}
                  onPress={() => handleTaskAction(item, "chat")}
                >
                  <MessageCircleMore size={32} color={isDark ? themeColors.text : "#fff"} fill={themeColors.primary} />
                </Pressable>
              )}

            {activeTab === "available" && item.status === TaskStatus.PENDING && (
              <Pressable
                disabled={item.user.email === userData?.email}
                onPress={() => handleTaskAction(item, "accept")}
                style={[
                  styles.actionButton,
                  { backgroundColor: themeColors.primary },
                  item.user.email === userData?.email && styles.disabledButton,
                ]}>
                <Ionicons name="checkmark" size={16} color={Colors.brand.darkGreen} />
                <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>Accept</Text>
              </Pressable>
            )}

          
            {activeTab === "myPosts" &&
              [TaskStatus.PENDING, TaskStatus.DECLINED, TaskStatus.ACCEPTED].includes(
                item.status,
              ) && (
                <Pressable
                  style={[styles.actionButton, styles.declineButton]}
                  onPress={() => handleTaskAction(item, "cancel")}>
                  <Ionicons name="close-circle" size={16} color="#FF4444" />
                  <Text style={[styles.actionButtonText, styles.declineText]}>
                    Cancel
                  </Text>
                </Pressable>
              )}

            {activeTab === "accepted" && item.status === TaskStatus.ACCEPTED && (
              <Pressable
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleTaskAction(item, "decline")}>
                <Ionicons name="close-circle" size={16} color="#FF4444" />
                <Text style={[styles.actionButtonText, styles.declineText]}>
                  Decline
                </Text>
              </Pressable>
            )}

            {item.status === TaskStatus.EXPIRED && (
              <Pressable
                style={[styles.actionButton, { backgroundColor: themeColors.primary }]}
                onPress={() => handleTaskAction(item, "repost")}>
                <Ionicons name="refresh" size={16} color={Colors.brand.darkGreen} />
                <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>Repost</Text>
              </Pressable>
            )}

            {![TaskStatus.ONGOING, TaskStatus.COMPLETED, TaskStatus.EXPIRED, TaskStatus.CANCELED, TaskStatus.FINISHED].includes(
              item.status,
            ) && activeTab === "myPosts" && (
              <Pressable
                style={[styles.actionButton, { backgroundColor: themeColors.primary }]}
                // onPress={() => handleTaskAction(item, "edit")}
                onPress={() =>  handleEdit(item)}
                >
                <Ionicons name="create" size={16} color={Colors.brand.darkGreen} />
                <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>Edit</Text>
              </Pressable>
            )}

            {activeTab === "ongoing" &&
  [TaskStatus.ONGOING, TaskStatus.FINISHED].includes(item.status) &&
  item.user._id === userData?._id && (
              <Pressable
              disabled={item.status === TaskStatus.ONGOING}
                style={[
        styles.actionButton,
        { backgroundColor: themeColors.primary },
        item.status === TaskStatus.ONGOING && styles.disabledButton,
      ]}
                onPress={() => handleTaskAction(item, "approve")}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.brand.darkGreen} />
                <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>
                   {item.status === TaskStatus.ONGOING
          ? "Ongoing ..."
          : "Approve"}
                </Text>
              </Pressable>
            )}

            {activeTab === "ongoing" &&
  [TaskStatus.ONGOING, TaskStatus.FINISHED].includes(item.status) &&
  item.acceptedBy === userData?._id && (
    <Pressable
      disabled={item.status === TaskStatus.FINISHED}
      onPress={() => handleTaskAction(item, "complete")}
      style={[
        styles.actionButton,
        { backgroundColor: themeColors.primary },
        item.status === TaskStatus.FINISHED && styles.disabledButton,
      ]}
    >
      <Ionicons name="checkmark-done" size={16} color={Colors.brand.darkGreen} />
      <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>
        {item.status === TaskStatus.FINISHED
          ? "Waiting Acknowledgement"
          : "Complete"}
      </Text>
    </Pressable>
  )}


            {(activeTab === "yourToDo") &&
              item.status === TaskStatus.ACCEPTED && (
                <Pressable
                  style={[styles.actionButton, { backgroundColor: themeColors.primary }]}
                  onPress={() => handleTaskAction(item, "start")}>
                  <Ionicons name="play" size={16} color={Colors.brand.darkGreen} />
                  <Text style={[styles.actionButtonText, { color: Colors.brand.darkGreen }]}>Start</Text>
                </Pressable>
                
              )}

              {(activeTab === "yourToDo") &&
              item.status === TaskStatus.ACCEPTED && (
               <Pressable
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleTaskAction(item, "decline")}>
                <Ionicons name="close-circle" size={16} color="#FF4444" />
                <Text style={[styles.actionButtonText, styles.declineText]}>
                  Decline
                </Text>
              </Pressable>
                
              )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <Text style={[styles.postedBy, { color: themeColors.textMuted }]}>
            {`${activeTab === "accepted" ? "Accepted" : "Posted"} by ${
              item?.user
                ? item.user.first_name + " " + item.user.last_name
                : "You"
            }`}
          </Text>
          <Text style={[styles.postedAt, { color: themeColors.textDim }]}>{dayjs(item.created_at).fromNow()}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Ionicons name="eye" size={18} color={Colors.brand.secondary} />
          <Text style={[styles.views, { color: themeColors.primary }]}>{item.views}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.text }]}>Campus Tasks</Text>
        <Pressable style={[styles.filterButton, { backgroundColor: themeColors.primary, borderColor: themeColors.primary }]} onPress={() => setOpen(true)}>
          <PlusCircle size={20} color={Colors.brand.darkGreen} />
          <Text style={[styles.filterText, { color: Colors.brand.darkGreen }]}>Post Task</Text>
        </Pressable>
      </View>
      <CreateTaskModal open={open} setOpen={setOpen} />
      {selectedTask && (
        <EditTaskModal open={editOpen} setOpen={setEditOpen} task={selectedTask} />
      )}


  <View style={styles.tabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      style={styles.tabScroll} 
        contentContainerStyle={styles.tabScrollContainer}
        contentInsetAdjustmentBehavior="never" 
        >
        {["available", "myPosts", "yourToDo", "accepted", "ongoing"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, 
                { backgroundColor: themeColors.surface },
                activeTab === tab && { backgroundColor: themeColors.primary }
            ]}
            onPress={() => setActiveTab(tab as TabType)}>
            <Text
              style={[styles.tabText, 
                  { color: themeColors.textMuted },
                  activeTab === tab && { color: Colors.brand.darkGreen }
              ]}>
              {tab === "available"
                ? "Available"
                : tab === "myPosts"
                  ? "My Posts"
                  : tab === "yourToDo"
                    ? "Your To-Do"
                    : tab === "accepted"
                      ? "Accepted"
                      : "Ongoing"}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      </View>

      {isLoading ? (
        <TaskLoadingSkeleton />
      ) : tasks.length > 0 ? (

        <FlatList
          data={tasks}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
           refreshControl={
                      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={themeColors.primary} />
                    }
        />
      ) : (
        <ScrollView
                  contentContainerStyle={styles.emptyState}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={themeColors.primary} />
                  }
                  showsVerticalScrollIndicator={false}
                >
                  <EmptyTaskState />
                </ScrollView>
      )}

      {/* ✅ Confirmation Modal */}
      <ActionConfirmModal
        visible={confirmVisible}
        action={currentAction}
        user={selectedTask?.user.first_name}
        task={selectedTask ?? undefined}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmAction}
        loading={loadingAction}
      />
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: { flex: 1 },

  tabsWrapper: {
    height: 52,
    justifyContent: "center",
  },

  tabScroll: {
    maxHeight: 52,
    height: "100%",
  },

  tabScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    alignItems: "center", 
  },

  disabledButton: { opacity: 0.7 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,

  },
  title: { fontSize: 28, fontWeight: "bold" },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: { marginLeft: 4, fontWeight: "600" },
  tab: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    height: 36,
  },
  activeTab: { },
  tabText: { fontWeight: "600" },
  activeTabText: { },
  listContainer: { paddingBottom: 100 },
  taskCard: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 5,
    width: width - 24,
    borderWidth: 1,
  },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  taskTitle: { fontSize: 18, fontWeight: "bold", width: "70%" },
  incentiveContainer: {
    backgroundColor: "transparent",
    padding: 8, borderRadius: 8
  },
  incentive: { fontSize: 18, fontWeight: "bold" },
  taskDescription: { fontSize: 14, marginBottom: 12, marginTop: 10 },
  taskImage: { width: "100%", height: 200, borderRadius: 12, marginBottom: 12 },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 6,
  },
  location: { fontSize: 14, marginLeft: 4 },
  taskActions: { flexDirection: "row", gap: 8 },
  actionButton: {
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: { fontWeight: "600" },
  declineButton: { backgroundColor: "#FFF5F5" },
  chatButton: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4, 
  },
  declineText: { color: "#FF4444" },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingTop: 8,
  },
  postedBy: { fontSize: 12 },
  postedAt: { fontSize: 12 },
  emptyState: { alignItems: "center" },
  views: { fontWeight: "600" },
});

const modalStyles = StyleSheet.create({
  bold: { fontWeight: "bold" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    padding: 24,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
    borderWidth: 1,
  },
  text: { fontSize: 18, textAlign: "center" },
  taskId: { fontWeight: "bold", fontSize: 16, marginTop: 8, textAlign: "center" },
  actions: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
    width: "80%",
  },
  button: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  cancel: { },
  confirm: { },
  cancelText: { fontWeight: "600" },
  confirmText: { fontWeight: "600" },
});
