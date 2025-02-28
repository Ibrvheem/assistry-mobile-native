import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import LinearGradient from "react-native-linear-gradient";

const ShimmerPlaceholder = ({ style }: { style: any }) => {
  const shimmerValue = useSharedValue(0);

  shimmerValue.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      shimmerValue.value,
      [0, 1],
      ["#E0E0E0", "#F5F5F5"]
    ),
  }));

  return <Animated.View style={[style, animatedStyle]} />;
};

const TaskDetailsSkeleton = () => {
  return (
    <ScrollView>
      {/* Task Image */}
      <ShimmerPlaceholder style={styles.imagePlaceholder} />
      <View style={styles.container}>
        <ShimmerPlaceholder style={styles.title} />

        {/* User Info */}
        <View style={styles.userContainer}>
          <ShimmerPlaceholder style={styles.avatar} />
          <View>
            <ShimmerPlaceholder style={styles.userName} />
            <ShimmerPlaceholder style={styles.userDetail} />
          </View>
        </View>

        {/* Location */}
        <ShimmerPlaceholder style={styles.location} />

        {/* Description */}
        <ShimmerPlaceholder style={styles.description} />
        <ShimmerPlaceholder style={styles.description} />
        <ShimmerPlaceholder style={styles.description} />
        <ShimmerPlaceholder style={styles.description} />
        <ShimmerPlaceholder style={styles.description} />
        <ShimmerPlaceholder style={styles.description} />

        {/* Additional Photos */}
        <View style={styles.photosContainer}>
          <ShimmerPlaceholder style={styles.photo} />
          <ShimmerPlaceholder style={styles.photo} />
          <ShimmerPlaceholder style={styles.photo} />
        </View>
        <View style={styles.photosContainer}>
          <ShimmerPlaceholder style={styles.button} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  imagePlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 8,
  },
  title: {
    width: "60%",
    height: 20,
    borderRadius: 4,
    marginVertical: 12,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    width: 100,
    height: 15,
    borderRadius: 4,
  },
  userDetail: {
    width: 80,
    height: 10,
    borderRadius: 4,
    marginTop: 4,
  },
  location: {
    width: "50%",
    height: 15,
    borderRadius: 4,
    marginBottom: 16,
  },
  description: {
    width: "100%",
    height: 14,
    borderRadius: 4,
    marginBottom: 8,
  },
  photosContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  photo: {
    width: 180,
    height: 150,
    borderRadius: 8,
    marginRight: 8,
  },
  button: {
    width: "100%",
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default TaskDetailsSkeleton;
