import { useState } from "react";
import { View, ScrollView, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { getByYou, getForYou } from "../services";
import { formatCurrency } from "@/lib/helpers";
import EmptyTaskState from "@/components/molecules/empty-task-state";

// Mock data for tasks
const mockTasks = {
  available: [
    {
      id: "1",
      title: "Notes Needed: Advanced Calculus",
      description:
        "Looking for detailed lecture notes from Prof. Thompson's Advanced Calculus class (MATH301) for last week's sessions.",
      incentive: 25,
      location: "Mathematics Building",
      imageUrl:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=400",
      postedBy: "Sarah M.",
      postedAt: "2 hours ago",
      expiresAt: "2024-02-20T15:00:00Z",
      status: "available",
    },
    {
      id: "2",
      title: "Library Book Return",
      description: "Need someone to return 3 textbooks to the main library.",
      incentive: 15,
      location: "University Library",
      imageUrl:
        "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=400",
      postedBy: "Mike R.",
      postedAt: "3 hours ago",
      expiresAt: "2024-02-19T18:00:00Z",
      status: "available",
    },
  ],
  myPosts: [
    {
      id: "3",
      title: "Research Survey Participants",
      description:
        "Looking for 20 participants for my psychology research study.",
      incentive: 10,
      location: "Psychology Department",
      imageUrl:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=400",
      postedBy: "You",
      postedAt: "5 hours ago",
      expiresAt: "2024-02-21T16:00:00Z",
      status: "in_progress",
      assignedTo: "Emily K.",
      progress: 75,
    },
    {
      id: "4",
      title: "Math Tutoring Session",
      description: "Need help with Calculus II homework",
      incentive: 30,
      location: "Library Study Room 3",
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=400",
      postedBy: "You",
      postedAt: "1 day ago",
      expiresAt: "2024-02-18T20:00:00Z",
      status: "expired",
      assignedTo: null,
      progress: 0,
    },
  ],
  inProgress: [
    {
      id: "5",
      title: "Database Project Help",
      description: "Need assistance with SQL queries and database design",
      incentive: 40,
      location: "Computer Science Lab",
      imageUrl:
        "https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?q=80&w=400",
      postedBy: "Alex J.",
      postedAt: "6 hours ago",
      expiresAt: "2024-02-20T22:00:00Z",
      status: "in_progress",
      progress: 30,
    },
  ],
};

type TaskStatus =
  | "available"
  | "in_progress"
  | "completed"
  | "expired"
  | "cancelled";
type TabType = "available" | "myPosts" | "inProgress";

export default function TasksPage() {
  const {
    data: forYou,
    isLoading: forYouIsLoading,
    error: forYouError,
  } = useQuery({
    queryKey: ["by-you"],
    queryFn: getForYou,
  });
  const {
    data: byYou,
    isLoading: byYouIsLoading,
    error: byYouError,
  } = useQuery({
    queryKey: ["by-you"],
    queryFn: getByYou,
  });

  const [activeTab, setActiveTab] = useState<TabType>("available");
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const handleTaskAction = (task: any, action: string) => {
    setSelectedTask(task);
    setShowActionSheet(true);
  };

  const renderTaskCard = (task: any) => {
    const isExpired = new Date(task.expires) < new Date();
    const isMyPost = activeTab === "myPosts";
    const isInProgress = task?.status === "active";

    return (
      <Animated.View
        key={task.id}
        entering={FadeIn.duration(300)}
        style={styles.taskCard}
      >
        <View style={styles.taskHeader}>
          <View style={styles.taskTitleContainer}>
            <Text style={styles.taskTitle}>{task?.task}</Text>
            {isExpired && (
              <View style={styles.expiredBadge}>
                <Text style={styles.expiredText}>Expired</Text>
              </View>
            )}
          </View>
          <View style={styles.incentiveContainer}>
            <Text style={styles.incentiveLabel}>Reward</Text>
            <Text style={styles.incentive}>
              {formatCurrency(task?.incentive)}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>

        {task?.assets[0]?.url && (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: task?.assets[0]?.url }}
              style={styles.taskImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}

        <View style={styles.taskFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{task.location}</Text>
          </View>

          <View style={styles.taskActions}>
            {isMyPost ? (
              <>
                {isInProgress ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(task, "extend")}
                  >
                    <Ionicons name="time" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Extend Time</Text>
                  </Pressable>
                ) : isExpired ? (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(task, "repost")}
                  >
                    <Ionicons name="refresh" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Repost</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.actionButton}
                    onPress={() => handleTaskAction(task, "edit")}
                  >
                    <Ionicons name="create" size={16} color="#22C55E" />
                    <Text style={styles.actionButtonText}>Edit</Text>
                  </Pressable>
                )}
              </>
            ) : isInProgress ? (
              <Pressable
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleTaskAction(task, "decline")}
              >
                <Ionicons name="close-circle" size={16} color="#FF4444" />
                <Text style={[styles.actionButtonText, styles.declineText]}>
                  Decline Task
                </Text>
              </Pressable>
            ) : (
              <Pressable
                style={styles.actionButton}
                onPress={() => router.push(`/tasks/${task.id}`)}
              >
                <Text style={styles.actionButtonText}>View Details</Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.taskMeta}>
          <Text style={styles.postedBy}>
            {task.postedBy === "You"
              ? "Posted by you"
              : `Posted by ${task.user.first_name} ${task.user.last_name}`}
          </Text>
          <Text style={styles.postedAt}>{task.postedAt}</Text>
        </View>
      </Animated.View>
    );
  };
  const tasks = activeTab === "myPosts" ? byYou : forYou;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Campus Tasks</Text>
        <Pressable style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#22C55E" />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "available" && styles.activeTab]}
          onPress={() => setActiveTab("available")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "available" && styles.activeTabText,
            ]}
          >
            Available
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "myPosts" && styles.activeTab]}
          onPress={() => setActiveTab("myPosts")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myPosts" && styles.activeTabText,
            ]}
          >
            My Posts
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "inProgress" && styles.activeTab]}
          onPress={() => setActiveTab("inProgress")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "inProgress" && styles.activeTabText,
            ]}
          >
            In Progress
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {tasks.length > 0 ? (
          tasks?.map((task) => renderTaskCard(task))
        ) : (
          <View className="mt-24">
            <EmptyTaskState />
          </View>
        )}
      </ScrollView>

      <Pressable
        style={styles.createButton}
        // onPress={() => router.push("/new-task")}
      >
        <Ionicons name="add" size={24} color="#ffffff" />
        <Text style={styles.createButtonText}>Post New Task</Text>
      </Pressable>

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

            {selectedTask.status === "in_progress" && (
              <>
                <Pressable style={styles.actionSheetButton}>
                  <Ionicons name="time" size={20} color="#22C55E" />
                  <Text style={styles.actionSheetButtonText}>
                    Extend Deadline
                  </Text>
                </Pressable>
                <Pressable style={styles.actionSheetButton}>
                  <Ionicons name="chatbubbles" size={20} color="#22C55E" />
                  <Text style={styles.actionSheetButtonText}>
                    Message Assignee
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.actionSheetButton, styles.dangerButton]}
                >
                  <Ionicons name="close-circle" size={20} color="#FF4444" />
                  <Text
                    style={[styles.actionSheetButtonText, styles.dangerText]}
                  >
                    Cancel Task
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
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  filterText: {
    color: "#22C55E",
    marginLeft: 4,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTab: {
    backgroundColor: "#22C55E",
  },
  tabText: {
    color: "#666",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#ffffff",
  },
  content: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  expiredBadge: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  expiredText: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  incentiveContainer: {
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  incentiveLabel: {
    fontSize: 12,
    color: "#22C55E",
    fontWeight: "500",
  },
  incentive: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#22C55E",
  },
  taskDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  imageContainer: {
    marginBottom: 12,
  },
  taskImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "right",
  },
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  taskActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  actionButtonText: {
    color: "#22C55E",
    fontWeight: "600",
    marginLeft: 4,
  },
  declineButton: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF4444",
  },
  declineText: {
    color: "#FF4444",
  },
  taskMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
  },
  postedBy: {
    fontSize: 12,
    color: "#666",
  },
  postedAt: {
    fontSize: 12,
    color: "#999",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#22C55E",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
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
