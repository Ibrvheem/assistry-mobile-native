

// app/(dashboard)/_layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import CustomTabBar from "../../components/CustomTabBar";
import { BellDot } from "lucide-react-native";
// import MyAvatar from "@/components/molecules/my-avatar";
import { MyAvatar } from "../myavatar";

export default function DashboardLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown:false ,
          animation: "none",
        }}
      />
      <CustomTabBar />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
