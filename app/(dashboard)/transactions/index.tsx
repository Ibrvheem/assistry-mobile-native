
import React, { useState, useCallback, useEffect, useRef } from "react";
import Colors from "@/constants/Colors";
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
import { useColorScheme } from "@/components/useColorScheme";

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
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

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
      <View style={[styles.card, { 
          backgroundColor: themeColors.surface,
          borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
      }]}>
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: color + "15" }]}>
            <Ionicons name={icon} size={16} color={color} />
          </View>
          <View>
            <Text style={[styles.name, { color: themeColors.text }]}>
              {item.description}
            </Text>
            {/* <Text style={styles.sub}>{item.status}</Text> */}
            <Text style={[styles.date, { color: themeColors.textMuted }]}>
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
  }, [themeColors, isDark]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.headercontainer}>
        <Pressable onPress={() => router.back()} style={{ padding: 10 ,marginLeft: 1}}>
          <Ionicons name="arrow-back" size={26} color={themeColors.text} />
        </Pressable>
        <Text style={[styles.header, { color: themeColors.text }]}>My Transactions</Text>

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
              style={[
                  styles.tab, 
                  active ? { backgroundColor: themeColors.primary, borderColor: themeColors.primary } : { backgroundColor: themeColors.surface, borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
              ]}
              onPress={() => setActiveTab(t.value as TxType)}
            >
              <Text style={[styles.tabText, active ? { color: Colors.brand.darkGreen } : { color: themeColors.textMuted }]}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* --- Transactions --- */}
      {isLoading ? (
        <ActivityIndicator size="small" color={themeColors.primary} style={{ marginTop: 20 }} />
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
              tintColor={themeColors.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: themeColors.textMuted }]}>No transactions found.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1 },
  headercontainer:{
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    // textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 16,
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
    borderWidth: 1,
  },
  activeTab: { },
  tabText: { fontWeight: "600", fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    // shadowColor: "#000",
    // shadowOpacity: 0.05,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 3,
    // elevation: 2,
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
  name: { fontSize: 14, fontWeight: "600" },
  sub: { fontSize: 12, marginTop: 2 },
  right: { alignItems: "flex-end" },
  amount: { fontSize: 15, fontWeight: "700" },
  date: { fontSize: 12, marginTop: 2 },
  empty: {
    textAlign: "center",
    fontSize: 13,
    marginTop: 20,
  },
});
