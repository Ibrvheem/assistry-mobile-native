import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { cloudinaryUrl } from "@/lib/helpers";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  FadeOut,
} from "react-native-reanimated";
import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptTask, getTask } from "./services";
import { formatCurrency } from "@/lib/helpers";
import TaskDetailsSkeleton from "@/components/tasks/task-details-loading-skeleton";
import { TaskSchema, TaskStatus } from "../types";

const categoryColors = {
  academic: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  errands: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  delivery: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  tutoring: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  events: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  other: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
};

export default function TaskDetailsScreen() {
  const { id } = useLocalSearchParams() as { id: string };
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [acceptanceState, setAcceptanceState] = useState<
    "idle" | "accepting" | "accepted" | "error"
  >("idle");

  const { data, isLoading, error } = useQuery({
    queryKey: [`task-${id}`],
    queryFn: () => getTask(id),
  }) as { data: TaskSchema; isLoading: boolean; error: unknown };

  const assets = useMemo(() => (data?.assets ? [...data.assets] : []), [data]);

  const queryClient = useQueryClient();
  const handleAcceptTask = async () => {
    try {
      setAcceptanceState("accepting");
      const response = await acceptTask({ taskId: id });
      await queryClient.invalidateQueries({
        queryKey: ["by-you", "for-you", "accepted", `task-${id}`],
      });
      setAcceptanceState("accepted");
      return response;
    } catch {
      setAcceptanceState("error");
      setTimeout(() => setAcceptanceState("idle"), 3000);
    }
  };

  return isLoading ? (
    <View className="flex-1 bg-white">
      <TaskDetailsSkeleton />
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <SafeAreaView style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <Pressable style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="#000" />
            </Pressable>
          </SafeAreaView>

          {/* Main Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri:
                  data?.assets?.[0]?.url.replace("auto/upload", "image/upload") || "https://collection.cloudinary.com/dvihh0qu2/643fc511542ea7dc6ddfdf1026e5a677",
              }}
              style={styles.mainImage}
              contentFit="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.imageOverlay}
            />
            <View style={styles.imageContent}>
              <Text style={styles.incentive}>
                {formatCurrency(data?.incentive)}
              </Text>
              <Text style={styles.postedAt}>{dayjs(data.created_at).format("MMMM D, h:mm A")}</Text>
            </View>
          </View>

          {/* Task Details */}
          <View style={styles.content}>
            <Text style={styles.title}>{data?.task}</Text>

            {/* User Info */}
            <Pressable style={styles.posterContainer}>
              <Image
                source={{
                  uri:data?.user?.profile_picture
                        ? cloudinaryUrl(data?.user?.profile_picture)
                        : "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvJTIwaGF1c2F8ZW58MHx8MHx8fDA%3D",
                }}
                style={styles.posterImage}
                contentFit="cover"
              />
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>
                  {data?.user?.first_name} {data?.user?.last_name}
                </Text>
                <View style={styles.posterStats}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.statText}>3.03</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.statText}>10 tasks</Text>
                </View>
              </View>
              <Pressable style={styles.viewProfile} 
              onPress={() => {
                            // router.push("/(dashboard)/profile/view");
                             router.push({ pathname: "/profile/view", params: {id:data?.user?._id  } })
                          }}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </Pressable>
            </Pressable>

            {/* Location */}
            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={20}
                color={categoryColors.delivery.primary}
              />
              <Text style={styles.location}>{data?.location}</Text>
            </View>

            {/* Description */}
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{data?.description}</Text>

            {/* Additional Photos */}
            <Text style={styles.sectionTitle}>Additional Photos</Text>
            <FlatList
              data={assets}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}

              renderItem={({ item }) => (
                
                <Image
                  source={{
                    uri:
                      item?.url.replace("auto/upload", "image/upload") ||
                      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZSUyMHBob3RvJTIwaGF1c2F8ZW58MHx8MHx8fDA%3D",
                  }}
                  style={styles.additionalImage}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>

      {/* Accept Task Button */}
      <View style={styles.bottomBar}>
        <LinearGradient
          colors={
            [...categoryColors.events.gradient] as [string, string, ...string[]]
          }
          style={styles.acceptButton}
        >
          <Pressable
            onPress={() => setShowAcceptConfirm(true)}
            style={styles.acceptButtonContent}
          >
            {data.status === TaskStatus.PENDING ? (
              <>
                <Text style={styles.acceptButtonText}>
                  {acceptanceState === "accepting"
                    ? "Accepting..."
                    : " Accept Task"}
                </Text>
                <View style={styles.acceptButtonAmount}>
                  <Text style={styles.acceptButtonAmountText}>
                    {formatCurrency(data?.incentive)}
                  </Text>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.acceptButtonText}>Accepted</Text>
                <View style={styles.acceptButtonAmount}>
                  <Text style={styles.acceptButtonAmountText}>
                    {formatCurrency(data?.incentive)}
                  </Text>
                </View>
              </>
            )}
          </Pressable>
        </LinearGradient>
      </View>

      {/* Confirmation Modal */}
      {showAcceptConfirm && (
        <Animated.View
          style={styles.confirmModal}
          entering={FadeInDown.springify()}
          exiting={FadeOut}
        >
          <View style={styles.confirmContent}>
            <Text style={styles.confirmTitle}>Accept this task?</Text>
            <Text style={styles.confirmDescription}>
              You're about to accept this task. Make sure you can meet all the
              requirements and complete it on time.
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                style={[styles.confirmButton, styles.cancelButton]}
                onPress={() => setShowAcceptConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <LinearGradient
                colors={
                  categoryColors.events.gradient as [
                    string,
                    string,
                    ...string[],
                  ]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.confirmButton, styles.confirmAcceptButton]}
              >
                <Pressable
                  onPress={() => {
                    setShowAcceptConfirm(false);

                    handleAcceptTask();
                  }}
                >
                  <Text style={styles.confirmAcceptText}>{"Accept"}</Text>
                </Pressable>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    width: "100%",
    height: 300,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  imageContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  incentive: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  postedAt: {
    fontSize: 14,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  posterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
  },
  posterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  posterInfo: {
    flex: 1,
    marginLeft: 12,
  },
  posterName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  posterStats: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  viewProfile: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  viewProfileText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 24,
  },
  requirementsList: {
    marginBottom: 24,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requirementText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  additionalImages: {
    marginHorizontal: -16,
  },
  additionalImage: {
    width: 200,
    height: 150,
    marginHorizontal: 8,
    borderRadius: 12,
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  acceptButton: {
    borderRadius: 16,
    marginBottom: 10,
    overflow: "hidden",
  },
  acceptButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  acceptButtonAmount: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  acceptButtonAmountText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  acceptingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  spinningIcon: {
    transform: [{ rotate: "0deg" }],
  },
  acceptedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    width: "100%",
  },
  confirmModal: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  confirmContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 12,
    textAlign: "center",
  },
  confirmDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmAcceptButton: {
    padding: 16,
  },
  confirmAcceptText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
