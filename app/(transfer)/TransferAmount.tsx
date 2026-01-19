import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Colors from "@/constants/Colors";
import { router, useLocalSearchParams } from 'expo-router';
import { transferApi } from '@/utils/transferApi';
import { ChevronLeft } from 'lucide-react-native';

export default function TransferAmount() {
  const params = useLocalSearchParams();
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState(0);

  useEffect(() => {
    if (amount) {
      const timeout = setTimeout(async () => {
        try {
          const quote = await transferApi.getQuote(parseFloat(amount));
          setFee(quote.fee);
        } catch (e) {
          console.error(e);
        }
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setFee(0);
    }
  }, [amount]);

  const handleNext = () => {
    if (parseFloat(amount) > 0) {
      router.push({
        pathname: '/(transfer)/TransferPin',
        params: { ...params, amount, fee },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.brand.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Enter Amount</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
            <Text style={styles.currency}>₦</Text>
            <TextInput
            style={styles.input}
            placeholder="0.00"
            placeholderTextColor={Colors.brand.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            autoFocus
            />
        </View>
        
        <Text style={styles.fee}>Fee: ₦{fee.toFixed(2)}</Text>

        <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Sending to:</Text>
            <Text style={styles.summaryValue}>{params.accountName}</Text>
            <Text style={styles.summarySub}>{params.bankName}</Text>
        </View>

        <TouchableOpacity
          style={[styles.button, !amount && styles.buttonDisabled]}
          onPress={handleNext}
          disabled={!amount}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.brand.text },
  content: { padding: 20, flex: 1 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  currency: { fontSize: 40, fontWeight: 'bold', color: Colors.brand.text },
  input: { fontSize: 40, fontWeight: 'bold', color: Colors.brand.text, minWidth: 100, textAlign: 'center' },
  fee: { textAlign: 'center', color: Colors.brand.textMuted, fontSize: 16, marginBottom: 40 },
  summary: { backgroundColor: Colors.brand.surface, padding: 16, borderRadius: 12, marginBottom: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  summaryLabel: { color: Colors.brand.textMuted, marginBottom: 4 },
  summaryValue: { fontSize: 18, fontWeight: 'bold', color: Colors.brand.text },
  summarySub: { color: Colors.brand.textDim },
  button: {
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  buttonDisabled: { backgroundColor: Colors.brand.surface, opacity: 0.5 },
  buttonText: { color: Colors.brand.darkGreen, fontSize: 16, fontWeight: 'bold' },
});
