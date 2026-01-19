import React, { useEffect, useState } from 'react';
import Colors from "@/constants/Colors";
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { transferApi } from '@/utils/transferApi';
import { useQueuedTransfers } from '@/hooks/useQueuedTransfers';

export default function TransferProcessing() {
  const params = useLocalSearchParams();
  const { addToQueue } = useQueuedTransfers();
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    processTransfer();
  }, []);

  const processTransfer = async () => {
    const payload = {
      idempotencyKey: Math.random().toString(36).substring(7),
      amount: parseFloat(params.amount as string),
      beneficiary: params.accountName as string,
      reference: 'Transfer to ' + params.accountName,
      bankCode: params.bankCode as string,
      accountNumber: params.accountNumber as string,
    };

    try {
      const result = await transferApi.initiateTransfer(payload);
      
      if (result.status === 'success') {
        router.replace({
          pathname: '/(transfer)/TransferReceipt',
          params: { ...params, ...result },
        });
      } else {
        setStatus('Failed: ' + result.message);
        // Handle failure UI
      }
    } catch (e) {
      // Network Error -> Queue it
      await addToQueue(payload);
      router.replace({
        pathname: '/(transfer)/TransferReceipt',
        params: { ...params, status: 'queued', message: 'Network error. Transfer queued.' },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" color={Colors.brand.primary} />
      <Text style={styles.text}>{status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.background, justifyContent: 'center', alignItems: 'center' },
  text: { marginTop: 20, fontSize: 18, fontWeight: '600', color: Colors.brand.text },
});
