
import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAllTx, getCreditTx, getDebitTx } from "./services";
import advancedFormat from "dayjs/plugin/advancedFormat";
import StatusBadge from './statusbadge';
dayjs.extend(advancedFormat);

type TxType = "all" | "credits" | "debits";

interface TransactionSchema {
  _id: string;
  amount_kobo: number;
  createdAt: string;
  type: "credit" | "debit";
  status: string;
  reference: string;
  description: string;
}

const koboToUSD = (kobo: number): number => kobo / 100; // adjust conversion as needed

export default function TransactionsPage(): JSX.Element {
  const [activeTab, setActiveTab] = useState<TxType>("all");
  const listRef = useRef<FlatList<TransactionSchema>>(null);

  /** --- Fetch Transactions --- */
  const fetchTransactions = useCallback(async (): Promise<TransactionSchema[]> => {
    if (activeTab === "credits") return getCreditTx(1, 1000);
    if (activeTab === "debits") return getDebitTx(1, 1000);
    return getAllTx(1, 1000);
  }, [activeTab]);

  const { data, isLoading, isRefetching, refetch } = useQuery<TransactionSchema[]>({
    queryKey: ["transactions", activeTab],
    queryFn: fetchTransactions,
    staleTime: 60_000,
  });

  /** --- Scroll to top when tab changes --- */
  useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [activeTab]);

  /** --- Pull to refresh --- */
  const handleRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  /** --- Render item --- */
  const renderItem = useCallback(({ item }: { item: TransactionSchema }) => {
    const isCredit = item.type === "credit";
    const color = isCredit ? "#16A34A" : "#EF4444";
    const icon = isCredit ? "arrow-down" : "arrow-up";

    return (
      <View style={styles.card}>
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: color + "15" }]}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <View>
            <Text style={styles.name}>
              {item.description}
            </Text>
            {/* <Text style={styles.sub}>{item.status}</Text> */}
            <Text style={styles.date}>
            {/* {dayjs(item.createdAt).format("DD.MM.YYYY")} */}
            {dayjs(item.createdAt).format("MMM Do, h:mm:ss a")}

          </Text>
          </View>
        </View>

        <View style={styles.right}>
          <Text style={[styles.amount, { color }]}>
            {isCredit ? "+" : "-"}
            ₦{koboToUSD(item.amount_kobo).toLocaleString("en-US")} 
          </Text>
           {/* <Text style={styles.sub}>{item.status}</Text> */}
           <StatusBadge status={item.status} />
        </View>
      </View>
    );
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headercontainer}>
        <Pressable onPress={() => router.back()} style={{ padding: 10 ,marginLeft: 1}}>
          <Ionicons name="arrow-back" size={26} color="#111827" />
        </Pressable>
        <Text style={styles.header}>My Transactions</Text>

      </View>
      

      {/* --- Tabs --- */}
      <View style={styles.tabs}>
        {[
          { label: "All", value: "all" },
          { label: "Credit of funds", value: "credits" },
          { label: "Debit of funds", value: "debits" },
        ].map((t) => {
          const active = activeTab === t.value;
          return (
            <Pressable
              key={t.value}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(t.value as TxType)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* --- Transactions --- */}
      {isLoading ? (
        <ActivityIndicator size="small" color="#0F172A" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          ref={listRef}
          data={data || []}
          keyExtractor={(i) => i._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor="#0F172A"
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.empty}>No transactions found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  headercontainer:{
    flexDirection: "row",
    alignItems: "center",


  },
  header: {
    // textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 16,
    color: "#111827",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  tabActive: { backgroundColor: "#14342b" },
  tabText: { color: "#374151", fontWeight: "600", fontSize: 13 },
  tabTextActive: { color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  left: { flexDirection: "row", alignItems: "center" },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  name: { fontSize: 14, fontWeight: "600", color: "#111827" },
  sub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 15, fontWeight: "700" },
  date: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  empty: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 20,
  },
});
