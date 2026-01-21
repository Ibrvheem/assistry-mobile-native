
import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, StatusBar, Image, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import { useNavigation, router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { useCreatePasswordHook } from "./hooks/useCreatePasswordHook";
import { FormProvider, Controller } from "react-hook-form";
import LoadingChildren from "@/components/molecules/loading-children";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff } from "lucide-react-native";
import { ErrorToast } from "@/components/ErrorToast";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function CreatePassword() {
  const { methods, onSubmit, loading } = useCreatePasswordHook();
  const { control } = methods;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';

  const handleCreatePassword = async () => {
      try {
          await onSubmit();
      } catch (err: any) {
          setErrorMsg(err.message || "Failed to create password");
          setShowError(true);
      }
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
       <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={themeColors.gradient}
        locations={themeColors.gradientLocations as any}
        style={styles.background}
      />
      
      <ErrorToast 
        visible={showError} 
        error={errorMsg} 
        onDismiss={() => setShowError(false)} 
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={[styles.logoContainer, { backgroundColor: themeColors.primary }]}>
                            <Image 
                                source={isDark ? require("@/assets/logos/logo.png") : require("@/assets/logos/image.png")} 
                                style={styles.logo} 
                                resizeMode="contain" 
                            />
                        </View>
                        <Text style={[styles.title, { color: themeColors.text }]}>Secure Your Account</Text>
                        <Text style={[styles.subtitle, { color: themeColors.textDim }]}>
                            Create a strong and unique password to protect your data.
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Controller
                                    control={control}
                                    name="password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[styles.input, { 
                                                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                color: themeColors.text,
                                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                                            }]}
                                            placeholder="Enter password"
                                            placeholderTextColor={themeColors.textMuted}
                                            secureTextEntry={!showPassword}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                    {showPassword ? 
                                        <EyeOff color={themeColors.textMuted} size={20} /> : 
                                        <Eye color={themeColors.textMuted} size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: themeColors.text }]}>Confirm Password</Text>
                            <View style={styles.inputContainer}>
                                <Controller
                                    control={control}
                                    name="confirm_password"
                                    render={({ field: { onChange, onBlur, value } }) => (
                                        <TextInput
                                            style={[styles.input, { 
                                                backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                                color: themeColors.text,
                                                borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                                            }]}
                                            placeholder="Confirm password"
                                            placeholderTextColor={themeColors.textMuted}
                                            secureTextEntry={!showConfirmPassword}
                                            onBlur={onBlur}
                                            onChangeText={onChange}
                                            value={value}
                                        />
                                    )}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? 
                                        <EyeOff color={themeColors.textMuted} size={20} /> : 
                                        <Eye color={themeColors.textMuted} size={20} />
                                    }
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity 
                            style={[styles.submitButton, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary }]}
                            onPress={handleCreatePassword}
                        >
                            <LoadingChildren loading={loading}>
                                <Text style={[styles.submitButtonText, { color: Colors.brand.darkGreen }]}>Create Account</Text>
                            </LoadingChildren>
                        </TouchableOpacity>
                    </View>
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
  scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  header: {
      alignItems: 'center',
      marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 16,
  },
  logo: {
      width: 40,
      height: 40,
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 12,
  },
  subtitle: {
      fontSize: 16,
      textAlign: 'center',
      lineHeight: 24,
  },
  form: {
      width: '100%',
      gap: 20,
  },
  inputGroup: {
      gap: 8,
  },
  label: {
      fontSize: 14,
      fontWeight: '500',
  },
  inputContainer: {
      position: 'relative',
  },
  input: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    borderWidth: 1,
    fontSize: 16,
  },
  eyeIcon: {
      position: 'absolute',
      right: 16,
      top: 18,
  },
  submitButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});