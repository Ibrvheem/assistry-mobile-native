import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import { Button } from "tamagui";
import { router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { formatPhoneNumber } from "@/lib/helpers";
import { useSendOTP } from "./hooks/useSendOTP";
import LoadingChildren from "@/components/molecules/loading-children";

export default function SignInPage() {
  const { studentData } = useGobalStoreContext();
  if (!studentData) {
    router.push("/(auth)");
    return;
  }

  if (!studentData) {
    router.push("/(auth)");
    return null; // Prevent rendering if no student data
  }
  const { sendOTP, loading } = useSendOTP(studentData.email, studentData.phone_no);

  const handleOtpPress = () => {
    router.push("/(auth)/otp");
  };

  const handleChangeNumberPress = () => {
    router.push("/(auth)");
  };

  return (
    <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
      <SafeAreaView>
        <View className="p-4">
          {/* Header Section */}
          <View className="space-y-4">
            <View className="flex flex-row items-center gap-2 w-full mt-12">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 50, height: 50 }}
                className="rounded-md"
              />
            </View>
            <View className="space-y-2">
              <Text
                className="mt-12 mb-16 text-[#1C332B]"
                style={{
                   fontFamily: "Lato",
                    fontWeight: "700",
                    fontSize: 26,
                    lineHeight: 26,
                    color: "#1C332B",
                 }}
              >
                Confirm your phone number?
               
              </Text>
              <View
                                className="mt-10 w-fit"
                                style={{
                                  backgroundColor: "#091D17",
                                  borderRadius: 12,
                                  paddingHorizontal: 10,
                                  paddingVertical: 20,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#DFF0DF",
                                    fontSize: 37,
                                    fontFamily: "Lato",
                                    fontWeight: "900",
                                    textAlign:'center',
                                    letterSpacing:7
                                  }}
                                >
                                  {formatPhoneNumber(studentData.phone_no)}
                                </Text>
              </View>
              <Text 
                              className="mt-2 mb-2 text-[#1C332B]"
                              style={{
                                fontFamily: "Lato",
                                fontWeight: "800",
                                fontSize: 16,
                                lineHeight: 20,
                                fontStyle: "italic",         // centers text horizontally
                                letterSpacing: 0.5,           // slight spacing for readability
                                color: "#1C332B",             // keeps brand color
                                opacity: 0.8,              // softer look
                              }}
                            >
                              A 6-digit OTP will be sent for confirmation.
              </Text>
              {/* <Text className="text-lg font-bold text-[#1C332B]">
                A 6-digit OTP will be sent for confirmation.
              </Text> */}
            </View>
          </View>

          {/* Button Section */}
          <View className="w-full">
            <Button
              style={{ fontFamily: "PoppinsBold", color: "white" }}
              className="h-14 bg-green-500 w-full mb-4 mt-10"
              onPress={() =>
                sendOTP({
                  email: studentData.email,
                  phone_no: studentData.phone_no,
                })
              }
            >
              <Text
                className="font-bold text-white text-base"
                style={{ fontFamily: "PoppinsBold" }}
              >
                <LoadingChildren loading={loading}>
                  Yes, this is my number
                </LoadingChildren>{" "}
              </Text>
            </Button>
            <Button
              style={{ fontFamily: "PoppinsBold" }}
              className="h-14 bg-transparent w-full"
              onPress={handleChangeNumberPress}
            >
              <Text
                className="font-bold text-[#1C332B] text-base"
                style={{ fontFamily: "PoppinsBold" }}
              >
                No, this is not mine
              </Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
