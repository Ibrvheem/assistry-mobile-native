import React, { useEffect, useRef } from "react";
import Colors from "@/constants/Colors";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SkeletonLoader = ({
  width,
  height,
  style,
}: {
  width: number;
  height: number;
  style?: any;
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[styles.skeleton, { width, height, opacity: opacityAnim }, style]}
    >
      <LinearGradient
        colors={["#333333", "#444444", "#333333"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { width, height }]}
      />
    </Animated.View>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <View style={styles.taskCardSkeleton}>
      <SkeletonLoader width={80} height={80} style={styles.imagePlaceholder} />
      {/* <View style={styles.textContainer}>
        <SkeletonLoader width={160} height={20} style={styles.marginBottom} />
        <SkeletonLoader width={120} height={15} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#333333",
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  walletCardSkeleton: {
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  taskCardSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  imagePlaceholder: {
    borderRadius: 12,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  marginBottom: {
    marginBottom: 8,
  },
});
