import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  FolderOpenIcon,
  InboxIcon,
  PlusIcon,
} from "react-native-heroicons/outline";
import { Button } from "tamagui";

import { ArrowTrendingUpIcon } from "react-native-heroicons/outline";

function EmptyTransaction() {
  return (
    <View className="flex items-center justify-center my-8 space-y-4">
      <View className="bg-green-300/30 h-32 w-32 rounded-full flex items-center justify-center">
        <ArrowTrendingUpIcon color="#4ADE80" size={70} />
      </View>
      <Text className="font-bold">There's no available transactions</Text>
    </View>
  );
}

export default EmptyTransaction;
