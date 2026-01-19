import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, StatusBar, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from 'lucide-react-native';
import { verifyEmailOTP } from './services';
import { useMutation } from '@tanstack/react-query';

export default function ResetOTP() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: verifyEmailOTP,
    onSuccess: (data: any) => {
        router.push({
            pathname: '/(auth)/reset-password',
            params: { email, code: otp.join("") }
        });
    },
    onError: (err: any) => {
        const message = err?.response?.data?.message || err?.message || "Invalid OTP";
        setError(message);
    }
  });

  const handleInputChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
        setError("Please enter complete OTP");
        return;
    }
    setError('');
    
    // We use purpose 'reset_password' if backend supports checking it, 
    // but auth.service.ts verifyOTP checks if purpose == 'auth_account' to verify user.
    // Ideally we just verify the OTP here.
    // Passing purpose 'reset_password' just in case backend logs it or uses it.
    mutation.mutate({ email, otp: otpCode, purpose: 'reset_password' } as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={Colors.brand.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={styles.title}>Enter Code</Text>
                    <Text style={styles.subtitle}>We sent a verification code to {email}</Text>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => { inputs.current[index] = ref as TextInput; }}
                                style={[
                                    styles.otpInput,
                                    error ? { borderColor: Colors.brand.error } : null
                                ]}
                                keyboardType="numeric"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleInputChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                autoFocus={index === 0}
                                selectionColor={Colors.brand.primary}
                            />
                        ))}
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity 
                        style={[styles.button, mutation.isPending && styles.buttonDisabled]} 
                        onPress={handleVerify}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <ActivityIndicator color={Colors.brand.darkGreen} />
                        ) : (
                            <Text style={styles.buttonText}>Verify Code</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brand.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.brand.surface,
    borderRadius: 20,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
    // alignItems: 'center'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.brand.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.brand.textMuted,
    marginBottom: 40,
    lineHeight: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    backgroundColor: Colors.brand.surface,
    color: Colors.brand.text,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.brand.darkGreen,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.brand.error,
    marginBottom: 16,
    fontSize: 14,
    textAlign: 'left',
  }
});
