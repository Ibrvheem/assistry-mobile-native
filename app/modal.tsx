import { StatusBar } from "expo-status-bar";
import { Image, Platform, ScrollView, TouchableOpacity } from "react-native";
import * as DocumentPicker from "expo-document-picker";

import { Text, View } from "@/components/Themed";
import { FormProvider, useForm } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import ControlledTextArea from "@/components/molecules/controlled-textarea";
import { useState } from "react";
import { Button, Label, ListItem, Select } from "tamagui";
import LoadingChildren from "@/components/molecules/loading-children";
import * as ImagePicker from "expo-image-picker";

export default function ModalScreen() {
  const methods = useForm({});
  const [image, setImage] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  return (
    <ScrollView className="min-h-screen bg-white">
      <View className="bg-white h-full p-4">
        <Text
          style={{ fontFamily: "PoppinsBold" }}
          className="text-xl mt-4 bg-green-50 text-green-700 p-2 rounded-md"
        >
          Post a Task 📢
        </Text>
        <View className="mt-8 bg-transparent">
          <FormProvider {...methods}>
            <ControlledInput
              name="title"
              label="What’s the task? 👀"
              placeholder="e.g., Buy groceries"
            />
            <ControlledTextArea
              rows={8}
              name="description"
              label="Describe it in detail ✍️"
              placeholder="e.g., Need someone to pick up fruits and vegetables from the market."
            />
            <ControlledInput
              name="incentive"
              label="What’s the reward? 💸"
              placeholder="e.g., $10 or a thank-you note!"
            />

            <View className="bg-transparent">
              <Label
                className="font-bold text-lg text-[#1C332B] my-4"
                style={{ fontFamily: "PoppinsBold" }}
              >
                Add Visuals (Optional) 📷
              </Label>
              <TouchableOpacity
                onPress={pickImage}
                className="h-36  border-2 border-gray-300 border-dashed rounded-md flex items-center justify-center"
              >
                {image && (
                  <Image
                    source={{ uri: image }}
                    className="h-full w-full rounded-md"
                  />
                )}
                {!image && (
                  <Text
                    className="font-bold text-lg text-[#1C332B] my-4 "
                    style={{ fontFamily: "Poppins" }}
                  >
                    Click here to add visual context
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            <Button className={"h-14 bg-green-500 w-full mt-4"}>
              <LoadingChildren loading={false}>Submit Task</LoadingChildren>
            </Button>
          </FormProvider>
        </View>

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </ScrollView>
  );
}
