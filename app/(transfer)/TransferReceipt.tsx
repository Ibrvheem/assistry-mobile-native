import React, { useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Share2, Download, X } from 'lucide-react-native';
import { receiptGenerator } from '@/services/receiptGenerator';
import ViewShot from 'react-native-view-shot';

export default function TransferReceipt() {
  const params = useLocalSearchParams();
  const viewShotRef = useRef(null);

  const handleShare = () => {
    receiptGenerator.captureAndShare(viewShotRef);
  };

  const handleClose = () => {
    router.dismissAll();
    router.replace('/(dashboard)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.receipt}>
            <View style={styles.iconContainer}>
            <CheckCircle size={64} color="#22C55E" />
            </View>
            <Text style={styles.status}>{params.status === 'queued' ? 'Transfer Queued' : 'Transfer Successful'}</Text>
            <Text style={styles.amount}>₦{params.amount}</Text>
            
            <View style={styles.divider} />
            
            <View style={styles.row}>
                <Text style={styles.label}>Beneficiary</Text>
                <Text style={styles.value}>{params.accountName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Bank</Text>
                <Text style={styles.value}>{params.bankName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Account</Text>
                <Text style={styles.value}>{params.accountNumber}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{new Date().toLocaleString()}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Reference</Text>
                <Text style={styles.value}>{params.transaction_id || 'PENDING'}</Text>
            </View>
        </ViewShot>

        <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
                <Share2 size={20} color="#333" />
                <Text style={styles.actionText}>Share Receipt</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 16, alignItems: 'flex-end' },
  content: { padding: 20, alignItems: 'center' },
  receipt: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  iconContainer: { marginBottom: 16 },
  status: { fontSize: 20, fontWeight: 'bold', color: '#22C55E', marginBottom: 8 },
  amount: { fontSize: 36, fontWeight: 'bold', color: '#333', marginBottom: 24 },
  divider: { height: 1, backgroundColor: '#eee', width: '100%', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  label: { color: '#666', fontSize: 16 },
  value: { fontWeight: '600', fontSize: 16, color: '#333' },
  actions: { marginTop: 40, width: '100%', gap: 16 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionText: { fontWeight: '600', fontSize: 16 },
  closeButton: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
