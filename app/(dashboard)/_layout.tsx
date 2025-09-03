// app/(dashboard)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import {
  HomeIcon,
  Cog6ToothIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  ListBulletIcon,
} from "react-native-heroicons/outline";

export default function DashboardLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          height: 50,
          borderColor: "transparent",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          color: "gray",
        },
        tabBarActiveTintColor: "green",
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
        name="tasks/index"
        options={{
          headerShown: false,
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: { color: "black" },
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <ListBulletIcon color={color} size={size} />
          ),
          title: "Messages",
        }}
      />

      <Tabs.Screen
        name="messages/index"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
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
        name="profile/profile"
        options={{
          tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ color, size }) => (
            <UserCircleIcon color={color} size={size} />
          ),
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="profile/edit/index"
        options={{
          tabBarStyle: { display: "none" },
          href: null,
          title: "Messages",
        }}
      />

           <Tabs.Screen
  name="transactions"            // must match the folder name
  options={{
    href: null,
    // href: null,
    // tabBarStyle: { display: "none" },
    // tabBarButton: () => null,    // hide the tab button completely
  }}
/>
    </Tabs>
  );
}
