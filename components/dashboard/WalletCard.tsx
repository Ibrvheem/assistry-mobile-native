import { View, Text, StyleSheet, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "@/lib/helpers";

export default function WalletCard({
  balance,
  spent,
}: {
  balance: number;
  spent: number;
}) {
  return (
    <LinearGradient
      colors={["#007AFF", "#00C6FF"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.topSection}>
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            {formatCurrency(balance * 100)}
          </Text>
        </View>
        <Pressable
          style={styles.fundButton}
          onPress={() => console.log("Fund wallet")}
        >
          <Ionicons name="add-circle" size={20} color="#007AFF" />
          <Text style={styles.fundButtonText}>Fund Wallet</Text>
        </Pressable>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons name="arrow-up-circle" size={24} color="#ffffff" />
          <Text style={styles.statLabel}>Earned</Text>
          <Text style={styles.statAmount}>{formatCurrency(balance * 100)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.statItem}>
          <Ionicons name="arrow-down-circle" size={24} color="#ffffff" />
          <Text style={styles.statLabel}>Spent</Text>
          <Text style={styles.statAmount}>{formatCurrency(spent * 100)}</Text>
        </View>
      </View>
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
    alignItems: "flex-start",
    marginBottom: 20,
  },
  balanceContainer: {
    flex: 1,
  },
  balanceLabel: {
    color: "#ffffff",
    fontSize: 16,
    opacity: 0.8,
  },
  balanceAmount: {
    color: "#ffffff",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 4,
  },
  fundButton: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fundButtonText: {
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 4,
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
  statLabel: {
    color: "#ffffff",
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  statAmount: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 2,
  },
});
