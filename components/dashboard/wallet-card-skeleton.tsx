import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function WalletCardSkeleton() {
  return (
    <LinearGradient
      // colors={["#22C55E", "#4ADE80"]}
      // style={styles.container}
      // start={{ x: 0, y: 0 }}
      // end={{ x: 1, y: 1 }}

      colors={["#0F2027", "#2C7744", "#A8E063"]}
      style={styles.container}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
    >
      <Animated.View entering={FadeIn} exiting={FadeOut}>
        <View style={styles.topSection}>
          <View style={styles.skeletonBalance} />
          <View style={styles.skeletonButton} />
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            {/* <View style={styles.skeletonStatIcon} /> */}
            {/* <View style={styles.skeletonStatLabel} /> */}
            <View style={styles.skeletonStatAmount} />
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            {/* <View style={styles.skeletonStatIcon} /> */}
            {/* <View style={styles.skeletonStatLabel} /> */}
            <View style={styles.skeletonStatAmount} />
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  topSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  skeletonBalance: {
    width: 120,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 8,
  },
  skeletonButton: {
    width: 100,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  divider: {
    width: 1,
    backgroundColor: "#ffffff",
    opacity: 0.2,
  },
  skeletonStatIcon: {
    width: 24,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    marginBottom: 4,
  },
  skeletonStatLabel: {
    width: 60,
    height: 14,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 4,
    marginBottom: 4,
  },
  skeletonStatAmount: {
    width: 80,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
  },
});
