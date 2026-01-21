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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { cloudinaryUrl } from "@/lib/helpers";

import dayjs from "dayjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptTask, getTask, completeTask, approveTask } from "./services";
import { formatCurrency } from "@/lib/helpers";
import TaskDetailsSkeleton from "@/components/tasks/task-details-loading-skeleton";
import { TaskSchema, TaskStatus } from "../types";
import { useGobalStoreContext } from "@/store/global-context";

const categoryColors = {
  academic: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  errands: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  delivery: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  tutoring: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  events: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
  other: { primary: "#22C55E", gradient: ["#22C55E", "#4ADE80"] },
};

export default function TaskDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams() as { id: string };
  const { userData } = useGobalStoreContext();
  const [showAcceptConfirm, setShowAcceptConfirm] = useState(false);
  const [acceptanceState, setAcceptanceState] = useState<
    "idle" | "accepting" | "accepted" | "completing" | "approving" | "error"
  >("idle");
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

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

  const handleCompleteTask = async () => {
      try {
        setAcceptanceState("completing");
        await completeTask({ taskId: id });
        await queryClient.invalidateQueries({ queryKey: [`task-${id}`] });
        setAcceptanceState("idle");
      } catch (err) {
        console.error(err);
        setAcceptanceState("error");
      }
  };

  const handleApproveTask = async () => {
      try {
        setAcceptanceState("approving");
        await approveTask({ taskId: id });
        await queryClient.invalidateQueries({ queryKey: [`task-${id}`] });
        setAcceptanceState("idle");
        router.back();
      } catch (err) {
        console.error(err);
        setAcceptanceState("error");
      }
  };

  return isLoading ? (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <TaskDetailsSkeleton />
    </View>
  ) : (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
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
          {data?.assets?.[0]?.url ? (
            <View style={styles.imageContainer}>
              <Image
                source={{
                  uri: data.assets[0].url.replace("auto/upload", "image/upload"),
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
          ) : (
            <View style={{ height: insets.top + 60 }} />
          )}

          {/* Task Details */}
          <View style={styles.content}>
            {!data?.assets?.[0]?.url && (
              <View style={styles.noImageHeader}>
                <Text style={styles.noImageIncentive}>
                  {formatCurrency(data?.incentive)}
                </Text>
                <Text style={styles.noImagePostedAt}>
                  {dayjs(data.created_at).format("MMMM D, h:mm A")}
                </Text>
              </View>
            )}
            
            <Text style={[styles.title, { color: themeColors.text }]}>{data?.task}</Text>

            {/* User Info */}
            <Pressable style={[styles.posterContainer, { 
                backgroundColor: themeColors.surface,
                borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
            }]}>
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
                <Text style={[styles.posterName, { color: themeColors.text }]}>
                  {data?.user?.first_name} {data?.user?.last_name}
                </Text>
                <View style={styles.posterStats}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.statText, { color: themeColors.textMuted }]}>3.03</Text>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={[styles.statText, { color: themeColors.textMuted }]}>10 tasks</Text>
                </View>
              </View>
              <Pressable style={[styles.viewProfile, { borderColor: themeColors.primary }]} 
              onPress={() => {
                             router.push({ pathname: "/profile/view", params: {id:data?.user?._id  } })
                          }}>
                <Text style={[styles.viewProfileText, { color: themeColors.primary }]}>View Profile</Text>
              </Pressable>
            </Pressable>

            {/* Location */}
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                   
             <View style={[styles.locationContainer, { 
                 backgroundColor: themeColors.surface,
                 borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
             }]}>
               <Ionicons
                 name="location"
                 size={20}
                 color={categoryColors.delivery.primary}
               />
               <Text style={[styles.location, { color: themeColors.text }]}>{data?.location}</Text>
             </View>
              <View style={{flexDirection:'row',alignItems:'center',gap:4,marginBottom:8}}>
                         <Ionicons name="eye" size={24} color="#18AE6A" />
                         <Text style={[styles.views, { color: themeColors.primary }]}>{data?.views}</Text>
                     </View>
              </View>

            {/* Description */}
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Description</Text>
            <Text style={[styles.description, { color: themeColors.textDim }]}>{data?.description}</Text>

            {/* Payment & Timeline Info */}
            <View style={styles.infoRow}>
                <View style={[styles.infoBox, { 
                    backgroundColor: themeColors.surface,
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                }]}>
                    <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>Payment Method</Text>
                    <Text style={[styles.infoValue, { color: data.payment_method === 'CASH' ? '#FFA500' : '#4ADE80' }]}>
                        {data.payment_method === 'CASH' ? 'Cash on Delivery' : 'In-App Wallet'}
                    </Text>
                </View>
                {data.timeline && (
                    <View style={[styles.infoBox, { 
                        backgroundColor: themeColors.surface,
                        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
                    }]}>
                        <Text style={[styles.infoLabel, { color: themeColors.textMuted }]}>Timeline</Text>
                        <Text style={[styles.infoValue, { color: themeColors.text }]}>{data.timeline}</Text>
                    </View>
                )}
            </View>

            {/* Additional Photos */}
            <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Additional Photos</Text>
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
      <View style={[styles.bottomBar, { 
          backgroundColor: themeColors.background,
          borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
      }]}>

        {/* ACTION BUTTONS LOGIC */}
        {/* 1. Executor: PENDING -> Accept */}
        {data.status === TaskStatus.PENDING && data.user?._id !== userData?._id && (
           <LinearGradient
            colors={themeColors.gradient}
            locations={themeColors.gradientLocations as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.acceptButton}
          >
              <Pressable onPress={() => setShowAcceptConfirm(true)} style={styles.acceptButtonContent}>
                    <Text style={[styles.acceptButtonText, { color: isDark ? themeColors.background : '#fff' }]}>
                      {acceptanceState === "accepting" ? "Accepting..." : " Accept Task"}
                    </Text>
                    <View style={styles.acceptButtonAmount}>
                      <Text style={[styles.acceptButtonAmountText, { color: isDark ? themeColors.background : '#fff' }]}>{formatCurrency(data?.incentive)}</Text>
                    </View>
              </Pressable>
            </LinearGradient>
        )}

        {/* 2. Executor: ONGOING -> Complete Task */}
        {data.status === TaskStatus.ONGOING && data.acceptedBy === userData?._id && (
            <Pressable style={[styles.acceptButton, { backgroundColor: themeColors.primary }]} onPress={handleCompleteTask}>
                <View style={styles.acceptButtonContent}>
                    <Text style={[styles.acceptButtonText, { color: Colors.brand.darkGreen }]}>
                        {acceptanceState === "completing" ? "Marking Done..." : "Mark as Completed"}
                    </Text>
                </View>
            </Pressable>
        )}

        {/* 3. Poster: FINISHED -> Approve & Pay */}
        {data.status === TaskStatus.FINISHED && data.user?._id === userData?._id && (
            <Pressable style={[styles.acceptButton, { backgroundColor: data.payment_method === 'CASH' ? '#FFA500' : '#4ADE80' }]} onPress={handleApproveTask}>
                <View style={styles.acceptButtonContent}>
                    <Text style={[styles.acceptButtonText, { color: '#000' }]}>
                         {acceptanceState === "approving" ? "Processing..." : (data.payment_method === 'CASH' ? "Confirm Cash Received" : "Approve & Pay")}
                    </Text>
                </View>
            </Pressable>
        )}

        {/* 4. Others/Status Display */}
        {data.status !== TaskStatus.PENDING && 
         !(data.status === TaskStatus.ONGOING && data.acceptedBy === userData?._id) &&
         !(data.status === TaskStatus.FINISHED && data.user?._id === userData?._id) && (
              <LinearGradient
                colors={['#0c2339', '#113355', '#5973a9']}
                locations={[0, 0.45, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.acceptButton}
                >
                <Pressable style={styles.acceptButtonContent} disabled={true}>
                        <Text style={styles.acceptButtonText}>
                        {data.status === TaskStatus.ACCEPTED ? "Accepted" : 
                         data.status === TaskStatus.ONGOING ? "Ongoing" :
                         data.status === TaskStatus.FINISHED ? "Finished (Reviewing)" :
                         data.status === TaskStatus.COMPLETED ? "Completed" : data.status}
                        </Text>
                </Pressable>
            </LinearGradient>
        )}
      </View>

      {/* Confirmation Modal */}
      {showAcceptConfirm && (
        <Animated.View
          style={[styles.confirmModal, { opacity: fadeAnim }]}
        >
          <View style={[styles.confirmContent, { 
              backgroundColor: isDark ? "#1A1A1A" : "#fff",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
          }]}>
            <Text style={[styles.confirmTitle, { color: themeColors.text }]}>Accept this task?</Text>
            <Text style={[styles.confirmDescription, { color: themeColors.textMuted }]}>
              You're about to accept this task. Make sure you can meet all the
              requirements and complete it on time.
            </Text>
            <View style={styles.confirmButtons}>
              <Pressable
                style={[styles.confirmButton, styles.cancelButton, { 
                    backgroundColor: themeColors.surface,
                    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" 
                }]}
                onPress={() => setShowAcceptConfirm(false)}
              >
                <Text style={[styles.cancelButtonText, { color: themeColors.textMuted }]}>Cancel</Text>
              </Pressable>
              {/* <LinearGradient
                colors={
                  Colors.brand.gradient as any
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                
              > */}
                <Pressable
                style={[styles.confirmButton, styles.confirmAcceptButton, { backgroundColor: isDark ? '#fff' : themeColors.primary }]}
                  onPress={() => {
                    setShowAcceptConfirm(false);

                    handleAcceptTask();
                  }}
                >
                  <Text style={[styles.confirmAcceptText, { color: isDark ? Colors.brand.darkGreen : '#fff' }]}>{"Accept"}</Text>
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
  noImageHeader: {
    marginBottom: 20,
  },
  noImageIncentive: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.brand.primary,
    marginBottom: 4,
  },
  noImagePostedAt: {
    fontSize: 14,
    color: Colors.brand.textMuted,
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
    // color: Colors.brand.darkGreen,
    color: Colors.brand.text,
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
  infoRow: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 24,
  },
  infoBox: {
      backgroundColor: Colors.brand.surface,
      padding: 12,
      borderRadius: 12,
      flex: 1,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.1)",
  },
  infoLabel: {
      color: Colors.brand.textMuted,
      fontSize: 12,
      marginBottom: 4,
  },
  infoValue: {
      color: Colors.brand.text,
      fontSize: 14,
      fontWeight: 'bold',
  }
});
