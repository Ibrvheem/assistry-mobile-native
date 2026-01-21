import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from 'lucide-react-native';
import { resetPassword } from './services';
import { useMutation } from '@tanstack/react-query';
import { ErrorToast } from '@/components/ErrorToast';
import { useColorScheme } from '@/components/useColorScheme';

export default function ResetPassword() {
  const { email, code } = useLocalSearchParams<{ email: string, code: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const mutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: (data: any) => {
        Alert.alert("Success", "Password verified and changed successfully", [
            { text: "Login", onPress: () => router.push('/(auth)/signin') }
        ]);
    },
    onError: (err: any) => {
        const message = err?.response?.data?.message || "Something went wrong";
        setError(message);
    }
  });

  const handleSubmit = () => {
    if (!newPassword || !confirmPassword) {
        setError("Please enter both passwords");
        return;
    }
    if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
    }
    if (newPassword.length < 6) {
        setError("Password must be at least 6 characters");
        return;
    }
    setError('');
    mutation.mutate({ email, code, newPassword });
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      {error ? <ErrorToast error={{ message: error }} visible={!!error} onDismiss={() => setError('')} /> : null}
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
                    <Text style={[styles.title, { color: themeColors.text }]}>New Password</Text>
                    <Text style={[styles.subtitle, { color: themeColors.textDim }]}>Enter your new password below. Make sure it's secure.</Text>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: themeColors.text }]}>New Password</Text>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                color: themeColors.text,
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }]}
                            placeholder="Enter new password"
                            placeholderTextColor={themeColors.textMuted}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={[styles.label, { color: themeColors.text }]}>Confirm Password</Text>
                        <TextInput
                            style={[styles.input, { 
                                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                color: themeColors.text,
                                borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'
                            }]}
                            placeholder="Confirm new password"
                            placeholderTextColor={themeColors.textMuted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, mutation.isPending && styles.buttonDisabled, { backgroundColor: themeColors.primary }]} 
                        onPress={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <ActivityIndicator color={Colors.brand.darkGreen} />
                        ) : (
                            <Text style={[styles.buttonText, { color: Colors.brand.darkGreen }]}>Reset Password</Text>
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
});
