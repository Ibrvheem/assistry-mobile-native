import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  LogBox,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button } from "tamagui";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";
import { getByYou, getForYou } from "./services";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/helpers";
import { useGobalStoreContext } from "@/store/global-context";
import AssistEmptyState from "@/components/atoms/assist-empty-state";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "../avatar";
import TaskCard from "@/components/dashboard/TaskCard";
import WalletCard from "@/components/dashboard/WalletCard";
import { router } from "expo-router";
import EmptyTaskState from "@/components/molecules/empty-task-state";
export default function Index() {
  const [tabs, setTabs] = useState("for-you");
  const indicatorPosition = useSharedValue(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ["by-you"],
    queryFn: getForYou,
  });

  const { width } = useWindowDimensions();
  const containerWidth = width * 0.95;
  const tabWidth = containerWidth / 2;

  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(indicatorPosition.value * tabWidth),
      },
    ],
  }));
  return (
    <View
      className="h-full"
      style={{ backgroundColor: "white", boxSizing: "border-box" }}
    >
      <ScrollView>
        <WalletCard balance={2000} spent={1500} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Campus Tasks</Text>
          {data?.length > 0 ? (
            data?.map((each) => {
              return (
                <TaskCard
                  title={each.task}
                  description={each.description}
                  incentive={each.incentive}
                  location={each.location ?? "Coke Village"}
                  postedBy={`${each.user.first_name} ${each.user.last_name}`}
                  postedAt={each.created_at}
                  imageUrl={
                    each?.assets[0]?.url
                      ? each?.assets[0]?.url
                      : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?"
                  }
                  onPress={() => {
                    router.push({
                      pathname: "/tasks/[id]",
                      params: { id: each._id },
                    });

                    console.log("Task pressed:", each.id);
                  }}
                />
              );
            })
          ) : (
            <EmptyTaskState />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
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
});
