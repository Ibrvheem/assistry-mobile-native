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
  console.log(studentData?.phone_no);
  if (!studentData) {
    router.push("/(auth)");
    return;
  }
  const { sendOTP, loading } = useSendOTP();

  if (!studentData) {
    router.push("/(auth)");
    return null; // Prevent rendering if no student data
  }

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
            <View className="flex flex-row items-center gap-2 w-full">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 50, height: 50 }}
                className="rounded-md"
              />
            </View>
            <View className="space-y-2">
              <Text
                className="text-3xl mt-12 text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Is this your phone number? {"\n"}{" "}
                {formatPhoneNumber(studentData.phone_no)}
              </Text>
              <Text className="text-lg font-bold text-[#1C332B]">
                A 6-digit OTP will be sent for confirmation.
              </Text>
            </View>
          </View>

          {/* Button Section */}
          <View className="mt-36 w-full">
            <Button
              style={{ fontFamily: "PoppinsBold", color: "white" }}
              className="h-14 bg-green-500 w-full mb-4"
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
