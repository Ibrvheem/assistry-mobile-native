
import { View, Text, SafeAreaView, Image, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import React from "react";
import { router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { formatPhoneNumber } from "@/lib/helpers";
import { useSendOTP } from "./hooks/useSendOTP";
import LoadingChildren from "@/components/molecules/loading-children";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft } from "lucide-react-native";

export default function ConfirmNumber() {
  const { studentData } = useGobalStoreContext();
  
  // Guard clause handled in useEffect usually, but here fine.
  if (!studentData) {
     return null;
  }

  const { sendOTP, loading } = useSendOTP(studentData?.email, studentData?.phone_no);

  const handleOtpPress = () => {
    // This is called by sendOTP success essentially, but here we just trigger sendOTP
    sendOTP({
      email: studentData.email,
      phone_no: studentData.phone_no,
    });
  };

  const handleChangeNumberPress = () => {
    router.back();
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
        <View style={styles.content}>
            
            {/* Header / Back */}
            {/* <TouchableOpacity onPress={handleChangeNumberPress} style={styles.backButton}>
                 <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity> */}

            <View style={styles.logoSection}>
               <Image source={require("@/assets/logos/logo.png")} style={styles.logo} resizeMode="contain" />
            </View>

            <View style={styles.textSection}>
                <Text style={styles.title}>Confirm Phone Number</Text>
                
                <View style={styles.numberCard}>
                    <Text style={styles.phoneNumber}>
                        {studentData ? formatPhoneNumber(studentData.phone_no) : "Loading..."}
                    </Text>
                </View>

                <Text style={styles.subtext}>
                    Is this number correct? We will send a 6-digit OTP to verify it.
                </Text>
            </View>

            <View style={styles.buttonContainer}>
                 <TouchableOpacity 
                    style={styles.confirmButton} 
                    onPress={handleOtpPress}
                    disabled={loading}
                >
                    <LoadingChildren loading={loading}>
                        <Text style={styles.confirmButtonText}>Yes, Send OTP</Text>
                    </LoadingChildren>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={handleChangeNumberPress}
                >
                    <Text style={styles.cancelButtonText}>No, Edit Number</Text>
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
    alignItems: 'center',
  },
//   backButton: {
//     position: 'absolute',
//     top: 20,
//     left: 20,
//     padding: 10,
//   },
  logoSection: {
      marginBottom: 32,
      backgroundColor: '#B0E17C',
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
      color: '#FFFFFF',
      marginBottom: 24,
      textAlign: 'center',
  },
  numberCard: {
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingVertical: 24,
      paddingHorizontal: 32,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      marginBottom: 24,
      width: '100%',
      alignItems: 'center',
  },
  phoneNumber: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#B0E17C',
      letterSpacing: 2,
  },
  subtext: {
      color: 'rgba(255,255,255,0.7)',
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
      backgroundColor: '#B0E17C',
      paddingVertical: 18,
      borderRadius: 16,
      width: '100%',
      alignItems: 'center',
      shadowColor: '#B0E17C',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
  },
  confirmButtonText: {
      color: '#1A3E2A',
      fontSize: 16,
      fontWeight: 'bold',
  },
  cancelButton: {
       paddingVertical: 18,
       width: '100%',
       alignItems: 'center',
  },
  cancelButtonText: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 16,
      fontWeight: '500',
  },
});
