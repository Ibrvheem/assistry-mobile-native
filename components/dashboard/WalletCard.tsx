
import React, { useState, useRef } from "react";
import { View, Text, Pressable, StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import FundModal from "@/components/organism/fund-wallet-modal";
import { formatCurrency, formatCurrency1 } from "@/lib/helpers";
import { router } from "expo-router";

export default function WalletCard({
  balance,
  spent,
}: {
  balance: number;
  spent: number;
}) {
  const [open_fund, setOpen_fund] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Animated value 0 -> hidden, 1 -> visible
  const progress = useRef(new Animated.Value(0)).current;

  function toggleStats() {
    const next = !showStats;
    setShowStats(next);
    Animated.timing(progress, {
      toValue: next ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // height and other layout properties cannot use native driver
    }).start();
  }

  const height = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
    extrapolate: 'clamp',
  });

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
    extrapolate: 'clamp',
  });

  const opacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <>
      <LinearGradient
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
            </Pressable>
            </View>
          </View>

          <Text style={styles.balanceAmount}>{formatCurrency1(balance)}</Text>
          

          <View style={styles.rightColumn}>
          </View>

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

        {/* Animated stats container */}
        <Animated.View style={[styles.statsContainer, { height, opacity, transform: [{ translateY }] }]}>
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
    position: "relative",
  },
  balanceContainer: { flex: 1 },

  topSection2: {
    alignItems: "flex-start",
    marginBottom: 12,
    position: "relative",
  },
  balanceContainer2: { 
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
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
  centerToggle: {
    position: "absolute",
    top: -15,
    padding: 6,
    borderRadius: 999,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 12,
    marginTop:20,
    paddingHorizontal: 16,
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
