import { View, Text } from "react-native";
import React from "react";

export default function AssistEmptyState() {
  return (
    <View>
      <View className="flex items-center justify-center h-80 gap-3">
        <View className="h-32 w-32 bg-green-100 rounded-full flex  items-center justify-center">
          <Text className="text-4xl">📭</Text>
        </View>
        <Text style={{ fontFamily: "Poppins" }} className="font-medium">
          No Available Assist. Come back soon!
        </Text>
      </View>
    </View>
  );
}
