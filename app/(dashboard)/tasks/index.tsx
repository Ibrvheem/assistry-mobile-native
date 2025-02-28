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
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { useQuery } from "@tanstack/react-query";
import { getAvailable, getByYou, getForYou } from "../services";
import { formatCurrency } from "@/lib/helpers";
import EmptyTaskState from "@/components/molecules/empty-task-state";
import TaskLoadingSkeleton from "@/components/tasks/task-loading-skeleton";
import { TaskSchema } from "../types";

type TabType = "available" | "myPosts" | "inProgress";

export default function TasksPage() {
  const { data: forYou = [], isLoading: forYouIsLoading } = useQuery({
    queryKey: ["for-you"],
    queryFn: getForYou,
  });

  const { data: byYou = [], isLoading: byYouIsLoading } = useQuery({
    queryKey: ["by-you"],
    queryFn: getByYou,
  });

  const { data: availableTask = [], isLoading: availableTaskLoading } =
    useQuery({
      queryKey: ["available"],
      queryFn: getAvailable,
    });

  const [activeTab, setActiveTab] = useState<TabType>("available");

  const tasks =
    activeTab === "myPosts"
      ? byYou
      : activeTab === "available"
        ? availableTask
        : forYou;

  const renderTaskCard = ({ item }: { item: TaskSchema }) => {
    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <Text style={styles.taskTitle}>{item?.task}</Text>
          <View style={styles.incentiveContainer}>
            <Text style={styles.incentiveLabel}>Reward</Text>
            <Text style={styles.incentive}>
              {formatCurrency(item?.incentive)}
            </Text>
          </View>
        </View>

        <Text style={styles.taskDescription} numberOfLines={2}>
          {item?.description}
        </Text>

        {item?.assets && (
          <Image
            source={{ uri: item?.assets[0]?.url }}
            style={styles.taskImage}
            contentFit="cover"
          />
        )}

        <View style={styles.taskFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.location}>{item?.location}</Text>
          </View>
          <Pressable
            style={styles.actionButton}
            onPress={() => {
              console.log("object");
              router.push({
                pathname: "/tasks/[id]",
                params: { id: item?._id },
              });
            }}
          >
            <Text style={styles.actionButtonText}>View Details</Text>
          </Pressable>
        </View>

        <View style={styles.taskMeta}>
          <Text
            style={styles.postedBy}
          >{`Posted by ${item?.user ? item?.user.first_name + " " + item?.user.last_name : "You"}`}</Text>
          <Text style={styles.postedAt}>{item?.created_at}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Campus Tasks</Text>
        <Pressable style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#22C55E" />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {["available", "myPosts", "inProgress", "active"].map((tab) => (
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
                  : tab === "active"
                    ? "Your Accepted Task"
                    : "In Progress"}
            </Text>
          </Pressable>
        ))}
      </View>

      {forYouIsLoading || byYouIsLoading || availableTaskLoading ? (
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
      <Pressable style={styles.createButton}>
        <Ionicons name="add" size={24} color="#ffffff" />
        <Text style={styles.createButtonText}>Post New Task</Text>
      </Pressable>
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
});
