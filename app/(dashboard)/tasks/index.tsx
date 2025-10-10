// app/(dashboard)/tasks/index.tsx
import { useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import {
  getAvailable,
  getByYou,
  getForYou,
  getYourTaskAcceptedByOthers,
  getYourToDO,
} from "../services";
import { formatCurrency } from "@/lib/helpers";
import EmptyTaskState from "@/components/molecules/empty-task-state";
import TaskLoadingSkeleton from "@/components/tasks/task-loading-skeleton";
import { TaskSchema, TaskStatus } from "../types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CreateTaskModal from "@/components/organism/create-task-modal";
import { Image as RNImage } from "react-native";
// import CreateTaskModal from "@/components/organism/create-task-modal";
// import { PlusCircleIcon } from "react-native-heroicons/outline/tsx";

import { PlusCircle } from 'lucide-react-native';


dayjs.extend(relativeTime);
type TabType = "available" | "myPosts" | "inProgress" | "yourToDo" | "accepted";

export default function TasksPage() {
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleTaskAction = (task: any, action: string) => {
    setSelectedTask(task);
    setShowActionSheet(true);
  };
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

  const [activeTab, setActiveTab] = useState<TabType>("available");

  const tasks =
    activeTab === "myPosts"
      ? byYou
      : activeTab === "available"
        ? forYou
        : activeTab === "yourToDo"
          ? yourToDo
          : yourTaskAcceptedByOthers;
          

  const renderTaskCard = ({ item }: { item: TaskSchema }) => {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.taskCard}>
        
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item?.task}</Text>
          <View style={styles.incentiveContainer}>
            {/* <Text style={styles.incentiveLabel}>Reward</Text> */}
            <Text style={styles.incentive}>
              {formatCurrency(item?.incentive)}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {item?.description}
        </Text>

        {item?.assets[0]?.url && (
          <Image
            source={{ uri: item?.assets[0]?.url.replace("auto/upload", "image/upload") }}
            style={styles.taskImage}
            contentFit="cover"
          />
        )}

        <View style={styles.taskFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{item?.location}</Text>
          </View>
          <View style={styles.taskActions}>
            {activeTab === "yourToDo" || activeTab === "accepted" ? (
              <>
                {item.status === TaskStatus.ACCEPTED ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(item, "extend")}
                  >
                    <Ionicons name="time" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Extend Time</Text>
                  </Pressable>
                ) : dayjs(item.created_at)
                    .add(item.expires, "hour")
                    .isAfter(dayjs()) ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(item, "repost")}
                  >
                    <Ionicons name="refresh" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Repost</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(item, "edit")}
                  >
                    <Ionicons name="create" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                )}
              </>
            ) : item.status === TaskStatus.PENDING ? (
              <Pressable
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleTaskAction(item, "decline")}
              >
                <Ionicons name="close-circle" size={16} color="#FF4444" />
                <Text style={[styles.actionButtonText, styles.declineText]}>
                  Decline Task
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push(`/tasks/${item._id}`)}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <Text
            style={styles.postedBy}
          >{`${activeTab === "accepted" ? "Accepted" : "Posted"} by ${item?.user ? item?.user.first_name + " " + item?.user.last_name : "You"}`}</Text>
          <Text style={styles.postedAt}>
            {dayjs(item?.created_at).fromNow()}
          </Text>
        </View>
      </Animated.View>
    );
  };

  const [open, setOpen] = useState(false);
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Campus Tasks</Text>
        <Pressable
          style={styles.filterButton}
          // onPress={() => {
          //   setOpen(true);
          // }}
          onPress={() => setOpen(true)}
        >
          <PlusCircle size={20} color="#22C55E" />
          <Text style={styles.filterText}>Post Task</Text>
        </Pressable>
      </View>
      <CreateTaskModal open={open} setOpen={setOpen} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["available", "myPosts", "yourToDo", "accepted"].map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as TabType)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab === "available"
                ? "Available"
                : tab === "myPosts"
                  ? "My Posts"
                  : tab === "accepted"
                    ? "Accepted"
                    : "Your To-Do"}
            </Text>
          </Pressable>
        ))}
      </View>

      {forYouIsLoading ||
      byYouIsLoading ||
      yourTaskAcceptedByOthersLoading ||
      toDoLoading ? (
        <TaskLoadingSkeleton />
      ) : tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item?._id?.toString()}
          renderItem={renderTaskCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <EmptyTaskState />
        </View>
      )}

      {/* Create New Task Button */}
      {/* <Pressable style={styles.createButton}>
        <Ionicons name="add" size={24} color="#ffffff" />
        <Text style={styles.createButtonText}>Post New Task</Text>
      </Pressable> */}
      {showActionSheet && selectedTask && (
        <Pressable
          style={styles.actionSheetOverlay}
          onPress={() => setShowActionSheet(false)}
        >
          <Animated.View
            entering={FadeIn.duration(200)}
            style={styles.actionSheet}
          >
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>Task Actions</Text>
              <Pressable onPress={() => setShowActionSheet(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            {selectedTask.status === TaskStatus.ACCEPTED && (
              <>
                <Pressable style={styles.actionSheetButton}>
                  <Ionicons name="time" size={20} color="#22C55E" />
                  <Text style={styles.actionSheetButtonText}>
                    Extend Deadline
                  </Text>
                </Pressable>
                <Link
                  className="py-2"
                  key={selectedTask?.user?._id}
                  href={{
                    pathname: "/messages/[id]",
                    params: { id: selectedTask?.user?._id },
                  }}
                  asChild
                >
                  <Pressable style={styles.actionSheetButton}>
                    <Ionicons name="chatbubbles" size={20} color="#22C55E" />
                    <Text style={styles.actionSheetButtonText}>
                      Message Assignee
                    </Text>
                  </Pressable>
                </Link>
                <Pressable
                  style={[styles.actionSheetButton, styles.dangerButton]}
                >
                  <Ionicons name="close-circle" size={20} color="#FF4444" />
                  <Text
                    style={[styles.actionSheetButtonText, styles.dangerText]}
                  >
                    {activeTab === "accepted" ? "Decline" : "Cancel"} Task
                  </Text>
                </Pressable>
              </>
            )}

            {selectedTask.status === "expired" && (
              <>
                <Pressable style={styles.actionSheetButton}>
                  <Ionicons name="refresh" size={20} color="#22C55E" />
                  <Text style={styles.actionSheetButtonText}>Repost Task</Text>
                </Pressable>
                <Pressable style={styles.actionSheetButton}>
                  <Ionicons name="create" size={20} color="#22C55E" />
                  <Text style={styles.actionSheetButtonText}>
                    Edit & Repost
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionSheetButton, styles.dangerButton]}
                >
                  <Ionicons name="trash" size={20} color="#FF4444" />
                  <Text
                    style={[styles.actionSheetButtonText, styles.dangerText]}
                  >
                    Delete Task
                  </Text>
                </Pressable>
              </>
            )}
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: { backgroundColor: "#22C55E" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "#ffffff" },
  listContainer: { paddingBottom: 100 },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  incentiveContainer: {
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 8,
  },
  incentiveLabel: { fontSize: 12, color: "#22C55E" },
  incentive: { fontSize: 18, fontWeight: "bold", color: "#22C55E" },
  taskDescription: { fontSize: 14, color: "#666", marginBottom: 12 },
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
  taskActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: { backgroundColor: "#22C55E", padding: 8, borderRadius: 12 },
  actionButtonText: { color: "#fff", fontWeight: "600" },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 8,
  },
  postedBy: { fontSize: 12, color: "#666" },
  postedAt: { fontSize: 12, color: "#999" },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22C55E",
    padding: 16,
    borderRadius: 12,
    margin: 16,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  emptyState: { marginTop: 50, alignItems: "center" },
  declineButton: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF4444",
  },
  declineText: {
    color: "#FF4444",
  },
  actionSheetOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  actionSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  actionSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  actionSheetButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: "#f0fdf4",
  },
  actionSheetButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#22C55E",
    fontWeight: "600",
  },
  dangerButton: {
    backgroundColor: "#FFF5F5",
  },
  dangerText: {
    color: "#FF4444",
  },
});
