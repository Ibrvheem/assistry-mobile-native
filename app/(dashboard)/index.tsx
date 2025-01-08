import {
  View,
  Text,
  SafeAreaView,
  useWindowDimensions,
  ScrollView,
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
import LoadingChildren from "@/components/molecules/loading-children";
import CircularProgress from "@/components/molecules/circular-progress";
import { useQuery } from "@tanstack/react-query";
import { getByYou } from "./services";
import dayjs from "dayjs";
import { formatCurrency } from "@/lib/helpers";
import { useGobalStoreContext } from "@/store/global-context";
export default function Index() {
  const [tabs, setTabs] = useState("for-you");
  const indicatorPosition = useSharedValue(0); // 0 for 'By you', 1 for 'For you'
  const { data, isLoading, error } = useQuery({
    queryKey: ["by-you"],
    queryFn: getByYou,
  });

  const { width } = useWindowDimensions(); // Get screen width
  const containerWidth = width * 0.95; // Use 90% of the screen width for the container
  const tabWidth = containerWidth / 2; // Dynamically calculate the tab width (50% of container width)

  // Animated indicator style
  const animatedIndicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(indicatorPosition.value * tabWidth), // Move indicator dynamically
      },
    ],
  }));
  const { studentData } = useGobalStoreContext();

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
              Hi, {studentData?.name} 👋🏾
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
          <View className="p-4 pb-20">
            {data?.map((each) => {
              const currentTime = dayjs();
              const expirationTime = dayjs(each.created_at).add(
                each.expires,
                "hours"
              ); // Adjust based on your expiration logic
              const timeLeftMinutes = expirationTime.diff(
                currentTime,
                "minute"
              );

              return (
                <View
                  key={each.id} // Ensure a unique key for each item
                  className="h-auto border border-slate-200 rounded-md mt-2 p-3"
                >
                  <Text style={{ fontFamily: "PoppinsBold" }}>{each.task}</Text>
                  <Text style={{ fontFamily: "PoppinsMedium" }}>
                    {each.description}
                  </Text>
                  <View className="flex flex-row items-center justify-between">
                    <Text style={{ fontFamily: "PoppinsMedium" }}>
                      💸 {formatCurrency(each.incentive)}
                    </Text>
                    <View className="flex flex-row items-center">
                      <Text
                        style={{ fontFamily: "PoppinsMedium" }}
                        className="text-xs text-gray-500"
                      >
                        {timeLeftMinutes > 0
                          ? `Expires in ${timeLeftMinutes} Minute${timeLeftMinutes > 1 ? "s" : ""}`
                          : "Expired"}
                      </Text>
                      <CircularProgress
                        timeLeft={Math.max(0, timeLeftMinutes)}
                        totalTime={2 * 60}
                      />
                    </View>
                  </View>
                  <View className="flex flex-row items-center justify-between mt-2 ">
                    <Button variant="outlined" className="w-[49%]">
                      <LoadingChildren loading={false} textColor="black">
                        View
                      </LoadingChildren>
                    </Button>
                    <Button className="bg-green-500 w-[49%]">
                      <LoadingChildren loading={false}>
                        Accept Request
                      </LoadingChildren>
                    </Button>
                  </View>
                </View>
              );
            })}
          </View>
          ;
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
