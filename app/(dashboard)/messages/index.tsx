import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import React from "react";
import { Separator } from "tamagui";
import { Avatar } from "@/app/avatar";
import { useRouter } from "expo-router";

export default function Messages() {
  const { push } = useRouter();

  // Sample message data (you might get this from an API or local state)
  const messages = [
    {
      id: 1,
      name: "Salma Hadejia",
      message: "Hi Musa, What is your estimated time of arr...",
      timestamp: "Just Now",
      unreadCount: 3,
    },
    {
      id: 2,
      name: "Abdussamad Ibrahim",
      message: "Hey, I am outside",
      timestamp: "15:32",
      unreadCount: 0,
    },
  ];

  return (
    <View className="flex-1 bg-white p-6">
      <SafeAreaView className="space-y-2">
        {messages.map((message) => (
          <TouchableOpacity
            key={message.id} // Use the message ID as a unique key
            className="flex flex-row w-full space-x-2 items-center hover:bg-slate-300"
            onPress={() => {
              push(`/messages/${message.id}`); // Navigate with dynamic ID
            }}
          >
            <View className="relative ">
              <Avatar size={50} />
              {message.unreadCount > 0 && (
                <View className="h-3 w-3 rounded-full absolute bottom-2.5 border border-white right-0 bg-green-400"></View>
              )}
            </View>
            <View className="text-ellipsis flex-1">
              <View className="flex flex-row justify-between">
                <View className="flex flex-row gap-1">
                  <Text className="" style={{ fontFamily: "poppins" }}>
                    {message.name}
                  </Text>
                  {message.unreadCount > 0 && (
                    <View className="bg-green-100 bg-opacity-5 flex items-center justify-center rounded-full h-5 w-5">
                      <Text
                        className="text-xs font-bold text-green-700"
                        style={{ fontFamily: "poppinsBold" }}
                      >
                        {message.unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
                <Text
                  className="text-xs text-gray-500"
                  style={{ fontFamily: "poppins" }}
                >
                  {message.timestamp}
                </Text>
              </View>
              <Text
                className="w-30 text-sm text-gray-600"
                style={{ fontFamily: "poppins" }}
              >
                {message.message}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
        <Separator />
      </SafeAreaView>
    </View>
  );
}
