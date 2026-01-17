
import React, { useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, StatusBar, Image } from "react-native";
import { useNavigation, router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { useCreatePasswordHook } from "./hooks/useCreatePasswordHook";
import { FormProvider, Controller } from "react-hook-form";
import LoadingChildren from "@/components/molecules/loading-children";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff } from "lucide-react-native";

export default function CreatePassword() {
  const { methods, onSubmit, loading } = useCreatePasswordHook();
  const { control } = methods;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
       <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#B0E17C', '#4CAF50', '#1A3E2A', '#0d1f16', '#000000']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
             <View style={styles.header}>
                 <View style={styles.logoContainer}>
                      {/* Logo is optional here, maybe just the text */}
                      <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
                 </View>
                 <Text style={styles.title}>Secure Your Account</Text>
                 <Text style={styles.subtitle}>
                    Create a strong and unique password to protect your data.
                 </Text>
             </View>

             <View style={styles.form}>
                 {/* Password */}
                 <View style={styles.inputGroup}>
                     <Text style={styles.label}>Password</Text>
                     <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    secureTextEntry={!showPassword}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                        <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                             {showPassword ? <EyeOff color="rgba(255,255,255,0.6)" size={20} /> : <Eye color="rgba(255,255,255,0.6)" size={20} />}
                        </TouchableOpacity>
                     </View>
                 </View>

                 {/* Confirm Password */}
                 <View style={styles.inputGroup}>
                     <Text style={styles.label}>Confirm Password</Text>
                     <View style={styles.inputContainer}>
                        <Controller
                            control={control}
                            name="confirm_password"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm password"
                                    placeholderTextColor="rgba(255,255,255,0.4)"
                                    secureTextEntry={!showConfirmPassword}
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                />
                            )}
                        />
                         <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                             {showConfirmPassword ? <EyeOff color="rgba(255,255,255,0.6)" size={20} /> : <Eye color="rgba(255,255,255,0.6)" size={20} />}
                        </TouchableOpacity>
                     </View>
                 </View>

                 <TouchableOpacity 
                    style={styles.submitButton}
                    onPress={() => onSubmit()}
                 >
                     <LoadingChildren loading={loading}>
                        <Text style={styles.submitButtonText}>Create Account</Text>
                     </LoadingChildren>
                 </TouchableOpacity>
             </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
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
    backgroundColor: '#B0E17C',
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
      color: '#FFFFFF',
      marginBottom: 12,
  },
  subtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
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
      color: 'rgba(255,255,255,0.9)',
      fontSize: 14,
      fontWeight: '500',
  },
  inputContainer: {
      position: 'relative',
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    paddingRight: 50,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    fontSize: 16,
  },
  eyeIcon: {
      position: 'absolute',
      right: 16,
      top: 18,
  },
  submitButton: {
    backgroundColor: '#B0E17C',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#B0E17C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 20,
  },
  submitButtonText: {
    color: '#1A3E2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});