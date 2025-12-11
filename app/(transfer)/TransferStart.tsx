import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import BankSearch from '@/components/transfer/BankSearch';
import { Bank } from '@/utils/transferApi';
import { ChevronLeft } from 'lucide-react-native';

export default function TransferStart() {
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState<Bank | undefined>();

  const handleNext = () => {
    if (accountNumber.length === 10 && selectedBank) {
      router.push({
        pathname: '/(transfer)/TransferVerify',
        params: { accountNumber, bankCode: selectedBank.code, bankName: selectedBank.name },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Transfer</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Account Number</Text>
        <TextInput
          style={styles.input}
          placeholder="0123456789"
          keyboardType="numeric"
          maxLength={10}
          value={accountNumber}
          onChangeText={setAccountNumber}
        />

        <BankSearch onSelect={setSelectedBank} selectedBank={selectedBank} />

        <TouchableOpacity
          style={[
            styles.button,
            (!accountNumber || !selectedBank) && styles.buttonDisabled,
          ]}
          onPress={handleNext}
          disabled={!accountNumber || !selectedBank}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#22C55E',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: '#ccc' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
