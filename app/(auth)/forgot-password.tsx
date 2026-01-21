import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { router } from 'expo-router';
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from 'lucide-react-native';
import { forgotPassword } from './services';
import { useMutation } from '@tanstack/react-query';
import { useColorScheme } from '@/components/useColorScheme';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const mutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data: any) => {
        // Assuming success returns 200 or ok
        router.push({
            pathname: '/(auth)/reset-otp',
            params: { email }
        });
    },
    onError: (err: any) => {
        const message = err?.response?.data?.message || "Something went wrong";
        setError(message);
    }
  });

  const handleSubmit = () => {
    if (!email) {
        setError("Please enter your email");
        return;
    }
    setError('');
    mutation.mutate(email);
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={themeColors.gradient}
        locations={themeColors.gradientLocations as any}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                    <ChevronLeft size={24} color={themeColors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                <View style={styles.content}>
                    <Text style={[styles.title, { color: themeColors.text }]}>Forgot Password?</Text>
                    <Text style={[styles.subtitle, { color: themeColors.textDim }]}>Enter your email address to receive a verification code.</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Email Address</Text>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                color: themeColors.text,
                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                            }]}
                            placeholder="Enter your email"
                            placeholderTextColor={themeColors.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {error ? <Text style={styles.errorText}>{error}</Text> : null}

                    <TouchableOpacity 
                        style={[styles.button, mutation.isPending && styles.buttonDisabled, { backgroundColor: themeColors.primary }]} 
                        onPress={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <ActivityIndicator color={Colors.brand.darkGreen} />
                        ) : (
                            <Text style={[styles.buttonText, { color: Colors.brand.darkGreen }]}>Send Reset Code</Text>
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
    borderRadius: 20,
  },
  content: {
    padding: 24,
    justifyContent: 'center',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.brand.error,
    marginBottom: 16,
    fontSize: 14,
  }
});
