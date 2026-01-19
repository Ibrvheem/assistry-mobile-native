import React, { useState, useMemo, useRef, useEffect } from "react";
import Colors from "@/constants/Colors";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
  FlatList,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { cloudinaryUrl } from "@/lib/helpers";

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

  // Animation logic for modal
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (showAcceptConfirm) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [showAcceptConfirm]);

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
    <View style={styles.container}>
      <TaskDetailsSkeleton />
    </View>
  ) : (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <SafeAreaView style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </Pressable>
            <Pressable style={styles.shareButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
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
                             router.push({ pathname: "/profile/view", params: {id:data?.user?._id  } })
                          }}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </Pressable>
            </Pressable>

            {/* Location */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                   
             <View style={styles.locationContainer}>
               <Ionicons
                 name="location"
                 size={20}
                 color={categoryColors.delivery.primary}
               />
               <Text style={styles.location}>{data?.location}</Text>
             </View>
              <View style={{flexDirection:'row',alignItems:'center',gap:4,marginBottom:8}}>
                         <Ionicons name="eye" size={24} color="#18AE6A" />
                         <Text style={styles.views}>{data?.views}</Text>
                     </View>
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

        {data.status === TaskStatus.PENDING ? (
              <>
           <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.acceptButton}
      >
          <Pressable
            onPress={() => setShowAcceptConfirm(true)}
            style={styles.acceptButtonContent}
          >
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
          </Pressable>
        </LinearGradient>
        </>
        ) : (
          <>
               <LinearGradient
  colors={['#0c2339', '#113355', '#5973a9']}
  locations={[0, 0.45, 1]}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.acceptButton}
>
          <Pressable
            onPress={() => setShowAcceptConfirm(true)}
            style={styles.acceptButtonContent}
            disabled={true}
          >
                <Text style={styles.acceptButtonText}>
                  On going ...
                </Text>
                <View style={styles.acceptButtonAmount}>
                  <Text style={styles.acceptButtonAmountText}>
                    {formatCurrency(data?.incentive)}
                  </Text>
                </View>
          </Pressable>
        </LinearGradient>
              </> 
            )}
      </View>

      {/* Confirmation Modal */}
      {showAcceptConfirm && (
        <Animated.View
          style={[styles.confirmModal, { opacity: fadeAnim }]}
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
              {/* <LinearGradient
                colors={
                  Colors.brand.gradient as any
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                
              > */}
                <Pressable
                style={[styles.confirmButton, styles.confirmAcceptButton]}
                  onPress={() => {
                    setShowAcceptConfirm(false);

                    handleAcceptTask();
                  }}
                >
                  <Text style={styles.confirmAcceptText}>{"Accept"}</Text>
                </Pressable>
              {/* </LinearGradient> */}
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
    backgroundColor: Colors.brand.background,
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
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
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
    color: Colors.brand.text,
    marginBottom: 16,
  },
  posterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.surface,
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
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
    color: Colors.brand.text,
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
    color: Colors.brand.textMuted,
  },
  viewProfile: {
    backgroundColor: "transparent",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.brand.primary,
  },
  viewProfileText: {
    color: Colors.brand.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  location: {
    marginLeft: 8,
    fontSize: 16,
    color: Colors.brand.text,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.brand.text,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: Colors.brand.textDim,
    lineHeight: 24,
    marginBottom: 24,
  },
  requirementsList: {
    marginBottom: 24,
  },
  views:{
    color: Colors.brand.primary,
    fontWeight:'600',
    fontSize:16

  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  requirementText: {
    marginLeft: 12,
    fontSize: 16,
    color: Colors.brand.text,
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
    backgroundColor: Colors.brand.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
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
    color: Colors.brand.darkGreen,
    fontSize: 18,
    fontWeight: "bold",
  },
  acceptButtonAmount: {
    backgroundColor: "#ffffff33",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  acceptButtonAmountText: {
    color: Colors.brand.darkGreen,
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
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  confirmContent: {
    backgroundColor: "#1A1A1A", // Dark modal background
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.brand.text,
    marginBottom: 12,
    textAlign: "center",
  },
  confirmDescription: {
    fontSize: 16,
    color: Colors.brand.textMuted,
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
    backgroundColor: Colors.brand.surface,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cancelButtonText: {
    color: Colors.brand.textMuted,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  confirmAcceptButton: {
    padding: 16,
    backgroundColor: '#fff',
  },
  confirmAcceptText: {
    color: Colors.brand.darkGreen,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
