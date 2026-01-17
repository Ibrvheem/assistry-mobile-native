

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
  performTaskAction, // ✅ your API call handler
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
  if (!visible) return null;
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={modalStyles.overlay}>
        <View style={modalStyles.container}>
          <Text style={modalStyles.text}>
  {action === "chat" ? (
    <>
      You are about to start a chat with 
    </>
  ) : (
    <>Are you sure you want to {action?.toUpperCase() ?? ""}</>
  )}
</Text>

          {/* <Text style={modalStyles.text}>
            {
              action === "chat" ? "You are about to start a chat with {user}." : `Are you sure you want to {action.toUpperCase()}`
            }
            Are you sure you want to {action.toUpperCase()}
          </Text> */}

          <Text style={modalStyles.taskId}>
          {action === "chat" ? (
    <>
      <Text style={modalStyles.bold}>{user ?? "this user"}</Text>
    </>
  ) : (
    <>{task?.task}?</>
  )}
</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#22C55E" style={{ marginTop: 20 }} />
          ) : (
            <View style={modalStyles.actions}>
              <Pressable style={[modalStyles.button, modalStyles.cancel]} onPress={onCancel}>
                <Text style={modalStyles.cancelText}>Exit</Text>
              </Pressable>
              <Pressable style={[modalStyles.button, modalStyles.confirm]} onPress={onConfirm}>
                <Text style={modalStyles.confirmText}>
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

  // const queryClient = useQueryClient();

  const { userData } = useGobalStoreContext();
  const queryClient = useQueryClient();
  // ⬇️ Place this right below
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

  // // console.log('Ongoing Loading:', ongoingTasks.length);

 


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
    await queryClient.invalidateQueries({ queryKey: [key] }); // 🔁 Refetch only active tab
  } catch (err) {
    console.error("Refresh failed:", err);
  } finally {
    setRefreshing(false);
  }
};

  const handleTaskAction = useCallback((task: TaskSchema, action: string) => {
  setSelectedTask(task);
  setCurrentAction(action);
  // if (action === "chat") // console.log('CATTTTT');
  // if (action === "chat") return setChatConfirmVisible(true);
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
      // create or fetch chat room for this task + participant
      const chat = await chatTaskUser([selectedTask.user._id], selectedTask._id);

      // server might return different shapes: response.data, { _id }, { id }, { key }, etc.
      const chatObj = chat?.data ?? chat;

      const chatId =
        chatObj?._id ?? chatObj?.id ?? chatObj?.key ?? chatObj?.roomId ?? chatObj;

      if (!chatId) {
        throw new Error('Chat created but no id was returned from server.');
      }
      console.log('data',chatObj)

      // Navigate to the messages screen. For expo-router use params `id`.
      // router.push({ pathname: '/messages/[id]', params: { room: chatObj } });
      router.push({
  pathname: '/messages/[id]',
  params: { id: chatId, data: JSON.stringify(chatObj) },
})

//   router.push({
//   pathname: '/messages'
// })

;

      return;
    }


      await performTaskAction(selectedTask._id, currentAction);

    // 🔁 Define tab-to-queryKey mapping
    const tabKeyMap: Record<TabType, string> = {
      available: "for-you",
      myPosts: "by-you",
      yourToDo: "your-todo",
      accepted: "your-task-accepted-by-others",
      ongoing: "your-ongoing-tasks",
    };

    // 🧭 Define automatic redirection after each action
    const actionRedirects: Record<string, TabType> = {
      accept: "yourToDo",
      start: "ongoing",
      complete: "ongoing",
      approve: "myPosts",
      repost: "myPosts",
      cancel: "myPosts",
    };

    const nextTab = actionRedirects[currentAction] ?? activeTab;

    // 🔁 Refetch both current and next tab data in background
    const refetchTabs = new Set([activeTab, nextTab]);
    await Promise.all(
      Array.from(refetchTabs).map((tab) =>
        queryClient.invalidateQueries({ queryKey: [tabKeyMap[tab]] })
      )
    );

    // 🚀 Switch tab if needed
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
      <View style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item.task}</Text>
          <View >
            <Text style={styles.incentive}>{formatCurrency(item.incentive)}</Text>
          </View>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
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
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{item.location}</Text>
          </View>

          <View style={styles.taskActions}>
            {item?.user?._id !== userData?._id &&  activeTab !== 'myPosts' && (
                <Pressable
                  style={styles.chatButton}
                  onPress={() => handleTaskAction(item, "chat")}
                >
                  <MessageCircleMore size={32} color="#fff" fill="#b0e17c" />
                </Pressable>
              )}

            {activeTab === "available" && item.status === TaskStatus.PENDING && (
              <Pressable
                disabled={item.user.email === userData?.email}
                onPress={() => handleTaskAction(item, "accept")}
                style={[
                  styles.actionButton,
                  item.user.email === userData?.email && styles.disabledButton,
                ]}>
                <Ionicons name="checkmark" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Accept</Text>
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
                style={styles.actionButton}
                onPress={() => handleTaskAction(item, "repost")}>
                <Ionicons name="refresh" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Repost</Text>
              </Pressable>
            )}

            {![TaskStatus.ONGOING, TaskStatus.COMPLETED, TaskStatus.EXPIRED, TaskStatus.CANCELED, TaskStatus.FINISHED].includes(
              item.status,
            ) && activeTab === "myPosts" && (
              <Pressable
                style={styles.actionButton}
                // onPress={() => handleTaskAction(item, "edit")}
                onPress={() =>  handleEdit(item)}
                >
                <Ionicons name="create" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>Edit</Text>
              </Pressable>
            )}

            {activeTab === "ongoing" &&
  [TaskStatus.ONGOING, TaskStatus.FINISHED].includes(item.status) &&
  item.user._id === userData?._id && (
              <Pressable
              disabled={item.status === TaskStatus.ONGOING}
                style={[
        styles.actionButton,
        item.status === TaskStatus.ONGOING && styles.disabledButton,
      ]}
                onPress={() => handleTaskAction(item, "approve")}>
                <Ionicons name="checkmark-circle" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>
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
        item.status === TaskStatus.FINISHED && styles.disabledButton,
      ]}
    >
      <Ionicons name="checkmark-done" size={16} color="#fff" />
      <Text style={styles.actionButtonText}>
        {item.status === TaskStatus.FINISHED
          ? "Waiting Acknowledgement"
          : "Complete"}
      </Text>
    </Pressable>
  )}


            {(activeTab === "yourToDo") &&
              item.status === TaskStatus.ACCEPTED && (
                <Pressable
                  style={styles.actionButton}
                  onPress={() => handleTaskAction(item, "start")}>
                  <Ionicons name="play" size={16} color="#fff" />
                  <Text style={styles.actionButtonText}>Start</Text>
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
          <Text style={styles.postedBy}>
            {`${activeTab === "accepted" ? "Accepted" : "Posted"} by ${
              item?.user
                ? item.user.first_name + " " + item.user.last_name
                : "You"
            }`}
          </Text>
          <Text style={styles.postedAt}>{dayjs(item.created_at).fromNow()}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Ionicons name="eye" size={18} color="#18AE6A" />
          <Text style={styles.views}>{item.views}</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campus Tasks</Text>
        <Pressable style={styles.filterButton} onPress={() => setOpen(true)}>
          <PlusCircle size={20} color="#22C55E" />
          <Text style={styles.filterText}>Post Task</Text>
        </Pressable>
      </View>
      <CreateTaskModal open={open} setOpen={setOpen} />
      {selectedTask && (
        <EditTaskModal open={editOpen} setOpen={setEditOpen} task={selectedTask} />
      )}



  <View style={styles.tabsWrapper}>
      <ScrollView
        horizontal
        // style={{ height: 49}}    
        showsHorizontalScrollIndicator={false}
        // keep ScrollView from growing vertically
      style={styles.tabScroll} 
        contentContainerStyle={styles.tabScrollContainer}
        contentInsetAdjustmentBehavior="never" // iOS: prevents automatic inset
        >
        {["available", "myPosts", "yourToDo", "accepted", "ongoing"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as TabType)}>
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
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
                      <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                    }
        />
      ) : (
        <ScrollView
                  contentContainerStyle={styles.emptyState}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
                  }
                  showsVerticalScrollIndicator={false}
                >
                  <EmptyTaskState />
                </ScrollView>
        // <View style={styles.emptyState}>
        //   {/* <Text style={{ fontSize: 16, marginBottom: 16, color: "#666" }}> NO task</Text> */}
        //   <EmptyTaskState />
        // </View>
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
  container: { backgroundColor: "#f8f9fa", flex:1},
    
  // tabScrollContainer: { paddingHorizontal: 16, marginBottom: 8, 
  // },
   tabsWrapper: {
    // tweak height to fit your tab item paddings / text size
    height: 52,
    justifyContent: "center",
  },

  // prevents ScrollView from overflowing the wrapper
  tabScroll: {
    maxHeight: 52,
    height: "100%",
  },

  tabScrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 0,
    alignItems: "center", // center tabs vertically so no gap appears
  },

  disabledButton: { backgroundColor: "#b0b0b0", opacity: 0.7 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#000" },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 20,
  },
  filterText: { color: "#22C55E", marginLeft: 4, fontWeight: "600" },
  tab: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    height: 36,
  },
  activeTab: { backgroundColor: "#22C55E" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  listContainer: { paddingBottom: 100 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 5,
    width: width - 24,
  },
  taskHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  taskTitle: { fontSize: 18, fontWeight: "bold", color: "#000", width: "70%" },
  incentiveContainer: { 
    // backgroundColor: "#dcfce7", 
    backgroundColor: "transparent", 
    padding: 8, borderRadius: 8 },
  incentive: { fontSize: 18, fontWeight: "bold", color: "#22C55E" },
  taskDescription: { fontSize: 14, color: "#666", marginBottom: 12, marginTop:10 },
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
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 6,
  },
  location: { fontSize: 14, color: "#666", marginLeft: 4 },
  taskActions: { flexDirection: "row", gap: 8 },
  actionButton: {
    backgroundColor: "#22C55E",
    padding: 8,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  declineButton: { backgroundColor: "#FFF5F5" },
   chatButton: {
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4, // soft blue background
  },
  declineText: { color: "#FF4444" },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  postedBy: { fontSize: 12, color: "#666" },
  postedAt: { fontSize: 12, color: "#999" },
  emptyState: { alignItems: "center" },
  views: { color: "#18AE6A", fontWeight: "600" },
});

const modalStyles = StyleSheet.create({
  bold: { fontWeight: "bold", color: "#18ae6a" },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    alignItems: "center",
  },
  text: { fontSize: 18, textAlign: "center", color: "#333" },
  taskId: { fontWeight: "bold", color: "#18ae6a", fontSize: 16, marginTop: 8, textAlign: "center" },
  actions: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "space-between",
    width: "80%",
  },
  button: { paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  cancel: { backgroundColor: "#f0f0f0" },
  confirm: { backgroundColor: "#18ae6a" },
  cancelText: { color: "#444", fontWeight: "600" },
  confirmText: { color: "#fff", fontWeight: "600" },
});
