import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Stack, Tabs } from "expo-router";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import { Modal, View, Text, TouchableOpacity } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

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
            title: "Home",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="home" color={"gray"} />
            ),
            headerShown: false,
            headerStyle: {
              backgroundColor: "white",
            },
          }}
        />

        <Tabs.Screen
          name="two"
          options={{
            title: "Tab Two",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
