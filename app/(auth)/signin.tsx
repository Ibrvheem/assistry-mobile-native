import React, { useState, useEffect, useRef } from 'react';
import Colors from '@/constants/Colors';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar, Animated, Easing, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Eye, EyeOff, AlertCircle, XCircle } from 'lucide-react-native';
import { ErrorToast } from '@/components/ErrorToast';
import { useSignIn } from './hooks/useSignIn';
import { Controller } from 'react-hook-form';
import { router } from 'expo-router';

import { registerForPushNotificationsAsync } from '@/lib/notifications';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function SignIn() {
  const { methods, onSubmit, loading, error } = useSignIn();
  const { control, handleSubmit } = methods;
  const [showPassword, setShowPassword] = useState(false);
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
      // Auto hide error after 5 seconds
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleLogin = handleSubmit(async (data) => {
  try {
    // get Expo push token BEFORE login
    const pushToken = await registerForPushNotificationsAsync();

    // attach token to body
    const payload = {
      ...data,
      push_token: pushToken || null,
    };

    // send to your mutation
    onSubmit(payload);

  } catch (err) {
    console.error("Login failed:", err);
  }
});


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Gradient Background */}
      <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        style={styles.background}
      />

      {/* Reusable Error Toast */}
      <ErrorToast 
        visible={showError} 
        error={error} 
        onDismiss={() => setShowError(false)} 
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.contentContainer}
        >
          <View style={styles.innerContent}>
            
            {/* Top Section - Logo/Brand */}
            <Animated.View style={[styles.logoSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.logoContainer}>
                {/* <View style={styles.logoInner} /> */}
                <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
              </View>
              <Text style={styles.welcomeText}>
                Welcome to <Text style={styles.brandText}>Assistry</Text>
              </Text>
              <Text style={styles.subtitleText}>
                Sign in to continue to your account
              </Text>
            </Animated.View>

            {/* Middle Section - Login Form */}
            <Animated.View style={[styles.formSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
              
              {/* Registration Number Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Registration Number</Text>
                <Controller
                  control={control}
                  name="reg_no"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter Registration No"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCapitalize="none"
                    />
                  )}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        style={[styles.input, { paddingRight: 50 }]}
                        placeholder="Enter your password"
                        placeholderTextColor="rgba(255,255,255,0.4)"
                        secureTextEntry={!showPassword}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                  <TouchableOpacity 
                    style={styles.eyeIcon} 
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff color="rgba(255,255,255,0.6)" size={20} /> : <Eye color="rgba(255,255,255,0.6)" size={20} />}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPassword} onPress={() => router.push('/(auth)/forgot-password')}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity 
                style={styles.loginButton} 
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#1A3E2A" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

            </Animated.View>

            {/* Bottom Section */}
            <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupLabel}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                  <Text style={styles.signupLink}>Sign Up</Text>
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
  logo: {
    width: 64,
    height: 64,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.brand.background,
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
    backgroundColor: Colors.brand.primary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoInner: {
    width: 40,
    height: 40,
    borderWidth: 4,
    borderColor: Colors.brand.darkGreen,
    borderRadius: 8,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.brand.text,
    textAlign: 'center',
  },
  brandText: {
    color: Colors.brand.primary,
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
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
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
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  forgotPassword: {
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: Colors.brand.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    width: '100%',
    backgroundColor: Colors.brand.primary,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  loginButtonText: {
    color: Colors.brand.darkGreen,
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
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  signupLink: {
    color: Colors.brand.primary,
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