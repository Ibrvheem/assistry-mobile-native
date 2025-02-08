import React, { useState } from "react";
import { Stack, Tabs } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import {
  Cog6ToothIcon,
  HomeIcon,
  SparklesIcon as SparklesIconOutline,
  UserCircleIcon,
} from "react-native-heroicons/outline";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <>
      <Tabs
        screenOptions={{
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
          tabBarIconStyle: {},
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabelStyle: {
              display: "none",
            },
            tabBarIcon: ({ color, size }) => (
              <HomeIcon color={color} size={size} />
            ),
            title: "Home",
            headerShown: false,
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            tabBarLabelStyle: {
              display: "none",
            },
            tabBarIcon: ({ color, size }) => (
              <Cog6ToothIcon color={color} size={size} />
            ),
            title: "Settings",
            headerShown: false,
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabelStyle: {
              display: "none",
            },
            tabBarIcon: ({ color, size }) => (
              <UserCircleIcon color={color} size={size} />
            ),
            title: "profile",
            headerShown: false,

            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />
      </Tabs>
    </>
  );
}
