// components/CustomTabBar.tsx
import React from "react";
import Colors from "@/constants/Colors";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Home, User, List, MessageCircleMore } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const currentRoute = segments[segments.length - 1]; // detect active route

  const tabs = [
    { label: "Home", icon: Home, route: "/(dashboard)" },
    { label: "Tasks", icon: List, route: "/(dashboard)/tasks" },
    { label: "chats", icon: MessageCircleMore, route: "/(dashboard)/messages" },
    { label: "Profile", icon: User, route: "/(dashboard)/profile/profile" },
  ];

  return (
    <View style={[
      styles.tabContainer, 
      Platform.OS === 'android' 
        ? { paddingBottom: insets.bottom, height: 80 + insets.bottom } 
        : { height: 80, paddingBottom: 20 } // Default for iOS or if user prefers no dynamic adjustment there
    ]}>
      {tabs.map(({ label, icon: Icon, route }) => {
        const active = currentRoute === route.split("/").pop();
        return (
          <Pressable
            key={route}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => router.push(route as any)}
          >
            <Icon color={active ? Colors.brand.primary : Colors.brand.textMuted} size={22} />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// const styles = StyleSheet.create({
//   tabContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     alignItems: "center",
//     height: 100,
//     backgroundColor: "#fff",
//     borderTopWidth: StyleSheet.hairlineWidth,
//     borderTopColor: "#E5E7EB",
//   },
//   tab: {
//     alignItems: "center",
//   },
//   activeTab: {
//     // borderTopWidth: 2,
//     // borderTopColor: "#22C55E",
//   },
//   label: {
//     fontSize: 12,
//     color: "#6B7280",
//     marginTop: 2,
//   },
//   activeLabel: {
//     color: "#22C55E",
//     fontWeight: "600",
//   },
// });

// components/CustomTabBar.tsx
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: Colors.brand.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
    activeTab: {
    // borderTopWidth: 2,
    // borderTopColor: "#22C55E",
  },
  tab: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: Colors.brand.textMuted,
    marginTop: 2,
  },
  activeLabel: {
    color: Colors.brand.primary,
    fontWeight: "600",
  },
});
