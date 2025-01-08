import { View, Text, SafeAreaView, Image } from "react-native";
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
                className="text-3xl mt-2 text-[#1C332B]"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Sign In 🚀
              </Text>
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                className="text-lg font-bold text-[#1C332B] my-4"
              >
                Enter Details Lorem ipsum dolor sit amet consectetur adipisicing
                elit.
              </Text>
            </View>
          </View>
          <FormProvider {...methods}>
            <View className="w-full">
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
            <View className="w-full">
              <ControlledInput
                name={"password"}
                label="Password"
                placeholder="Enter password"
                secureTextEntry={true}
              />
              <Button
                style={{ fontFamily: "PoppinsBold", color: "white" }}
                className={"h-14 bg-green-500 w-full mt-4"}
                onPress={() => onSubmit()} // Add onPress handler
              >
                <LoadingChildren loading={loading}>Sign In 🚀</LoadingChildren>
              </Button>
            </View>
          </FormProvider>
        </View>
      </SafeAreaView>
    </View>
  );
}
