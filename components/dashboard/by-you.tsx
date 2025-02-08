import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AssistEmptyState from "@/components/atoms/assist-empty-state";
import { TaskSchema } from "../../app/(dashboard)/types";
import { ScrollView } from "tamagui";
import { Avatar } from "@/app/avatar";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { formatCurrency } from "@/lib/helpers";
dayjs.extend(relativeTime);

export default function ByYou({ byYou }: { byYou: TaskSchema[] }) {
  return (
    <ScrollView className="">
      {byYou?.length < 1 ? (
        <AssistEmptyState />
      ) : (
        <View className="p-4 pb-80">
          {byYou?.map((each) => {
            return (
              <TouchableOpacity
                key={each.id}
                className="h-auto border border-slate-200 rounded-md mt-2 p-3"
              >
                <View className="flex flex-row justify-between">
                  <View className="flex flex-row items-center">
                    <View className="mr-2">
                      <Avatar />
                    </View>
                    <View>
                      <Text
                        style={{ fontFamily: "Poppins" }}
                        className="font-bold text-gray-700 capitalize"
                      >
                        {each.task}
                      </Text>
                      <Text
                        style={{ fontFamily: "Poppins" }}
                        className="text-gray-700 text-xs"
                      >
                        by You
                      </Text>
                    </View>
                  </View>
                  <View className="mt-2">
                    <Text className="text-gray-600">
                      {dayjs(each.created_at).fromNow()}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ fontFamily: "Poppins" }}
                  className="text-gray-600"
                >
                  {each.description}
                </Text>
                <View className="h-[1px] w-full bg-gray-200 my-2"></View>
                <View className="flex flex-row items-center justify-between">
                  <Text
                    style={{ fontFamily: "Poppins" }}
                    className="text-gray-500"
                  >
                    💸 {formatCurrency(each.incentive)}
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins" }}
                    className="text-gray-500"
                  >
                    📍 Hostel A
                  </Text>
                  <Text
                    style={{ fontFamily: "Poppins" }}
                    className="text-gray-500"
                  >
                    ⏱️ {each.expires} hours
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}
