import React, { useEffect } from 'react';
import Colors from "@/constants/Colors";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import PinInput from '@/components/transfer/PinInput';
import { useBiometricAuth } from '@/hooks/useBiometricAuth';
import { transferApi } from '@/utils/transferApi';
import { ChevronLeft } from 'lucide-react-native';

export default function TransferPin() {
  const params = useLocalSearchParams();
  const { isBiometricSupported, authenticate } = useBiometricAuth();

  useEffect(() => {
    if (isBiometricSupported) {
      handleBiometric();
    }
  }, [isBiometricSupported]);

  const handleBiometric = async () => {
    const success = await authenticate();
    if (success) {
      proceedToProcessing();
    }
  };

  const handlePinComplete = async (pin: string) => {
    try {
      const valid = await transferApi.validatePin(pin);
      if (valid) {
        proceedToProcessing();
      } else {
        Alert.alert('Error', 'Invalid PIN');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to validate PIN');
    }
  };

  const proceedToProcessing = () => {
    router.push({
      pathname: '/(transfer)/TransferProcessing',
      params: { ...params },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ChevronLeft size={24} color={Colors.brand.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Enter PIN</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Enter your 4-digit PIN to confirm transfer of ₦{params.amount}</Text>
        
        <View style={{ marginTop: 40 }}>
            <PinInput onComplete={handlePinComplete} />
        </View>

        {isBiometricSupported && (
            <TouchableOpacity style={styles.bioButton} onPress={handleBiometric}>
                <Text style={styles.bioText}>Use FaceID / TouchID</Text>
            </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.brand.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: Colors.brand.text },
  content: { padding: 20, alignItems: 'center' },
  subtitle: { textAlign: 'center', color: Colors.brand.textMuted, fontSize: 16, marginBottom: 20 },
  bioButton: { marginTop: 40, padding: 16 },
  bioText: { color: Colors.brand.primary, fontWeight: 'bold', fontSize: 16 },
});
