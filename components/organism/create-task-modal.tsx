import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import { Button, Label, Sheet, YStack } from "tamagui";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider, useForm } from "react-hook-form";
import ControlledInput from "@/components/molecules/controlled-input";
import ControlledTextArea from "@/components/molecules/controlled-textarea";
import LoadingChildren from "@/components/molecules/loading-children";
import { usePostTask } from "@/app/hooks/usePostTask";

interface CreateTaskModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateTaskModal({
  open,
  setOpen,
}: CreateTaskModalProps) {
  const { methods, onSubmit, loading, error } = usePostTask();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View>
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[80]}
        dismissOnSnapToBottom
      >
        <Sheet.Frame
          style={{
            padding: 16,
            backgroundColor: "white",
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        >
          <YStack space>
            <ScrollView style={{ minHeight: "100%", backgroundColor: "white" }}>
              <KeyboardAwareScrollView>
                <View
                  style={{
                    backgroundColor: "white",
                    height: "100%",
                    padding: 16,
                  }}
                >
                  {error && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#D5A247",
                        backgroundColor: "#EEDD97",
                        padding: 8,
                        borderRadius: 5,
                      }}
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

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <View style={{ width: "48%" }}>
                        <ControlledInput
                          name="incentive"
                          label="Reward? 💸"
                          placeholder="N1000"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={{ width: "48%" }}>
                        <ControlledInput
                          name="expires"
                          label="Expires In ⏱️"
                          description="EG: 0.5 = 30min, 1 = 1hr"
                          placeholder="0.5"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <View>
                      <Label
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: "#1C332B",
                          marginVertical: 10,
                        }}
                      >
                        Add Visuals (Optional) 📷
                      </Label>
                      <TouchableOpacity
                        onPress={pickImage}
                        style={{
                          height: 50,
                          borderWidth: 2,
                          borderColor: "#ccc",
                          backgroundColor: "#f5f5f5",
                          borderRadius: 5,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {image ? (
                          <Image
                            source={{ uri: image }}
                            style={{
                              height: "100%",
                              width: "100%",
                              borderRadius: 5,
                            }}
                          />
                        ) : (
                          <Text
                            style={{
                              fontSize: 14,
                              fontWeight: "bold",
                              color: "#1C332B",
                            }}
                          >
                            Open Photos
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>

                    <Button
                      style={{
                        height: 56,
                        backgroundColor: "#22c55e",
                        width: "100%",
                        marginTop: 20,
                      }}
                      onPress={methods.handleSubmit(onSubmit)}
                    >
                      <LoadingChildren loading={loading}>
                        Pay & Submit Task
                      </LoadingChildren>
                    </Button>
                  </FormProvider>

                  <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
}
