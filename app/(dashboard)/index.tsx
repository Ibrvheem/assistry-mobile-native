import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
  LogBox,
} from "react-native";
import React, { useState } from "react";
import { Button } from "tamagui";
import Svg, { Path } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";
import { getByYou } from "./services";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/helpers";
import { useGobalStoreContext } from "@/store/global-context";
import AssistEmptyState from "@/components/atoms/assist-empty-state";
export default function Index() {
  const [tabs, setTabs] = useState("for-you");
  const indicatorPosition = useSharedValue(0);
  const { data, isLoading, error } = useQuery({
    queryKey: ["by-you"],
    queryFn: getByYou,
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
  const { studentData } = useGobalStoreContext();

  LogBox.ignoreAllLogs(true);

  return (
    <View
      className="h-full"
      style={{ backgroundColor: "white", boxSizing: "border-box" }}
    >
      <SafeAreaView>
        <View className="p-2">
          <View className="bg-black h-56 rounded-lg p-4 flex items-center justify-center">
            <Text
              className="text-xl text-white"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Hi, name 👋🏾
            </Text>

            <Text
              className="text-sm text-gray-500 text-center"
              style={{ fontFamily: "PoppinsBold" }}
            >
              Your Balance
            </Text>
            <Text
              className="text-5xl py-4 text-green-500"
              style={{ fontFamily: "PoppinsBold" }}
            >
              {formatCurrency(250000)}
            </Text>
            <View className="flex flex-row items-center gap-2">
              <View className="bg-zinc-600 p-2 px-4 rounded-md flex flex-row items-center">
                <Svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  width={20}
                  height={20}
                  className="text-green-500 mr-2"
                >
                  <Path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                  />
                </Svg>
                <Text
                  className="text-slate-300"
                  style={{ fontFamily: "PoppinsBold" }}
                >
                  Completed 54 tasks
                </Text>
              </View>
              <View className="bg-zinc-600 p-2 px-4 rounded-md flex flex-row">
                <Text
                  className="text-slate-300"
                  style={{ fontFamily: "PoppinsBold" }}
                >
                  📍UDUS
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex justify-center items-center mt-4 bg-slate-200 mx-1.5 rounded-md">
          {/* Container for tabs */}
          <View
            className="rounded-md h-[45px] items-center"
            style={{
              width: containerWidth,
              flexDirection: "row",
            }}
          >
            {/* Animated Indicator */}
            <Animated.View
              className={"shadow-lg"}
              style={[
                {
                  position: "absolute",
                  width: tabWidth,
                  height: 40,
                  backgroundColor: "white",
                  borderRadius: 6,
                },
                animatedIndicatorStyle,
              ]}
            />

            {/* "By You" Tab */}
            <Button
              className="w-[50%] bg-transparent"
              onPress={() => {
                setTabs("by-you");
                indicatorPosition.value = 0;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={{
                  fontFamily:
                    tabs === "by-you" ? "PoppinsBold" : "PoppinsMedium",
                  textAlign: "center",
                }}
              >
                By you 🤳🏾
              </Text>
            </Button>

            {/* "For You" Tab */}
            <Button
              className="w-[50%] bg-transparent"
              onPress={() => {
                setTabs("for-you");
                indicatorPosition.value = 1;
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text
                style={{
                  fontFamily:
                    tabs === "for-you" ? "PoppinsBold" : "PoppinsMedium",
                  textAlign: "center",
                }}
              >
                For you 💸
              </Text>
            </Button>
          </View>
        </View>
        <ScrollView className="">
          {tabs === "by-you" ? (
            <View className="p-4 pb-80 w-full">
              {data?.map((each: any) => {
                const currentTime = dayjs();
                const expirationTime = dayjs(each.created_at).add(
                  each.expires,
                  "hours"
                );
                return (
                  <View className="h-auto w-full rounded-2xl border border-gray-200 mb-2 shadow-lg p-2 flex flex-row gap-2 mt-1">
                    <View className="h-16 w-16 bg-orange-400 rounded-xl"></View>
                    <View className="">
                      <View className="h-auto w-48 rounded-sm animate-pulse mb-2">
                        <Text style={{ fontFamily: "Poppins" }}>
                          Cold Stone Ice Cream
                        </Text>
                      </View>
                      <View className="h-auto  rounded-sm animate-pulse mb-2">
                        <Text style={{ fontFamily: "Poppins" }}>
                          💰 {formatCurrency(2000 * 100)}
                        </Text>
                      </View>
                      {/* <View className="h-4 w-72 bg-gray-200 rounded-sm animate-pulse mb-2"></View> */}
                      <View className="w-72 h-auto rounded-sm animate-pulse mb-2 flex flex-row items-center justify-between">
                        <Text>
                          📍{" "}
                          <Text style={{ fontFamily: "Poppins" }}>
                            Ibrahim Aliyu Hostel
                          </Text>
                        </Text>
                        <Text className="text-gray-500 font-mono font-semibold text-xs">
                          24mins ago.
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ) : (
            <View>
              <AssistEmptyState />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
