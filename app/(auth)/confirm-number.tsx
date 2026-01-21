
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, StatusBar, Platform, KeyboardAvoidingView, ScrollView } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { formatPhoneNumber } from "@/lib/helpers";
import { useSendOTP } from "./hooks/useSendOTP";
import LoadingChildren from "@/components/molecules/loading-children";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";
import { ErrorToast } from "@/components/ErrorToast";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";

export default function ConfirmNumber() {
  const { studentData } = useGobalStoreContext();
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme ?? 'light'];
  const isDark = colorScheme === 'dark';
  
  // Guard clause handled in useEffect usually, but here fine.
  if (!studentData) {
     return null;
  }

  const { sendOTP, loading } = useSendOTP(studentData?.email, studentData?.phone_no);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOtpPress = async () => {
    try {
        await sendOTP({
          email: studentData.email,
          phone_no: studentData.phone_no,
        });
    } catch (err: any) {
        setErrorMsg(err.message || "Failed to send OTP");
        setShowError(true);
    }
  };

  const handleChangeNumberPress = () => {
    router.back();
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
        <View style={styles.content}>
            
            <View style={[styles.logoSection, { backgroundColor: themeColors.primary }]}>
               <Image 
                 source={isDark ? require("@/assets/logos/logo.png") : require("@/assets/logos/image.png")} 
                 style={styles.logo} 
                 resizeMode="contain" 
                />
            </View>

            <View style={styles.textSection}>
                <Text style={[styles.title, { color: themeColors.text }]}>Confirm Phone Number</Text>
                
                <View style={[styles.numberCard, { 
                    backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'
                }]}>
                    <Text style={[styles.phoneNumber, { color: themeColors.primary }]}>
                        {studentData ? formatPhoneNumber(studentData.phone_no) : "Loading..."}
                    </Text>
                </View>

                <Text style={[styles.subtext, { color: themeColors.textDim }]}>
                    Is this number correct? We will send a 6-digit OTP to verify it.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                 <TouchableOpacity 
                    style={[styles.confirmButton, { backgroundColor: themeColors.primary, shadowColor: themeColors.primary }]} 
                    onPress={handleOtpPress}
                    disabled={loading}
                >
                    <LoadingChildren loading={loading}>
                        <Text style={[styles.confirmButtonText, { color: Colors.brand.darkGreen }]}>Yes, Send OTP</Text>
                    </LoadingChildren>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleChangeNumberPress}
                >
                    <Text style={[styles.cancelButtonText, { color: themeColors.textMuted }]}>No, Edit Number</Text>
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
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center', 
    alignItems: 'center',
  },
  logoSection: {
      marginBottom: 32,
      padding: 12,
      borderRadius: 16,
  },
  logo: {
      width: 48,
      height: 48,
  },
  textSection: {
      width: '100%',
      alignItems: 'center',
      marginBottom: 48,
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 24,
      textAlign: 'center',
  },
  numberCard: {
      paddingVertical: 24,
      paddingHorizontal: 32,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
      width: '100%',
      alignItems: 'center',
  },
  phoneNumber: {
      fontSize: 28,
      fontWeight: 'bold',
      letterSpacing: 2,
  },
  subtext: {
      textAlign: 'center',
      fontSize: 14,
      lineHeight: 20,
      paddingHorizontal: 20,
  },
  buttonContainer: {
      width: '100%',
      gap: 16,
  },
  confirmButton: {
      paddingVertical: 18,
      borderRadius: 16,
      width: '100%',
      alignItems: 'center',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
  },
  confirmButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
  },
  cancelButton: {
       paddingVertical: 18,
       width: '100%',
       alignItems: 'center',
  },
  cancelButtonText: {
      fontSize: 16,
      fontWeight: '500',
  },
});
