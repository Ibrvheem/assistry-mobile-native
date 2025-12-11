import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { transferApi } from '@/utils/transferApi';
import { ChevronLeft } from 'lucide-react-native';

export default function TransferVerify() {
  const { accountNumber, bankCode, bankName } = useLocalSearchParams<{ accountNumber: string; bankCode: string; bankName: string }>();
  const [loading, setLoading] = useState(true);
  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    verify();
  }, []);

  const verify = async () => {
    try {
      const data = await transferApi.verifyAccount(accountNumber, bankCode);
      setAccountName(data.account_name);
    } catch (e) {
      setError('Could not verify account');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    router.push({
      pathname: '/(transfer)/TransferAmount',
      params: { accountNumber, bankCode, bankName, accountName },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Verify Recipient</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#22C55E" />
        ) : error ? (
          <View>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={verify}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{accountName.charAt(0)}</Text>
            </View>
            <Text style={styles.name}>{accountName}</Text>
            <Text style={styles.details}>{bankName} - {accountNumber}</Text>

            <TouchableOpacity style={styles.button} onPress={handleConfirm}>
              <Text style={styles.buttonText}>Confirm Recipient</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20, alignItems: 'center', justifyContent: 'center', flex: 1 },
  card: { alignItems: 'center', width: '100%' },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#22C55E' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  details: { fontSize: 16, color: '#666', marginBottom: 32 },
  button: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: 'red', fontSize: 16, marginBottom: 16 },
  retryButton: { padding: 10 },
  retryText: { color: '#22C55E', fontWeight: 'bold' },
});
