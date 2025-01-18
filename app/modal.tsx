import { StatusBar } from "expo-status-bar";
import {
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Text, View } from "@/components/Themed";
import { FormProvider, useForm } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import ControlledTextArea from "@/components/molecules/controlled-textarea";
import { useState } from "react";
import { Button, Label } from "tamagui";
import LoadingChildren from "@/components/molecules/loading-children";
import * as ImagePicker from "expo-image-picker";
import { usePostTask } from "./hooks/usePostTask";
import { useHeaderHeight } from "@react-navigation/elements";
export default function ModalScreen() {
  const { methods, onSubmit, loading, error } = usePostTask();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const height = useHeaderHeight();

  return (
    <ScrollView className="min-h-screen bg-white">
      <KeyboardAwareScrollView>
        <View className="bg-white h-full p-4">
          <Text
            style={{ fontFamily: "PoppinsBold" }}
            className="text-xl mt-4 bg-green-50 text-green-700 p-2 rounded-md"
          >
            Post a Task 📢
          </Text>
          <Text className="font-bold text-orange-400 p-2 rounded-md mt-2 bg-gray-100">
            Note: Upon payment and submission, the reward plus a 5% service
            charge will be deducted from your wallet. If the task is not
            completed within 24 hours, this amount will be refunded.
          </Text>

          <View className="mt-4 bg-transparent">
            {error && (
              <Text
                style={{ fontFamily: "PoppinsBold" }}
                className="text-sm  text-[#D5A247]  bg-[#EEDD97]  p-2 rounded-md"
              >
                {error.toString()}
              </Text>
            )}
            <FormProvider {...methods}>
              <ControlledInput
                name="task"
                label="What’s the task? 👀"
                placeholder="e.g., Buy groceries"
              />
              <ControlledTextArea
                rows={8}
                name="description"
                label="Describe it in detail ✍️"
                placeholder="e.g., Need someone to pick up fruits and vegetables from the market."
              />
              <View className="flex flex-row justify-between bg-transparent gap-2">
                <View className="w-[48%]  bg-transparent">
                  <ControlledInput
                    description=""
                    className="w-1/2"
                    name="incentive"
                    label="Reward? 💸"
                    placeholder="N1000"
                    keyboardType="numeric"
                  />
                </View>
                <View className="w-[48%] bg-transparent">
                  <ControlledInput
                    description="EG: 0.5 = 30min, 1 = 1hr"
                    className="w-1/2"
                    name="expires"
                    label="Expires In ⏱️"
                    placeholder="0.5"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View className="bg-transparent">
                <Label
                  className="font-bold text-lg text-[#1C332B] my-4"
                  style={{ fontFamily: "PoppinsBold" }}
                >
                  Add Visuals (Optional) 📷
                </Label>
                <TouchableOpacity
                  onPress={pickImage}
                  className="h-12  border-2 border-gray-200 bg-gray-100  rounded-md flex items-center justify-center"
                >
                  {image && (
                    <Image
                      source={{ uri: image }}
                      className="h-full w-full rounded-md"
                    />
                  )}
                  {!image && (
                    <Text
                      className="font-bold text-sm text-[#1C332B] "
                      style={{ fontFamily: "Poppins" }}
                    >
                      Open Photos
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
              <Button
                className={"h-14 bg-green-500 w-full mt-8"}
                onPress={() => {
                  onSubmit();
                }}
              >
                <LoadingChildren loading={loading}>
                  Pay & Submit Task
                </LoadingChildren>
              </Button>
            </FormProvider>
          </View>

          <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
        </View>
      </KeyboardAwareScrollView>
    </ScrollView>
  );
}
