import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
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
  const shimmerAnim = useSharedValue(0);

  React.useEffect(() => {
    shimmerAnim.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: shimmerAnim.value,
  }));

  return (
    <Animated.View
      style={[styles.skeleton, { width, height }, animatedStyle, style]}
    >
      <LinearGradient
        colors={["#e0e0e0", "#f5f5f5", "#e0e0e0"]}
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
    backgroundColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  walletCardSkeleton: {
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
  },
  taskCardSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 12,
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
