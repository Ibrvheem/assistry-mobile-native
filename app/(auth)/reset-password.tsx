import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Colors from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft } from 'lucide-react-native';
import { resetPassword } from './services';
import { useMutation } from '@tanstack/react-query';
import { ErrorToast } from '@/components/ErrorToast';

export default function ResetPassword() {
  const { email, code } = useLocalSearchParams<{ email: string, code: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

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
    <View style={styles.container}>
      {error ? <ErrorToast error={{ message: error }} visible={!!error} onDismiss={() => setError('')} /> : null}
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
                    <Text style={styles.title}>New Password</Text>
                    <Text style={styles.subtitle}>Enter your new password below. Make sure it's secure.</Text>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>New Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter new password"
                            placeholderTextColor={Colors.brand.textMuted}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm new password"
                            placeholderTextColor={Colors.brand.textMuted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, mutation.isPending && styles.buttonDisabled]} 
                        onPress={handleSubmit}
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? (
                            <ActivityIndicator color={Colors.brand.darkGreen} />
                        ) : (
                            <Text style={styles.buttonText}>Reset Password</Text>
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
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.brand.text,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.brand.surface,
    borderRadius: 12,
    padding: 16,
    color: Colors.brand.text,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.brand.darkGreen,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
