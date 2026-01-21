// components/CustomTabBar.tsx
import React from "react";
import Colors from "@/constants/Colors";
import { View, Pressable, Text, StyleSheet, Platform } from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Home, User, List, MessageCircleMore } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useChatStore } from "@/store/chat-store";
import { useColorScheme } from "@/components/useColorScheme";

export default function CustomTabBar() {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const currentRoute = segments[segments.length - 1]; // detect active route

  const tabs = [
    { label: "Home", icon: Home, route: "/(dashboard)" },
    { label: "Tasks", icon: List, route: "/(dashboard)/tasks" },
    { label: "chats", icon: MessageCircleMore, route: "/(dashboard)/messages" },
    { label: "Profile", icon: User, route: "/(dashboard)/profile/profile" },
  ];

  const { unreadConversationCount } = useChatStore();

  return (
    <View style={[
      styles.tabContainer, 
      { 
        backgroundColor: themeColors.background,
        borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
      },
      Platform.OS === 'android' 
        ? { paddingBottom: insets.bottom, height: 80 + insets.bottom } 
        : { height: 80, paddingBottom: 20 } 
    ]}>
      {tabs.map(({ label, icon: Icon, route }) => {
        const active = currentRoute === route.split("/").pop();
        const isChat = label === "chats";
        
        return (
          <Pressable
            key={route}
            style={[styles.tab, active && styles.activeTab]}
            onPress={() => router.push(route as any)}
          >
            <View>
              <Icon 
                color={active ? Colors.brand.secondary : themeColors.text} 
                size={22} 
              />
              {isChat && unreadConversationCount > 0 && (
                <View style={[styles.badge, { backgroundColor: themeColors.primary, borderColor: themeColors.background }]}>
                  <Text style={styles.badgeText}>
                    {unreadConversationCount > 99 ? "99+" : unreadConversationCount}
                  </Text>
                </View>
              )}
            </View>
            <Text style={[
                styles.label, 
                { color: active ?  Colors.brand.secondary : themeColors.text },
                active && styles.activeLabel
            ]}>
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}


// components/CustomTabBar.tsx
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    position: "absolute", // fixed not valid in RN, strict TS might complain but it works in web, better use absolute for RN
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
    marginTop: 2,
  },
  activeLabel: {
    fontWeight: "600",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -8,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
  },
  badgeText: {
    color: "#000",
    fontSize: 9,
    fontWeight: "bold",
  },
});
