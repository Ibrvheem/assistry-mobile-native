
// app/(dashboard)/index.tsx
import React, { useCallback, useState, useEffect } from 'react';
import {
  RefreshControl,
  ScrollView,
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { PlusCircle } from 'lucide-react-native';
import dayjs from 'dayjs';

import WalletCard from '@/components/dashboard/WalletCard';
import WalletCardSkeleton from '@/components/dashboard/wallet-card-skeleton';
import CreateTaskModal from '@/components/organism/create-task-modal';
import TaskCard from '@/components/dashboard/TaskCard';
import TaskLoadingSkeleton from '@/components/tasks/task-loading-skeleton';
import EmptyTaskState from '@/components/molecules/empty-task-state';

import { getWallet, getForYou } from './services';
import { TaskSchema } from './types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MyAvatar } from '../myavatar';
import { BellDot } from 'lucide-react-native';

// ----------------------------------------
// Component
// ----------------------------------------
export default function Index(): JSX.Element {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ----------------------------------------
  // Queries
  // ----------------------------------------
  const {
    data: walletData,
    isLoading: isWalletLoading,
    refetch: refetchWallet,
  } = useQuery({
    queryKey: ['wallet'],
    queryFn: getWallet,
    staleTime: 5000,
    retry: 1,
  });

  const {
    data: tasksData,
    isLoading: isTasksLoading,
  } = useQuery({
    queryKey: ['for-you'],
    queryFn: getForYou,
    staleTime: 60 * 1000,
    retry: 1,
  });

  // ----------------------------------------
  // Refresh Handler
  // ----------------------------------------
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchWallet(),
        queryClient.invalidateQueries({ queryKey: ['for-you'] }),
      ]);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, [queryClient, refetchWallet]);

  // ----------------------------------------
  // Computed Values
  // ----------------------------------------
  const balance = walletData?.data?.balance_kobo ?? 0;
  const spent = walletData?.data?.spent ?? 0;



  // ----------------------------------------
  // Render
  // ----------------------------------------
  return (
    <View style={styles.container}>

      <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <MyAvatar showGreeting={true} />
        <BellDot color={Colors.brand.text} />
      </View>
      {/* Wallet Section */}
      {isWalletLoading ? (
        <WalletCardSkeleton />
      ) : (
        <WalletCard balance={balance} spent={spent} />
      )}

      {/* Task Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Campus Tasks</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {/* <Pressable style={styles.transferButton} onPress={() => router.push('/(transfer)/TransferStart')}>
              <Text style={styles.transferButtonText}>Transfer</Text>
            </Pressable> */}
            <Pressable style={styles.postButton} onPress={() => setModalOpen(true)}>
              <PlusCircle size={20} color={Colors.brand.darkGreen} />
              <Text style={styles.postButtonText}>Post Task</Text>
            </Pressable>
          </View>
        </View>

        {/* Modal */}
        <CreateTaskModal open={isModalOpen} setOpen={setModalOpen} />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          {isTasksLoading ? (
            <TaskLoadingSkeleton />
          ) : tasksData?.length ? (
            tasksData.map((task: TaskSchema) => (
              <TaskCard
                key={task._id}
                title={task.task}
                description={task.description ?? ''}
                incentive={task.incentive}
                location={task.location ?? 'Coke Village'}
                postedBy={task.user?.first_name ?? 'You'}
                postedAt={dayjs(task.created_at).format('MMMM D, h:mm A')}
                views={String(task.views ?? 0)}
                imageUrl={
                  task.assets?.[0]?.url ??
                  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'
                }
                onPress={() =>
                  router.push({ pathname: '/tasks/[id]', params: { id: task._id } })
                }
              />
            ))
          ) : (
            <EmptyTaskState />
          )}
        </ScrollView>
      </View>
      </SafeAreaView>
    </View>
  );
}

// ----------------------------------------
// Styles
// ----------------------------------------
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 5,
    // borderBottomWidth: 1,          // 👈 Adds the underline
    // borderBottomColor: '#e0e0e0',  // 👈 Divider color (light gray)
  },
  container: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  safeArea: {
    flex: 1,
  },
  sectionContainer: {
    // flex: 1,
    marginTop: 24,
    paddingBottom: 180,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
    
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.brand.text,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  postButtonText: {
    color: Colors.brand.darkGreen,
    marginLeft: 4,
    fontWeight: '600',
  },
  transferButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    justifyContent: 'center',
  },
  transferButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scrollContainer: {
    // flexGrow: 1,
    paddingBottom: 50,
    
    
  },
});
