import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="otp" options={{}} />
      <Stack.Screen name="confirm-number" options={{}} />
      <Stack.Screen name="create-password" options={{}} />
      <Stack.Screen name="onboard" options={{}} />
    </Stack>
  );
}
