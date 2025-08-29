import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  Pressable,
  AppState,
  AppStateStatus,
  LogBox,
  StyleSheet,
} from "react-native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { PlusCircleIcon } from "react-native-heroicons/outline";
// import { useQuery } from "@tanstack/react-query";
import { getForYou, getWallet } from "./services";
import WalletCard from "@/components/dashboard/WalletCard";
import { router } from "expo-router";
import EmptyTaskState from "@/components/molecules/empty-task-state";
import CreateTaskModal from "@/components/organism/create-task-modal";
import { TaskSchema } from "./types";
import WalletCardSkeleton from "@/components/dashboard/wallet-card-skeleton";
import TaskCard from "@/components/dashboard/TaskCard";
import TaskLoadingSkeleton from "@/components/tasks/task-loading-skeleton";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  taskheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  userInfo: {
    flex: 1,
    marginRight: 16,
  },
  nameSection: {
    marginBottom: 4,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  majorText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  bulletPoint: {
    fontSize: 15,
    color: "#666",
    marginHorizontal: 6,
  },
  yearText: {
    fontSize: 15,
    color: "#666",
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 12,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statText: {
    marginLeft: 4,
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f0f0f0",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  universityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  universityText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 6,
  },
  studentIdText: {
    fontSize: 13,
    color: "#666",
  },
  section: {
    marginTop: 24,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginLeft: 16,
    marginBottom: 8,
  },
    filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dcfce7",
    padding: 8,
    borderRadius: 20,
  },
  filterText: { color: "#22C55E", marginLeft: 4, fontWeight: "600" },
});


import { useQuery, useQueryClient } from "@tanstack/react-query";
// import { getWallet } from "@/services/wallet"; // 👈 import

export default function Index() {
  const [tabs, setTabs] = useState("for-you");
  const [open, setOpen] = useState(false);
  const [appActive, setAppActive] = useState(true);
  const queryClient = useQueryClient();

   useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      setAppActive(next === "active");
    });
    return () => sub.remove();
  }, []);

  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useQuery({
  queryKey: ["wallet"],
  queryFn: getWallet,
  refetchInterval: appActive ? 300000 : false,
  refetchIntervalInBackground: false,
  staleTime: 5000,
  retry: 1,
});

  // fetch wallet
  // const {
  //   data: walletData,
  //   isLoading: walletLoading,
  //   error: walletError,
  // } = useQuery({
  //   queryKey: ["wallet"],
  //   queryFn: getWallet,
  // });

  // fetch tasks
  // const {
  //   data: tasksData,
  //   isLoading: tasksLoading,
  //   error: tasksError,
  // } = useQuery({
  //   queryKey: ["for-you"],
  //   queryFn: getForYou,
  // });

  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
  } = useQuery({
    queryKey: ["for-you"],
    queryFn: getForYou,
    staleTime: 1000 * 60,
    retry: 1,
  });

  useEffect(() => {
    if (appActive) {
      refetchWallet();
    }
  }, [appActive, refetchWallet]);

  const balance = walletData?.data?.balance_kobo;
  const spent = walletData?.data?.spent ?? 0;

  return walletLoading || tasksLoading ? (
    <View className="h-full" style={{ backgroundColor: "white" }}>
      <WalletCardSkeleton />
      <TaskLoadingSkeleton />
    </View>
  ) : (
    <View className="h-full" style={{ backgroundColor: "white" }}>
      <ScrollView>
        {/* 👇 now balance comes from backend */}
        <WalletCard balance={balance} spent={spent} />

        <View style={styles.section}>
          <View style={styles.taskheader}>
            <Text style={styles.sectionTitle}>Campus Tasks</Text>
            <Pressable
              style={styles.filterButton}
              onPress={() => setOpen(true)}
            >
              <PlusCircleIcon size={20} color="#22C55E" />
              <Text style={styles.filterText}>Post Task</Text>
            </Pressable>
          </View>

          <CreateTaskModal open={open} setOpen={setOpen} />

          {tasksData?.length > 0 ? (
            tasksData.map((each: TaskSchema) => (
              <TaskCard
                key={each._id}
                title={each.task}
                description={each?.description ?? ""}
                incentive={each.incentive}
                location={each.location ?? "Coke Village"}
                postedBy={
                  each?.user
                    ? `${each.user.first_name}`
                    : "You"
                }
                postedAt={dayjs(each.created_at).format("MMMM D, h:mm A")}
                imageUrl={
                  each?.assets[0]?.url ??
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?"
                }
                onPress={() =>
                  router.push({
                    pathname: "/tasks/[id]",
                    params: { id: each._id },
                  })
                }
              />
            ))
          ) : (
            <EmptyTaskState />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
