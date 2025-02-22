import React from "react";
import { Tabs } from "expo-router";
import {
  HomeIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
} from "react-native-heroicons/outline";

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          height: 80,
          borderColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          color: "gray",
        },
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarStyle: { display: "none" },
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <Cog6ToothIcon color={color} size={size} />
          ),
          title: "Settings",
        }}
      />

      <Tabs.Screen
        name="messages/index"
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: { color: "black" },
          headerTitle: "Messages",
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <ChatBubbleLeftIcon color={color} size={size} />
          ),
          title: "Messages",
        }}
      />

      <Tabs.Screen
        name="messages/[id]"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
          title: "Messages",
        }}
      />
      <Tabs.Screen
        name="tasks/[id]"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
          title: "Messages",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <UserCircleIcon color={color} size={size} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
