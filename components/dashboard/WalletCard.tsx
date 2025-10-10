
import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FundModal from "@/components/organism/fund-wallet-modal";
import { formatCurrency } from "@/lib/helpers";
import { router } from "expo-router";


// This implementation uses react-native-reanimated v2 for smooth native animations.
// If you don't have reanimated installed/configured, tell me and I'll provide a plain Animated API version.
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";

export default function WalletCard({
  balance,
  spent,
}: {
  balance: number;
  spent: number;
}) {
  const [open_fund, setOpen_fund] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // shared value 0 -> hidden, 1 -> visible
  const progress = useSharedValue(0);

  function toggleStats() {
    const next = !showStats;
    setShowStats(next);
    progress.value = withTiming(next ? 1 : 0, { duration: 300 });
  }

  const animatedStatsStyle = useAnimatedStyle(() => {
    // we'll interpolate height (or translateY) and opacity
    const height = interpolate(progress.value, [0, 1], [0, 40], Extrapolate.CLAMP);
    const translateY = interpolate(progress.value, [0, 1], [-8, 0], Extrapolate.CLAMP);
    const opacity = interpolate(progress.value, [0, 1], [0, 1], Extrapolate.CLAMP);

    return {
      height,
      transform: [{ translateY }],
      opacity,
    } as any;
  });

  return (
    <>
      <LinearGradient
        // colors={["#143428", "#B0E17C", "#1BAE6A"]}
        colors={["#0F2027", "#2C7744", "#A8E063"]}
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.topSection2}>
          <View style={styles.balanceContainer2}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <View
            className="bg-white bg-opacity-20 px-40" 
            style={styles.transactioncontainer}
            >

            
            <Pressable
              onPress={() => {
                router.push("/(dashboard)/transactions");
              }}
            >
              <Ionicons name="swap-horizontal" size={24} color="#22C55E" />

              {/* <Text style={styles.transactionHistory}>Transaction History</Text> */}
            </Pressable>
            </View>
            {/* <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text> */}
          </View>

          <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          

          <View style={styles.rightColumn}>
            {/* <Pressable
              onPress={() => {
                router.push("/(dashboard)/transactions");
              }}
            >
              <Text style={styles.transactionHistory}>Transaction History</Text>
            </Pressable> */}

            {/* <Pressable
              style={styles.fundButton}
              onPress={() => {
                setOpen_fund(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#22C55E" />
              <Text style={styles.fundButtonText}>Fund Wallet</Text>
            </Pressable> */}
          </View>

          {/* Center chevron toggle placed absolutely so it sits in the center of topSection */}

        </View>
        <View>
          <Pressable accessibilityLabel="toggle-stats" onPress={toggleStats} style={styles.centerToggle}>
            <Ionicons
              name={showStats ? "chevron-up" : "chevron-down"}
              size={24}
              color="#ffffff"
            />
          </Pressable>
        </View>

        {/* Animated stats container. It has overflow hidden so height animation clips content. */}
        <Animated.View style={[styles.statsContainer, animatedStatsStyle] as any}>
          {/* <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
            <Text style={styles.statLabel}>Earned</Text>
            <Text style={styles.statAmount}>{formatCurrency(balance)}</Text>
          </View> */}
          <Pressable
              style={styles.fundButton}
              onPress={() => {
                setOpen_fund(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#22C55E" />
              <Text style={styles.fundButtonText}>Fund Wallet</Text>
            </Pressable>
          <View style={styles.divider} />
          {/* <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={24} color="#ffffff" />
            <Text style={styles.statLabel}>Spent</Text>
            <Text style={styles.statAmount}>{formatCurrency(spent)}</Text>
          </View> */}
          <Pressable
              style={styles.fundButton}
              onPress={() => {
                // setOpen_fund(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#22C55E" />
              <Text style={styles.fundButtonText}>Transfer</Text>
            </Pressable>
        </Animated.View>
      </LinearGradient>

      <FundModal open={open_fund} setOpen={setOpen_fund} />
    </>
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
    alignItems: "flex-start",
    marginBottom: 12,
    // position relative so absolute center toggle is positioned correctly
    position: "relative",
  },
  balanceContainer: { flex: 1 },

  topSection2: {
    // flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    // position relative so absolute center toggle is positioned correctly
    position: "relative",
  },
  balanceContainer2: { 
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    // alignItems: "flex-end",
  },
  balanceLabel: { color: "#ffffff", fontSize: 16, opacity: 0.8 },
  balanceAmount: { color: "#ffffff", fontSize: 25, fontWeight: "bold", marginTop: 0 },
  rightColumn: { alignItems: "flex-end" },
  fundButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 5,
  },
  fundButtonText: { color: "#22C55E", fontWeight: "600", marginLeft: 4 },
  // center toggle (chevron) styling
  centerToggle: {
    position: "absolute",
    // alignSelf: "center",
    top: -15,
    padding: 6,
    borderRadius: 999,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "rgba(34, 197, 94, 0.4)",
    
    borderRadius: 12,
    marginTop:20,
    paddingHorizontal: 16,
    // we'll animate height on the Animated.View; ensure it clips
    overflow: "hidden",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  divider: { width: 1, backgroundColor: "#ffffff", opacity: 0.2 },
  statLabel: { color: "#ffffff", fontSize: 14, opacity: 0.8, marginTop: 4 },
  statAmount: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginTop: 2 },
  transactionHistory: { color: "#ffffff", fontSize: 16 },
  transactioncontainer:{
    paddingRight:10,
    paddingLeft:10,
    paddingVertical:3,
    borderRadius:12,
    backgroundColor:'white',
  }
});
