import { View, Text, SafeAreaView, Image, LogBox } from "react-native";
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
  LogBox.ignoreAllLogs(true);
  const { methods, onSubmit, error, loading } = useConfirmRegistrationNo();

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
            <View className="space-y-2">
              <Text
                className="text-3xl mt-8 text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Welcome! Let’s Assist You In 🥳
              </Text>
              <Text className="text-lg font-bold text-[#1C332B]">
                Please provide your registration number.
              </Text>
              <Text className="text-lg  text-[#1C332B">
                This ensures your safety and the safety of others on the
                platform.
              </Text>
            </View>
          </View>
          <FormProvider {...methods}>
            {" "}
            {/* Provide the form context */}
            <View className="mt-12 w-full">
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
