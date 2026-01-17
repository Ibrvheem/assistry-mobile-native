
import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { useGobalStoreContext } from "@/store/global-context";
import { useVerifyOTP } from "./hooks/useVerifyOTP";
import { useSendOTP } from "./hooks/useSendOTP";
import LoadingChildren from "@/components/molecules/loading-children";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";

export default function OTP() {
  const params = useLocalSearchParams<{ pinid: string }>();
  const pinid = params.pinid;

  const { verifyOTP, loading } = useVerifyOTP();
  const { studentData } = useGobalStoreContext();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  if (!studentData) {
    // router.push("/(auth)/onboard"); 
    return null;
  }
  
  const { sendOTP } = useSendOTP(studentData?.email, studentData?.phone_no);

  const handleInputChange = (text: string, index: number) => {
    if (/^\d?$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Move to the next input
      if (text && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "") {
      // Move to the previous input
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleSubmit = () => {
     const otpCode = otp.join("");
     verifyOTP({
        pin_id: pinid,
        code: otpCode,
     });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#B0E17C', '#4CAF50', '#1A3E2A', '#0d1f16', '#000000']}
        locations={[0, 0.2, 0.5, 0.8, 1]}
        style={styles.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft color="white" size={24} />
            </TouchableOpacity>
        </View>

        <View style={styles.content}>
             <Text style={styles.title}>Enter Verification Request</Text>
             <Text style={styles.subtitle}>
                We've sent a 6-digit OTP to {studentData?.phone_no}. Please enter it below.
             </Text>

             <View style={styles.inputContainer}>
                 {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={(ref) => {
                          inputs.current[index] = ref!;
                        }}
                      value={digit}
                      onChangeText={(text) => handleInputChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      maxLength={1}
                      keyboardType="numeric"
                      style={[styles.input, digit ? styles.inputFilled : null]}
                      selectionColor="#B0E17C"
                    />
                 ))}
             </View>

             <View style={styles.resendContainer}>
                 <Text style={styles.resendText}>Did not receive code? </Text>
                 <TouchableOpacity 
                   onPress={() => sendOTP({
                    email: studentData.email,
                    phone_no: studentData.phone_no,
                  })}
                 >
                     <Text style={styles.resendLink}>Resend</Text>
                 </TouchableOpacity>
             </View>

             <TouchableOpacity 
                style={styles.verifyButton}
                onPress={handleSubmit}
             >
                 <LoadingChildren loading={loading}>
                    <Text style={styles.verifyButtonText}>Verify & Proceed</Text>
                 </LoadingChildren>
             </TouchableOpacity>
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
  header: {
      paddingHorizontal: 20,
      paddingTop: 10,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    marginTop: 40,
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 12,
  },
  subtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.7)',
      lineHeight: 24,
      marginBottom: 40,
  },
  inputContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 32,
  },
  input: {
      width: 45,
      height: 60,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
  },
  inputFilled: {
      borderColor: '#B0E17C',
      backgroundColor: 'rgba(176, 225, 124, 0.1)',
  },
  resendContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: 32,
  },
  resendText: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 14,
  },
  resendLink: {
      color: '#B0E17C',
      fontWeight: 'bold',
      fontSize: 14,
  },
  verifyButton: {
      backgroundColor: '#B0E17C',
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      width: '100%',
      shadowColor: '#B0E17C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
  },
  verifyButtonText: {
      color: '#1A3E2A',
      fontSize: 16,
      fontWeight: 'bold',
  },
});