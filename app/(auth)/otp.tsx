import React, { useRef, useState } from "react";
import { View, Text, SafeAreaView, TextInput,StyleSheet } from "react-native";
import { Button } from "tamagui";
import { router } from "expo-router";
import { useSendOTP } from "./hooks/useSendOTP";
import { useGobalStoreContext } from "@/store/global-context";
import { useVerifyOTP } from "./hooks/useVerifyOTP";
import LoadingChildren from "@/components/molecules/loading-children";
import { useLocalSearchParams } from "expo-router";


export default function OTP() {
  const params = useLocalSearchParams<{ pinid: string }>();
  const pinid = params.pinid;

  const { verifyOTP, loading } = useVerifyOTP();
  const { studentData } = useGobalStoreContext();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef<TextInput[]>([]);

  if (!studentData) {
    router.push("/(auth)/onboard");
    return null;
  }
  const { sendOTP } = useSendOTP(studentData?.email,studentData?.phone_no);

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

  return (
    <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
      <SafeAreaView>
        <View className="p-4">
          <View className="space-y-4">
            <View className="space-y-2">
              <Text
                className="text-3xl mt-16 text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Enter Your OTP Code 
              </Text>
              <Text className="text-lg font-bold text-[#1C332B]">
                We've sent a 6-digit OTP to your number. Please enter it below.
              </Text>
            </View>
          </View>
          <View className="mt-24 w-full">
            <View className="flex flex-row justify-between">
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
                  style={{
                    fontFamily: "PoppinsBold",
                    textAlign: "center",
                  }}
                  className="bg-transparent border-2 border-[#1C332B] h-16 mb-6 text-lg tracking-wider w-[15%] rounded-md "
                />
              ))}
            </View>

            <Text
              style={{ fontFamily: "PoppinsMedium" }}
              className="text-right my-2"
            >
              Did not receive an OTP?{" "}
              <Text
                className="font-bold text-[#1C332B] tracking-wide"
                style={{ fontFamily: "PoppinsBold" }}
                onPress={() => {
                  sendOTP({
                    email: studentData?.email,
                    phone_no: studentData?.phone_no,
                  });
                }}
              >
                Resend
              </Text>
            </Text>
            <Button
              style={styles.btn}
              className={"h-14 bg-green-500 w-full"}
              onPress={() => {
                const otpCode = otp.join("");
                // verifyOTP({
                //   email: studentData.email,
                //   otp: otpCode,
                // });
                verifyOTP({
                  pin_id: pinid,
                  code: otpCode,
                });
              }}
            >
              <LoadingChildren loading={loading}>Confirm OTP</LoadingChildren>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  btn: {
    fontFamily: "PoppinsBold", color: "white", backgroundColor: "green",
    width: "40%", marginTop: 16,
  },
});