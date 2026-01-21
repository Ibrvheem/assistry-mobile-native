import React, { useEffect, useRef } from "react";
import Colors from "@/constants/Colors";
import { View, StyleSheet, Animated } from "react-native";
import { useColorScheme } from "@/components/useColorScheme";

const SkeletonPlaceholder = () => {
   const fadeAnim = useRef(new Animated.Value(0)).current;
   const colorScheme = useColorScheme();
   // We might want specific skeleton colors or derive them
   const isDark = colorScheme === 'dark';
   
   // Derived skeleton colors
   const cardBg = isDark ? "#1A1A1A" : "#FFFFFF";
   const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";
   const boneColor = isDark ? "#333333" : "#E0E0E0";

   useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
   }, []);

  return (
    <Animated.View style={[styles.skeletonCard, { opacity: fadeAnim, backgroundColor: cardBg, borderColor }]}>
      <View style={styles.skeletonHeader}>
        <View style={[styles.skeletonTitle, { backgroundColor: boneColor }]} />
        <View style={[styles.skeletonIncentive, { backgroundColor: boneColor }]} />
      </View>
      <View style={[styles.skeletonDescription, { backgroundColor: boneColor }]} />
      {/* <View style={styles.skeletonImage} /> */}
      <View style={styles.skeletonFooter}>
        <View style={[styles.skeletonLocation, { backgroundColor: boneColor }]} />
        <View style={[styles.skeletonButton, { backgroundColor: boneColor }]} />
      </View>
    </Animated.View>
  );
};

export default function TaskLoadingSkeleton() {
  return (
    <View>
      {[...Array(3)].map((_, index) => (
        <SkeletonPlaceholder key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonCard: {
    borderRadius: 16,
    margin: 16,
    padding: 16,
    borderWidth: 1,
  },
  skeletonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  skeletonTitle: {
    width: "50%",
    height: 20,
    borderRadius: 8,
  },
  skeletonIncentive: {
    width: 80,
    height: 20,
    borderRadius: 8,
  },
  skeletonDescription: {
    width: "100%",
    height: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  skeletonImage: {
    width: "100%",
    height: 200,
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
    borderRadius: 6,
  },
  skeletonButton: {
    width: 100,
    height: 30,
    borderRadius: 12,
  },
});
