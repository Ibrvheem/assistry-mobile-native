import React, { useRef } from 'react';
import Colors from "@/constants/Colors";
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
          <X size={24} color={Colors.brand.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.receipt}>
            <View style={styles.iconContainer}>
            <CheckCircle size={64} color={Colors.brand.primary} />
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
                <Share2 size={20} color={Colors.brand.text} />
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
  container: { flex: 1, backgroundColor: Colors.brand.background },
  header: { padding: 16, alignItems: 'flex-end' },
  content: { padding: 20, alignItems: 'center' },
  receipt: {
    backgroundColor: Colors.brand.surface,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  iconContainer: { marginBottom: 16 },
  status: { fontSize: 20, fontWeight: 'bold', color: Colors.brand.primary, marginBottom: 8 },
  amount: { fontSize: 36, fontWeight: 'bold', color: Colors.brand.text, marginBottom: 24 },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.1)", width: '100%', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 16 },
  label: { color: Colors.brand.textMuted, fontSize: 16 },
  value: { fontWeight: '600', fontSize: 16, color: Colors.brand.text },
  actions: { marginTop: 40, width: '100%', gap: 16 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.surface,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionText: { fontWeight: '600', fontSize: 16, color: Colors.brand.text },
  closeButton: {
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeText: { color: Colors.brand.darkGreen, fontWeight: 'bold', fontSize: 16 },
});
