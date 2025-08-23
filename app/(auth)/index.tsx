import { View, Text, SafeAreaView, Image,ImageBackground, LogBox } from "react-native";
import React from "react";
import { Button, Input, Spinner } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import ControlledInput from "@/components/molecules/controlled-input";
import { FormProvider, useForm } from "react-hook-form";
import { getStudentData } from "./services";
import { useMutation } from "@tanstack/react-query";
import { useGobalStoreContext } from "@/store/global-context";
import { useConfirmRegistrationNo } from "./hooks/useConfirmRegistrationNo";
import LoadingChildren from "@/components/molecules/loading-children";

export default function SignInPage() {
  const navigation = useNavigation();
  const { studentData, setStudentData } = useGobalStoreContext();

  const handlePress = () => {
    router.push("/(auth)/confirm-number");
  };
  const { methods, onSubmit, error, loading } = useConfirmRegistrationNo();

  return (
    <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
      <SafeAreaView>
         {/* Background photo */}
        <ImageBackground
          source={require("../../assets/logos/bck.png")} // your photo
          className="w-full h-96 rounded-md overflow-hidden mt-6"
          resizeMode="cover"
        >
          {/* Left logo (top-left) */}
          <View className="absolute top-4 left-4">
            <View className="rounded-lg p-1 shadow">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 48, height: 48 }} // tweak size
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Right logos cluster (top-right) */}
          <View className="absolute top-4 right-4 flex-row items-center">
            {/* first right logo */}
            <View className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/udus.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>

            {/* overlapping logos: use negative margin to overlap */}
            <View style={{ marginLeft: -10 }} className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/abu.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ marginLeft: -10 }} className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/buk.jpg")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </ImageBackground>
        {/* <View className="mt-6">
          <Image
                source={require("../../assets/logos/Frame 4.png")}
                // style={{ width: 300, height: 400 }}
                className="rounded-md"
              />
        </View> */}
        <View className="p-4">
          <View className="space-y-4">
            {/* <View className="flex flex-row items-center gap-2 w-full">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 50, height: 50 }}
                className="rounded-md"
              />
            </View> */}
            <View className="space-y-2">
              <Text
                className="text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Welcome To Assistry! 
              </Text>
              <Text
                className="text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Your all in one campus solutions
              </Text>
              <Text className="text-[#1C332B">
                Get STarted by putting in Your REG NO 
              </Text>
            </View>
          </View>
          <FormProvider {...methods}>
            {" "}
            {/* Provide the form context */}
            <View className="mt-2 w-full">
              {error && (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-sm  text-[#D5A247]  bg-[#EEDD97]  p-2 rounded-md"
                >
                  {error.toString()}
                </Text>
              )}
              <ControlledInput
                name="reg_no"
                label="Registration Number"
                placeholder="CST/18/IFT/00111"
              />
              <Button
                style={{ fontFamily: "PoppinsBold", color: "white" }}
                className={"h-14 bg-green-500 w-full"}
                onPress={() => onSubmit()}
              >
                <LoadingChildren loading={loading}>
                  Verify Registration Number
                </LoadingChildren>
              </Button>
              <Text className="mt-2 text-right">
                Have an account?{" "}
                <Text
                  onPress={() => {
                    router.push("/(auth)/signin");
                  }}
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-green-500 underline"
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </FormProvider>
        </View>
      </SafeAreaView>
    </View>
  );
}
