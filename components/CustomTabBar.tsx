import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Home, User, List } from "lucide-react-native";

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();

  const currentRoute = segments[segments.length - 1]; // detect active route

  const tabs = [
    { label: "Home", icon: Home, route: "/(dashboard)" },
    { label: "Tasks", icon: List, route: "/(dashboard)/tasks" },
    { label: "Profile", icon: User, route: "/(dashboard)/profile/profile" },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map(({ label, icon: Icon, route }) => {
        const active = currentRoute === route.split("/").pop();
        return (
          <Pressable
            key={route}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => router.push(route as any)}
          >
            <Icon color={active ? "#22C55E" : "#9CA3AF"} size={22} />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 100,
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E7EB",
  },
  tab: {
    alignItems: "center",
  },
  activeTab: {
    // borderTopWidth: 2,
    // borderTopColor: "#22C55E",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  activeLabel: {
    color: "#22C55E",
    fontWeight: "600",
  },
});
