
import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import Colors from "@/constants/Colors";
import { useGobalStoreContext } from "@/store/global-context";
import { useVerifyOTP } from "./hooks/useVerifyOTP";
import { useVerifyEmailOTP } from "./hooks/useVerifyEmailOTP";
import { useSendOTP } from "./hooks/useSendOTP";
import LoadingChildren from "@/components/molecules/loading-children";
import { useLocalSearchParams, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, XCircle } from "lucide-react-native";
import { ErrorToast } from "@/components/ErrorToast";

export default function OTP() {
  const params = useLocalSearchParams<{ pinid: string; email: string }>();
  const pinid = params.pinid;
  const email = params.email;

  const { verifyOTP: verifyPin, loading: pinLoading } = useVerifyOTP();
  const { verifyOTP: verifyEmail, loading: emailLoading } = useVerifyEmailOTP();
  const { studentData } = useGobalStoreContext();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loading = pinLoading || emailLoading;

  const handleSubmit = async () => {
     try {
       const otpCode = otp.join("");
       if (email) {
         await verifyEmail({
           email: email,
           otp: otpCode,
           purpose: "auth_account"
         });
       } else if (pinid) {
         await verifyPin({
            pin_id: pinid,
            code: otpCode,
         });
       } else {
         throw new Error("Missing verification context");
       }
     } catch (err: any) {
        setErrorMsg(err.message || "OTP verification failed");
        setShowError(true);
     }
  };

  // If we have email (from new signup), we might not have studentData immediately available in global store?
  // Actually, checks if !studentData return null.
  // The new signup flow might NOT put data in global store yet.
  // So we should remove the blocking check if we have email.
  
  // if (!studentData && !email) {
  //   // router.push("/(auth)/onboard"); 
  //   return null;
  // }
  
  // For Resend:
  const { sendOTP } = useSendOTP(studentData?.email || email, studentData?.phone_no);

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

  const displayEmail = email || studentData?.email;
  const displayPhone = studentData?.phone_no; 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={Colors.brand.gradient}
        locations={Colors.brand.gradientLocations as any}
        style={styles.background}
      />
      
      <ErrorToast 
        visible={showError} 
        error={errorMsg} 
        onDismiss={() => setShowError(false)} 
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
                We've sent a 6-digit OTP to {displayEmail || displayPhone}. Please enter it below.
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
                      selectionColor={Colors.brand.primary}
                    />
                 ))}
             </View>

             <View style={styles.resendContainer}>
                 <Text style={styles.resendText}>Did not receive code? </Text>
                 <TouchableOpacity 
                   onPress={() => sendOTP({
                    email: displayEmail!,
                    phone_no: displayPhone!, // This might be issue if phone is missing in new flow
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
      borderColor: Colors.brand.primary,
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
      color: Colors.brand.primary,
      fontWeight: 'bold',
      fontSize: 14,
  },
  verifyButton: {
      backgroundColor: Colors.brand.primary,
      paddingVertical: 18,
      borderRadius: 16,
      alignItems: 'center',
      width: '100%',
      shadowColor: Colors.brand.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
  },
  verifyButtonText: {
      color: Colors.brand.darkGreen,
      fontSize: 16,
      fontWeight: 'bold',
  },
});