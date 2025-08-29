// // import { View, Text, StyleSheet, Pressable } from "react-native";
// // import { LinearGradient } from "expo-linear-gradient";
// // import { Ionicons } from "@expo/vector-icons";
// // import FundModal from "@/components/organism/fund-wallet-modal";
// // import { formatCurrency } from "@/lib/helpers";
// // import { useState } from "react";
// // // const [open_fund, setOpen_fund] = useState(false);
// // export default function WalletCard({
// //   balance,
// //   spent,
// // }: {
// //   balance: number;
// //   spent: number;
// // }) {
// //   const [open_fund, setOpen_fund] = useState(false);
// //     // <LinearGradient
// //   return (
    
// //     //   colors={["#22C55E", "#4ADE80"]}
// //     //   style={styles.container}
// //     //   start={{ x: 0, y: 0 }}
// //     //   end={{ x: 1, y: 1 }}
// //     // >
// // <LinearGradient
// //   colors={["#22C55E", "#34D399", "#BEEAD5", "#F8FAFF"]}
// //   locations={[0, 0.35, 0.7, 1]}
// //   start={{ x: 0, y: 0 }}
// //   end={{ x: 1, y: 1 }}
// //   style={styles.container}
// // >

// //       <View style={styles.topSection}>
// //         <View style={styles.balanceContainer}>
// //           <Text style={styles.balanceLabel}>Current Balance</Text>
// //           <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
// //         </View>
// //         <View>
// //           <Text style={styles.transactionHistory}>Transaction History</Text>
// //           <Pressable
// //           style={styles.fundButton}
// //           onPress={() => {
// //                       setOpen_fund(true);
// //                     }}
// //         >
// //           <Ionicons name="add-circle" size={20} color="#22C55E" />
// //           <Text style={styles.fundButtonText}>Fund Wallet</Text>
// //         </Pressable>
// //         <FundModal open={open_fund} setOpen={setOpen_fund} />

// //         </View>
        
// //       </View>
// //       <View style={styles.statsContainer}>
// //         <View style={styles.statItem}>
// //           <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
// //           <Text style={styles.statLabel}>Earned</Text>
// //           <Text style={styles.statAmount}>{formatCurrency(balance)}</Text>
// //         </View>
// //         <View style={styles.divider} />
// //         <View style={styles.statItem}>
// //           <Ionicons name="arrow-down-circle" size={24} color="#ffffff" />
// //           <Text style={styles.statLabel}>Spent</Text>
// //           <Text style={styles.statAmount}>{formatCurrency(spent)}</Text>
// //         </View>
// //       </View>
// //     </LinearGradient>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     borderRadius: 20,
// //     padding: 20,
// //     marginHorizontal: 16,
// //     marginVertical: 8,
// //   },
// //   topSection: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginBottom: 20,
// //   },
// //   balanceContainer: {
// //     flex: 1,
// //   },
// //   balanceLabel: {
// //     color: "#ffffff",
// //     fontSize: 16,
// //     opacity: 0.8,
// //   },
// //   balanceAmount: {
// //     color: "#ffffff",
// //     fontSize: 32,
// //     fontWeight: "bold",
// //     marginTop: 4,
// //   },
// //   fundButton: {
// //     backgroundColor: "#ffffff",
// //     borderRadius: 12,
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     flexDirection: "row",
// //     alignItems: "center",
// //     shadowColor: "#000",
// //     shadowOffset: {
// //       width: 0,
// //       height: 2,
// //     },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 3.84,
// //     elevation: 5,
// //     marginTop: 5,
// //   },
// //   fundButtonText: {
// //     color: "#22C55E",
// //     fontWeight: "600",
// //     marginLeft: 4,
// //   },
// //   statsContainer: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     backgroundColor: "rgba(34, 197, 94, 0.4)",
// //     borderRadius: 12,
// //     padding: 16,
// //   },
// //   statItem: {
// //     flex: 1,
// //     alignItems: "center",
// //   },
// //   divider: {
// //     width: 1,
// //     backgroundColor: "#ffffff",
// //     opacity: 0.2,
// //   },
// //   statLabel: {
// //     color: "#ffffff",
// //     fontSize: 14,
// //     opacity: 0.8,
// //     marginTop: 4,
// //   },
// //   statAmount: {
// //     color: "#ffffff",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     marginTop: 2,
// //   },
// //   transactionHistory:{
// //     color: "#ffffff",
// //     fontSize: 16,
// //   }
// // });


// // app/components/dashboard/WalletCard.tsx
// import React, { useState } from "react";
// import { View, Text, Pressable, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons } from "@expo/vector-icons";
// import FundModal from "@/components/organism/fund-wallet-modal";
// import { formatCurrency } from "@/lib/helpers";
// import { router } from "expo-router";

