import { View, Text, SafeAreaView, Image, StyleSheet } from "react-native";
import React from "react";
import { Button, Input } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { useCreatePasswordHook } from "./hooks/useCreatePasswordHook";
import { FormProvider } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import LoadingChildren from "@/components/molecules/loading-children";
import { useSignIn } from "./hooks/useSignIn";
import '@/global.css'

export default function SignIn() {
  const navigation = useNavigation(); // Get the navigation object
  const { methods, onSubmit, loading, error } = useSignIn();

  const { studentData } = useGobalStoreContext();

  const handlePress = () => {
    router.push("/(dashboard)");
  };

  return (
    <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
      <SafeAreaView>
        <View className="p-4">
          <View className="space-y-4 ">
            <View className="flex flex-row items-center gap-2 w-full">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 50, height: 50 }}
                className="rounded-md"
              />
            </View>
            <View className="space-y-2 pt-12">
              <Text
                // className="text-3xl mt-2 text-[#1C332B]"
                // style={{ fontFamily: "PoppinsBold" }}
                style={styles.loginText}
              >
                LOGIN
              </Text>
              <Text
              style={styles.loginTextDesc}
              >
                Welcome back! Login to access your acccount
              </Text>
            </View>
          </View>
          <FormProvider {...methods}>
            <View className="w-full mt-10">
              {error && (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-sm  text-[#D5A247]  bg-[#EEDD97]  p-2 rounded-md"
                >
                  {error.toString()}
                </Text>
              )}
              <ControlledInput
                name={"reg_no"}
                label="Registration Number"
                placeholder="Enter Registration No"
              />
            </View>
            <View className="w-full mt-7">
              <ControlledInput
                name={"password"}
                label="Password"
                placeholder="Enter password"
                secureTextEntry={true}
              />
              <Button
                style={styles.btn}
                className={"h-14 bg-green-500 w-full mt-4"}
                onPress={() => onSubmit()} // Add onPress handler
              >
                <LoadingChildren loading={loading}>Login</LoadingChildren>
              </Button>
              <Text className="mt-2">
                <Text
                  onPress={() => {
                    router.push("/(auth)/signup");
                  }}
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-green-500 underline mt-4"
                >
                  create an account
                </Text>
              </Text>
            </View>
          </FormProvider>
        </View>
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  btn: {
    fontFamily: "PoppinsBold",
    color: "white",
    backgroundColor: "#091D17",
    marginTop: 16,
    width: "40%",
    alignSelf: "flex-end"
  },
  loginText: {
  fontFamily: "Fellix-SemiBold", // If you have a specific font file for SemiBold
  fontWeight: "800",             // Or use numeric weights (100–900)
  fontSize: 30,                  // No "px" in React Native
  textAlign: "center",
},

loginTextDesc: {
  fontFamily: "Fellix-Medium", // use the actual font file name if you imported Fellix
  fontWeight: "500",   
  color: '#333333',
  fontSize: 14,                // unitless (no "px")
  lineHeight: 14,              // 100% of fontSize → so same as 12
  letterSpacing: 0,            // numeric value in RN
  textAlign: "center",
  marginTop: 10,               // numeric 
},

});