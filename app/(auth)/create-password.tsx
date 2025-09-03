import { View, Text, SafeAreaView, Image,StyleSheet } from "react-native";
import React from "react";
import { Button, Input } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
import { useCreatePasswordHook } from "./hooks/useCreatePasswordHook";
import { FormProvider } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import LoadingChildren from "@/components/molecules/loading-children";

export default function CreatePassword() {
  const navigation = useNavigation(); // Get the navigation object
  const { methods, onSubmit, loading } = useCreatePasswordHook();

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
                Create Password 
              </Text>
              <Text
                style={{ fontFamily: "PoppinsMedium" }}
                className="text-lg font-bold text-[#1C332B] my-4"
              >
                Final Step, we promise. Choose a secure and unique password
              </Text>
            </View>
          </View>
          <FormProvider {...methods}>
            <View className="w-full  mt-7">
              <ControlledInput
                name={"password"}
                label="Password"
                placeholder="Choose a strong password"
                secureTextEntry={true}
              />
            </View>
            <View className="w-full mt-7">
              <ControlledInput
                name={"confirm_password"}
                label="Confirm Password"
                placeholder="Confirm password"
                secureTextEntry={true}
              />
              <Button
                style={styles.btn}
                className={"h-14 bg-green-500 w-full mt-4"}
                onPress={() => onSubmit()} // Add onPress handler
              >
                <LoadingChildren loading={loading}>
                  Get Started 
                </LoadingChildren>
              </Button>
            </View>
          </FormProvider>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  started: {
    fontFamily: "PoppinsBold", color: "white" 
  },
   btn: {
    fontFamily: "PoppinsBold",
    color: "white",
    backgroundColor: "green",
    marginTop: 16,
    width: "40%",
    alignSelf: "flex-end"
  },
});