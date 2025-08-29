

// TransactionsPage.tsx
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ListRenderItemInfo,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import {
  useInfiniteQuery,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { getAllTx, getCreditTx, getDebitTx } from "./services"; // <-- adjust path
import { formatCurrency } from "@/lib/helpers";
import EmptyTransaction from "@/components/molecules/empty-transaction";
import TaskLoadingSkeleton from "@/components/tasks/task-loading-skeleton";
import { TransactionSchema } from "../types"; // <-- adjust path
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

type TabType = "all" | "credits" | "debits" | "funded";
const LIMIT = 20;

// Page-level API response shape (what each page returns)
type Meta = { page: number; limit: number; total: number };
type PageData = { data: TransactionSchema[]; meta: Meta };

export default function TransactionsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const listRef = useRef<FlatList<any> | null>(null);
  const queryClient = useQueryClient();

  const typeParam =
    activeTab === "credits" ? "credit" : activeTab === "debits" ? "debit" : undefined;

  // fetcher expects pageParam number and returns PageData
  const fetchPage = useCallback(
    async ({
      pageParam = 1,
      queryKey,
      signal,
    }: {
      pageParam?: number;
      queryKey: [string, { type?: string }];
      signal?: AbortSignal;
    }): Promise<PageData> => {
      const q = queryKey?.[1] as { type?: string } | undefined;
      const t = q?.type ?? typeParam;
      const page = Number(pageParam) || 1;

      if (t === "credit") return getCreditTx(page, LIMIT);
      if (t === "debit") return getDebitTx(page, LIMIT);
      // console.log('RETURNED DATA', getAllTx(page, LIMIT));
      return getAllTx(page, LIMIT);
    },
    [typeParam]
  );

  // IMPORTANT: TQueryFnData = PageData, TData = InfiniteData<PageData>, pageParam type = number
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery<
    PageData,                 // TQueryFnData (what each page returns)
    Error,                    // TError
    InfiniteData<PageData>,   // TData (aggregate data — gives .pages)
    [string, { type?: string }], // TQueryKey
    number                    // TPageParam
  >({
    queryKey: ["transactions", { type: typeParam }],
    queryFn: ({ pageParam = 1, queryKey, signal }) =>
      fetchPage({ pageParam, queryKey: queryKey as any, signal }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
  if (!lastPage) return undefined;
  return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
},

    // getNextPageParam: (lastPage) => {
    //   const meta = lastPage?.meta;
    //   if (!meta) return undefined;
    //   const pages = Math.ceil((meta.total ?? 0) / (meta.limit ?? LIMIT));
    //   return meta.page < pages ? meta.page + 1 : undefined;
      
    // },
    staleTime: 30_000,
  });

  // console.log("DATA TXS", JSON.stringify(data, null, 2));


  // Now TypeScript knows `data` is InfiniteData<PageData> | undefined, so data.pages exists
  // const transactions = data?.pages?.flatMap((p) => p.data) ?? [];

  // Correct PageData type
type PageData = TransactionSchema[];

// Flatten properly
const transactions = data?.pages?.flatMap((p) => p) ?? [];


  // console.log('Transact', transactions);

  useEffect(() => {
    listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
  }, [activeTab]);

  const handleActionPress = (tx: any) => {
    setSelectedTransaction(tx);
    setShowActionSheet(true);
  };

  const renderTransactionCard = ({ item }: ListRenderItemInfo<TransactionSchema>) => {
    const createdAt = (item as any).createdAt || (item as any).created_at;
    const txColor =
      (item as any).type === "credit"
        ? "green"
        : (item as any).type === "debit"
        ? "red"
        : "#000";

    const status = String((item as any).status ?? "").toLowerCase();

    const statusStyles =
      status === "success"
        ? { color: "green", backgroundColor: "#d1fae5" } // light green bg
        : status === "failed"
        ? { color: "red", backgroundColor: "#fee2e2" } // light red bg
        : status === "pending"
        ? { color: "#d97706", backgroundColor: "#fef3c7" } // amber/orange
        : { color: "#000", backgroundColor: "#e5e7eb" }; // neutral gray

    const txType = String((item as any).type ?? "").toLowerCase();

    let iconName: keyof typeof Ionicons.glyphMap = "ellipse";
    let circleColor = "#d1d5db"; // default gray

    if (txType === "credit") {
      iconName = "arrow-up";
      circleColor = "#22c55e"; // green
    } else if (txType === "debit") {
      iconName = "arrow-down";
      circleColor = "#ef4444"; // red
    }


    const amountNaira =
      typeof (item as any).amount_kobo === "number"
        ? (item as any).amount_kobo / 100
        : undefined;

    return (
      <Animated.View entering={FadeIn.duration(300)} style={styles.card}>
        <Pressable
              onPress={() => router.push(`/transactions/${(item as any)._id}`)}
            >
        <View style={styles.cardHeader}>
          

          <View style={styles.amountContainer}>
            {/* <Text style={styles.amountLabel}>Amount</Text> */}
            {/* <Text style={styles.amountValue}>
              {amountNaira !== undefined ? formatCurrency(amountNaira) : "—"}
            </Text> */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View style={[styles.iconCircle, { backgroundColor: circleColor }]}>
              <Ionicons name={iconName} size={14} color="#fff" />
            </View>
          </View>
            <Text style={[styles.amountValue, { color: txColor }]}>
              {amountNaira !== undefined ? formatCurrency(amountNaira) : "—"}
            </Text>
          </View>
          <View>
            
            {/* <Text style={styles.reference} numberOfLines={1}>
              Ref: {(item as any).reference ?? "—"}
            </Text> */}
          </View>
          <Pressable
              style={styles.smallAction}
              onPress={() => handleActionPress(item)}
            >
              <Ionicons name="ellipsis-vertical" size={14} color="#22C55E" />
            </Pressable>
        </View>

        {(item as any).metadata?.note ? (
          <Text style={styles.note} numberOfLines={2}>
            {(item as any).metadata?.note}
          </Text>
        ) : null}

        {(item as any).metadata?.image && (
          <Image
            source={{ uri: (item as any).metadata.image }}
            style={styles.image}
            contentFit="cover"
          />
        )}

        <View style={styles.cardFooter}>
          <View style={styles.metaLeft}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.timeText}>
              {createdAt ? dayjs(createdAt).format("MMMM D, h:mm A") : "—"}
            </Text>
          </View>

          <View style={styles.actionsRow}>
            {/* <Pressable
              style={styles.viewButton}
              onPress={() => router.push(`/transactions/${(item as any)._id}`)}
            >
              <Text style={styles.viewButtonText}>View Details</Text>
            </Pressable> */}

            {/* <Pressable
              style={styles.smallAction}
              onPress={() => handleActionPress(item)}
            >
              <Ionicons name="ellipsis-vertical" size={18} color="#22C55E" />
            </Pressable> */}
            {/* <Text style={styles.txStatus}>
              {(item as any).status ? String((item as any).status): ""}
            </Text> */}

            <Text style={[styles.txStatus, statusStyles]}>
              {status ? status : ""}
            </Text>

          </View>
        </View>
        </Pressable>
      </Animated.View>
    );
  };

  const onRefresh = useCallback(async () => {
    await refetch();
    listRef.current?.scrollToOffset?.({ offset: 0, animated: true });
  }, [refetch]);

  const onEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Transaction History</Text>
      </View>

      <View style={styles.tabContainer}>
        {(["all", "credits", "debits", "funded"] as TabType[]).map((tab) => (
          <Pressable
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === "all"
                ? "All"
                : tab === "credits"
                ? "Credits"
                : tab === "debits"
                ? "Debits"
                : "Funded"}
            </Text>
          </Pressable>
        ))}
      </View>

      {isLoading ? (
        <TaskLoadingSkeleton />
      ) : transactions && transactions.length > 0 ? (
        <FlatList
          ref={listRef}
          data={transactions}
          keyExtractor={(item, idx) => String((item as any)._id ?? (item as any).id ?? idx)}
          renderItem={renderTransactionCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.5}
          refreshing={isRefetching}
          onRefresh={onRefresh}
          ListFooterComponent={() =>
            isFetchingNextPage ? <TaskLoadingSkeleton /> : null
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <EmptyTransaction />
          {/* <EmptyTaskState /> */}
        </View>
      )}

      {showActionSheet && selectedTransaction && (
        <Pressable
          style={styles.actionSheetOverlay}
          onPress={() => setShowActionSheet(false)}
        >
          <Animated.View entering={FadeIn.duration(200)} style={styles.actionSheet}>
            <View style={styles.actionSheetHeader}>
              <Text style={styles.actionSheetTitle}>Transaction Actions</Text>
              <Pressable onPress={() => setShowActionSheet(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </Pressable>
            </View>

            <Pressable
              style={styles.actionSheetButton}
              onPress={() => {
                const ref = selectedTransaction?.reference ?? "";
                // optionally copy to clipboard here
                setShowActionSheet(false);
              }}
            >
              <Ionicons name="copy-outline" size={20} color="#22C55E" />
              <Text style={styles.actionSheetButtonText}>Copy Reference</Text>
            </Pressable>

            <Pressable
              style={[styles.actionSheetButton, styles.dangerButton]}
              onPress={() => {
                setShowActionSheet(false);
                router.push(`/transactions/${selectedTransaction._id}/dispute`);
              }}
            >
              <Ionicons name="alert-circle-outline" size={20} color="#FF4444" />
              <Text style={[styles.actionSheetButtonText, styles.dangerText]}>
                Report / Dispute
              </Text>
            </Pressable>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

/* styles (same as before) */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: "700", color: "#000" },
  tabContainer: { flexDirection: "row", paddingHorizontal: 16, marginBottom: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, marginRight: 8, borderRadius: 20, backgroundColor: "#f0f0f0" },
  activeTab: { backgroundColor: "#22C55E" },
  tabText: { color: "#666", fontWeight: "600" },
  activeTabText: { color: "#fff" },
  listContainer: { paddingBottom: 100 },
  card: { backgroundColor: "#fff", borderRadius: 12, 
    marginHorizontal: 5, marginVertical: 2, 
    padding: 10, shadowColor: "#000", shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 0 },
  txType: { fontSize: 12, fontWeight: "700", color: "#000",  },
  // txStatus: { fontSize: 12, fontWeight: "700", color: "#000", backgroundColor: "ash"  },
  txStatus: {
  fontSize: 10,
  fontWeight: "500",
  paddingHorizontal: 6,
  paddingVertical: 5,
  borderRadius: 8,
  overflow: "hidden", // so background wraps text nicely
},

  reference: { fontSize: 12, color: "#666", marginTop:0 },
  amountContainer: {flexDirection: "row",  justifyContent: "space-between", alignItems: "center" },
  amountLabel: { fontSize: 12, color: "#22C55E" },
  amountValue: { fontSize: 16, fontWeight: "600"},
  note: { fontSize: 13, color: "#666", marginBottom: 8 },
  image: { width: "100%", height: 160, borderRadius: 8, marginBottom: 8 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  metaLeft: { flexDirection: "row", alignItems: "center" },
  timeText: { marginLeft: 6, fontSize: 12, color: "#999" },
  actionsRow: { flexDirection: "row", alignItems: "center" },
  viewButton: { backgroundColor: "#22C55E", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  viewButtonText: { color: "#fff", fontWeight: "700" },
  smallAction: { marginLeft: 8, 
    // padding: 8, 
    // borderRadius: 8, backgroundColor: "#f0fdf4"
   },
  emptyState: { marginTop: 50, alignItems: "center" },
  actionSheetOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  actionSheet: { backgroundColor: "#fff", borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16 },
  actionSheetHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  actionSheetTitle: { fontSize: 18, fontWeight: "700", color: "#000" },
  actionSheetButton: { flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: "#f0fdf4" },
  actionSheetButtonText: { marginLeft: 12, fontSize: 16, color: "#22C55E", fontWeight: "600" },
  dangerButton: { backgroundColor: "#FFF5F5" },
  dangerText: { color: "#FF4444" },
  iconCircle: {
  width: 28,
  height: 28,
  borderRadius: 14,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 8,
},

});
