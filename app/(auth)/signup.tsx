import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, Animated, Easing, Image, TextInputProps, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, AlertCircle, XCircle } from 'lucide-react-native';
import { Controller, useFormContext, FormProvider } from 'react-hook-form';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useConfirmRegistrationNo } from "./hooks/useConfirmRegistrationNo";
import LoadingChildren from "@/components/molecules/loading-children";

// Reusing ControlledInput pattern if preferred, or using Controller directly as in SignIn.
// Since we want to match SignIn code structure/aesthetics, using Controller directly is cleaner, 
// but since this file used ControlledInput locally, let's just inline the Controller logic or keep a minimal wrapper styled correctly.

const { width } = Dimensions.get('window');

export default function SignUp() {
  const { methods, onSubmit, error, loading } = useConfirmRegistrationNo();
  const { control, handleSubmit } = methods;
  const [showError, setShowError] = useState(false);

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={['#B0E17C', '#4CAF50', '#1A3E2A', '#0d1f16', '#000000']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.background}
      />

      {/* Error Toast */}
      {showError && (
        <Animated.View 
          style={[styles.errorToast, { opacity: fadeAnim }]}
        >
          <XCircle color="#FF6B6B" size={24} />
          <View style={styles.errorContent}>
            <Text style={styles.errorTitle}>Verification Failed</Text>
            <Text style={styles.errorMessage}>
              {error?.toString() || "An error occurred. Please try again."}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setShowError(false)}>
            <Text style={styles.dismissText}>Dismiss</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}
        >
          <View style={styles.innerContent}>
            
            {/* Top Section - Logo/Brand */}
            <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoContainer}>
                 <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
              </View>
              <Text style={styles.welcomeText}>
                Join <Text style={styles.brandText}>Assistry</Text>
              </Text>
              <Text style={styles.subtitleText}>
                Your all-in-one campus solution
              </Text>
            </Animated.View>

            {/* Middle Section - Form */}
            <Animated.View style={[styles.formSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              
              <FormProvider {...methods}>
                <View style={styles.inputGroup}>
                   <Text 
                    style={styles.instructionText}
                  >
                    Kindly input Your REG NO to get verified..
                  </Text>
                  
                  <Controller
                    control={control}
                    name="reg_no"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={styles.input}
                        placeholder="CST/18/IFT/00111"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value as string}
                        autoCapitalize="none"
                      />
                    )}
                  />
                </View>

                {/* Verify Button */}
                <TouchableOpacity 
                  style={styles.actionButton} 
                  onPress={() => onSubmit()}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#1A3E2A" />
                  ) : (
                    <Text style={styles.actionButtonText}>Verify</Text>
                  )}
                </TouchableOpacity>
              </FormProvider>

            </Animated.View>

            {/* Bottom Section */}
            <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.authSwitchContainer}>
                <Text style={styles.authLabel}>Have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/signin")}>
                  <Text style={styles.authLink}>Sign In</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

          </View>
        </KeyboardAvoidingView>
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
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  innerContent: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    backgroundColor: '#B0E17C',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 64,
    height: 64,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  brandText: {
    color: '#B0E17C',
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 16,
  },
  formSection: {
    width: '100%',
    gap: 20,
    marginTop: 20, 
  },
  inputGroup: {
    gap: 12,
  },
  instructionText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  input: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    fontSize: 16,
  },
  actionButton: {
    width: '100%',
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
    marginTop: 16,
  },
  actionButtonText: {
    color: '#1A3E2A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomSection: {
    gap: 16,
    marginBottom: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  orText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
  authSwitchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  authLink: {
    color: '#B0E17C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  errorToast: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    backgroundColor: '#2D1A1A',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B6B',
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  errorContent: {
    flex: 1,
    marginLeft: 12,
  },
  errorTitle: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 2,
  },
  errorMessage: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  dismissText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    marginLeft: 8,
  },
});
