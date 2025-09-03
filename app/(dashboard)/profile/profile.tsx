import { View } from "@/components/Themed";
import React from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
import { Avatar } from "../../avatar";
import { Button, Separator } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BanknotesIcon,
  ChatBubbleOvalLeftIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  UserMinusIcon,
} from "react-native-heroicons/outline";
import { router, useRouter } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";

export default function ProfilePage() {
  const { replace } = useRouter();
  const { userData } = useGobalStoreContext();
  return (
    <ScrollView className="flex-1 bg-white">
      <SafeAreaView className="bg-white">
        <View 
        className="bg-white flex items-center mt-12"
        style={{ backgroundColor:"white" }}
        >
          <Avatar size={100} />
          <Text>{userData?.first_name}</Text>
          <Text
            className="text-slate-600 text-xs"
            style={{ fontFamily: "poppins" }}
          >
            {userData?.email}
          </Text>
          <Button className="rounded-3xl bg-black !text-white font-semibold text-sm mt-2"
          style={{ fontFamily: "poppins", color: "white", fontWeight: "600", fontSize: 14, backgroundColor: "black", marginTop: 8 }}>
            <Text
              className="text-white font-semibold"
              style={{ fontFamily: "poppins", color: "white", fontWeight: "600", fontSize: 14 }}
            >
              Edit profile
            </Text>
          </Button>
        </View>

        <View className="bg-white px-6 mt-6 space-y-2"
         style={{ backgroundColor:"white" }}>
          {/* <Text
            className="text-sm text-slate-600"
            style={{ fontFamily: "poppins" }}
          >
            User
          </Text> */}
          <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4">
            <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400"
            onPress={() => {
                            router.push("/(dashboard)/tasks");
                          }}>
            
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <DocumentIcon color={"gray"} size={20} />
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Task History
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center"
            onPress={() => {
                            router.push("/(dashboard)/transactions");
                          }}>
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <BanknotesIcon color={"gray"} size={20} />
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Transaction History
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-white px-6 mt-6 space-y-2"
         style={{ backgroundColor:"white" }}>
          {/* <Text
            className="text-sm text-slate-600"
            style={{ fontFamily: "poppins" }}
          >
            Contact Support
          </Text> */}
          <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4">
            <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400">
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <ExclamationCircleIcon color={"gray"} size={20} />
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Report Fraud Activity
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center">
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <ChatBubbleOvalLeftIcon color={"gray"} size={20} />{" "}
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Support Center
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-white px-6 mt-6 space-y-2"
         style={{ backgroundColor:"white" }}>
          {/* <Text
            className="text-sm text-slate-600"
            style={{ fontFamily: "poppins" }}
          >
            Account
          </Text> */}
          <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4">
            <TouchableOpacity
              className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400"
              onPress={() => {
                const handleLogout = async () => {
                  try {
                    await AsyncStorage.removeItem("token");
                    replace("/(auth)/signin");
                  } catch (error) {
                    console.error("Error removing token:", error);
                  }
                };

                handleLogout();
              }}
            >
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <ExclamationCircleIcon color={"gray"} size={20} />
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Log Out
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center">
              <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300">
                <UserMinusIcon color={"gray"} size={20} />
              </View>
              <Text className="" style={{ fontFamily: "poppins" }}>
                Delete Account
              </Text>
              <View className="flex-1 flex items-end bg-transparent">
                <ArrowRightIcon color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
