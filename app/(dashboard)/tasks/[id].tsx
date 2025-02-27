import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInDown,
  FadeOut,
} from "react-native-reanimated";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "./services";
import { formatCurrency } from "@/lib/helpers";

const { width } = Dimensions.get("window");

// Mock data - replace with real data fetching
const mockTask = {
  id: "4",
  title: "Lab Equipment Setup",
  description:
    "Need help setting up equipment for tomorrow's Chemistry lab (CHEM202). Experience with spectrophotometers preferred. The setup includes calibrating the instruments, preparing standard solutions, and ensuring all safety protocols are in place. This is a great opportunity for Chemistry students to gain hands-on experience with professional lab equipment.",
  incentive: 35,
  location: "Chemistry Building, Lab 305",
  imageUrl:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=400",
  postedBy: "Prof. David L.",
  postedAt: "1 hour ago",
  category: "academic",
  requirements: [
    "Experience with spectrophotometers",
    "Basic knowledge of lab safety",
    "Available for 2 hours",
    "Must be a Chemistry student",
  ],
  additionalImages: [
    "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=400",
    "https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=400",
  ],
  posterProfile: {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400",
    rating: 4.9,
    tasksPosted: 15,
    department: "Chemistry Department",
    memberSince: "Sep 2024",
  },
};

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
  console.log(id, "id here");
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [acceptanceState, setAcceptanceState] = useState<
    "idle" | "accepting" | "accepted" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const task = mockTask; // In real app, fetch task by id
  const categoryColor =
    categoryColors[task.category as keyof typeof categoryColors];

  const { data, isLoading, error } = useQuery({
    queryKey: [`task-${id}`],
    queryFn: () => getTask(id),
  });
  console.log("singletask", data);

  const handleAcceptTask = async () => {
    try {
      setAcceptanceState("accepting");
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAcceptanceState("accepted");
      setTimeout(() => {
        router.back();
      }, 1000);
    } catch (error) {
      setAcceptanceState("error");
      setErrorMessage("Failed to accept task. Please try again.");
      setTimeout(() => {
        setAcceptanceState("idle");
        setErrorMessage(null);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn.duration(300)}>
          <SafeAreaView style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
            <Pressable style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="#000" />
            </Pressable>
          </SafeAreaView>

          <View style={styles.imageContainer}>
            <Image
              source={{ uri: task.imageUrl }}
              style={styles.mainImage}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.imageOverlay}
            />
            <View style={styles.imageContent}>
              <Text style={styles.incentive}>
                {formatCurrency(data?.incentive)}
              </Text>
              <Text style={styles.postedAt}>{task.postedAt}</Text>
            </View>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>{data?.task}</Text>

            <Pressable style={styles.posterContainer}>
              <Image
                source={{ uri: task.posterProfile.image }}
                style={styles.posterImage}
                contentFit="cover"
                transition={200}
              />
              <View style={styles.posterInfo}>
                <Text style={styles.posterName}>
                  {data?.user.first_name} {data?.user.last_name}
                </Text>
                <View style={styles.posterStats}>
                  <View style={styles.stat}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.statText}>
                      {task.posterProfile.rating}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#4CAF50"
                    />
                    <Text style={styles.statText}>
                      {task.posterProfile.tasksPosted} tasks
                    </Text>
                  </View>
                </View>
              </View>
              <Pressable style={styles.viewProfile}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </Pressable>
            </Pressable>

            <View style={styles.locationContainer}>
              <Ionicons
                name="location"
                size={20}
                color={categoryColor.primary}
              />
              <Text style={styles.location}>{data?.location}</Text>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{data?.description}</Text>

            <Text style={styles.sectionTitle}>Additional Photos</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.additionalImages}
            >
              {task.additionalImages.map((img, index) => (
                <Image
                  key={index}
                  source={{ uri: img }}
                  style={styles.additionalImage}
                  contentFit="cover"
                  transition={200}
                />
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      </ScrollView>

      <Animated.View
        style={styles.bottomBar}
        entering={SlideInDown.springify()}
      >
        <LinearGradient
          colors={categoryColor.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.acceptButton}
        >
          <Pressable
            onPress={() => setShowAcceptConfirm(true)}
            style={styles.acceptButtonContent}
            disabled={acceptanceState !== "idle"}
          >
            {acceptanceState === "idle" && (
              <>
                <Text style={styles.acceptButtonText}>Accept Task</Text>
                <View style={styles.acceptButtonAmount}>
                  <Text style={styles.acceptButtonAmountText}>
                    {formatCurrency(data?.incentive)}
                  </Text>
                </View>
              </>
            )}
            {acceptanceState === "accepting" && (
              <View style={styles.acceptingContainer}>
                <Ionicons
                  name="sync"
                  size={24}
                  color="#fff"
                  style={styles.spinningIcon}
                />
                <Text style={styles.acceptButtonText}>Accepting...</Text>
              </View>
            )}
            {acceptanceState === "accepted" && (
              <View style={styles.acceptedContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                <Text style={styles.acceptButtonText}>Task Accepted!</Text>
              </View>
            )}
            {acceptanceState === "error" && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
          </Pressable>
        </LinearGradient>
      </Animated.View>

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
                colors={categoryColor.gradient}
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
                  <Text style={styles.confirmAcceptText}>Accept</Text>
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
