import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const SkeletonPlaceholder = () => {
  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.skeletonCard}>
      <View style={styles.skeletonHeader}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonIncentive} />
      </View>
      <View style={styles.skeletonDescription} />
      {/* <View style={styles.skeletonImage} /> */}
      <View style={styles.skeletonFooter}>
        <View style={styles.skeletonLocation} />
        <View style={styles.skeletonButton} />
      </View>
    </Animated.View>
  );
};

export default function TaskLoadingSkeleton() {
  return (
    <View>
      {/* <View style={styles.skeletonCard}>
        <View style={styles.skeletonTitle} />
      </View> */}

      {[...Array(3)].map((_, index) => (
        <SkeletonPlaceholder key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16,
    margin: 16,
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skeletonTitle: {
    width: "50%",
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  skeletonIncentive: {
    width: 80,
    height: 20,
    backgroundColor: "#ddd",
    borderRadius: 8,
  },
  skeletonDescription: {
    width: "100%",
    height: 14,
    backgroundColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#ddd",
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  skeletonLocation: {
    width: 100,
    height: 16,
    backgroundColor: "#ddd",
    borderRadius: 6,
  },
  skeletonButton: {
    width: 100,
    height: 30,
    backgroundColor: "#ddd",
    borderRadius: 12,
  },
});