// export default function WalletCard({ balance, spent }: { balance: number; spent: number; }) {
//   const [open_fund, setOpen_fund] = useState(false);

//   return (
//     <>
//       <LinearGradient
//         colors={["#22C55E", "#34D399", "#BEEAD5", "#F8FAFF"]}
//         locations={[0, 0.35, 0.7, 1]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.container}
//       >
//         <View style={styles.topSection}>
//           <View style={styles.balanceContainer}>
//             <Text style={styles.balanceLabel}>Current Balance</Text>
//             <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
//           </View>
//           <View>
//             <Pressable
//                           onPress={() => {
//                                               router.push("/(dashboard)/transactions");
//                                             }}
//                         >
//                           <Text style={styles.transactionHistory}>Transaction History</Text>
//                         </Pressable>
            
//             <Pressable
//               style={styles.fundButton}
//               onPress={() => {
//                 setOpen_fund(true);
//               }}
//             >
//               <Ionicons name="add-circle" size={20} color="#22C55E" />
//               <Text style={styles.fundButtonText}>Fund Wallet</Text>
//             </Pressable>
//           </View>
//         </View>

//         <View style={styles.statsContainer}>
//           <View style={styles.statItem}>
//             <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
//             <Text style={styles.statLabel}>Earned</Text>
//             <Text style={styles.statAmount}>{formatCurrency(balance)}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.statItem}>
//             <Ionicons name="arrow-down-circle" size={24} color="#ffffff" />
//             <Text style={styles.statLabel}>Spent</Text>
//             <Text style={styles.statAmount}>{formatCurrency(spent)}</Text>
//           </View>
//         </View>
//       </LinearGradient>

//       <FundModal open={open_fund} setOpen={setOpen_fund} />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     borderRadius: 20,
//     padding: 20,
//     marginHorizontal: 16,
//     marginVertical: 8,
//   },
//   topSection: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 20,
//   },
//   balanceContainer: { flex: 1 },
//   balanceLabel: { color: "#ffffff", fontSize: 16, opacity: 0.8 },
//   balanceAmount: { color: "#ffffff", fontSize: 32, fontWeight: "bold", marginTop: 4 },
//   fundButton: {
//     backgroundColor: "#ffffff",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3.84,
//     elevation: 5,
//     marginTop: 5,
//   },
//   fundButtonText: { color: "#22C55E", fontWeight: "600", marginLeft: 4 },
//   statsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     backgroundColor: "rgba(34, 197, 94, 0.4)",
//     borderRadius: 12,
//     padding: 16,
//   },
//   statItem: { flex: 1, alignItems: "center" },
//   divider: { width: 1, backgroundColor: "#ffffff", opacity: 0.2 },
//   statLabel: { color: "#ffffff", fontSize: 14, opacity: 0.8, marginTop: 4 },
//   statAmount: { color: "#ffffff", fontSize: 16, fontWeight: "bold", marginTop: 2 },
//   transactionHistory: { color: "#ffffff", fontSize: 16 },
// });





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
    const height = interpolate(progress.value, [0, 1], [0, 84], Extrapolate.CLAMP);
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
        colors={["#22C55E", "#34D399", "#BEEAD5", "#F8FAFF"]}
        locations={[0, 0.35, 0.7, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        <View style={styles.topSection}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
          </View>

          <View style={styles.rightColumn}>
            <Pressable
              onPress={() => {
                router.push("/(dashboard)/transactions");
              }}
            >
              <Text style={styles.transactionHistory}>Transaction History</Text>
            </Pressable>

            <Pressable
              style={styles.fundButton}
              onPress={() => {
                setOpen_fund(true);
              }}
            >
              <Ionicons name="add-circle" size={20} color="#22C55E" />
              <Text style={styles.fundButtonText}>Fund Wallet</Text>
            </Pressable>
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
          <View style={styles.statItem}>
            <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
            <Text style={styles.statLabel}>Earned</Text>
            <Text style={styles.statAmount}>{formatCurrency(balance)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Ionicons name="arrow-down-circle" size={24} color="#ffffff" />
            <Text style={styles.statLabel}>Spent</Text>
            <Text style={styles.statAmount}>{formatCurrency(spent)}</Text>
          </View>
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
  balanceLabel: { color: "#ffffff", fontSize: 16, opacity: 0.8 },
  balanceAmount: { color: "#ffffff", fontSize: 32, fontWeight: "bold", marginTop: 4 },
  rightColumn: { alignItems: "flex-end" },
  fundButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    backgroundColor: "rgba(34, 197, 94, 0.4)",
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
});
