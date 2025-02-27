import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  FolderOpenIcon,
  InboxIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import { Button } from "tamagui";

function EmptyTaskState() {
  return (
    <View className="flex items-center justify-center my-8 space-y-4">
      <View className="bg-green-300/30 h-60 w-60 rounded-full flex items-center justify-center">
        <FolderOpenIcon color="#4ADE80" size={80} />
      </View>
      <Text className="font-bold">There's no available task right now!</Text>
    </View>
  );
}

export default EmptyTaskState;
