import React, { useEffect, useRef } from 'react';
import Colors from "@/constants/Colors";
import { View, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function WalletCardSkeleton() {
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={Colors.brand.gradient}
      style={styles.container}
        locations={Colors.brand.gradientLocations as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
    >
      <Animated.View style={{ opacity: opacityAnim }}>
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
