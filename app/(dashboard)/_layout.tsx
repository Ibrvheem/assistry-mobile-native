
// app/(dashboard)/_layout.tsx
import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { Stack, usePathname } from "expo-router";
import CustomTabBar from "../../components/CustomTabBar";

export default function DashboardLayout() {
  const pathname = usePathname();

  // hide only when route matches /messages/[something] or /tasks/[something]
  const hideTabBar =
    /^\/messages\/[^/]+$/.test(pathname) || /^\/tasks\/[^/]+$/.test(pathname);

  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: hideTabBar ? 100 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: hideTabBar ? 0 : 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hideTabBar]);

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />

      <Animated.View
        style={[
          styles.tabWrapper,
          {
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <CustomTabBar />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
