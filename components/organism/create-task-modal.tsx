import React, { Dispatch, SetStateAction, useState } from "react";
import {
  View,
  Text,
  Image,
  Platform,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface CreateTaskModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CreateTaskModal({
  open,
  setOpen,
}: CreateTaskModalProps) {
  const { methods, onSubmit, loading, error, images, setImages } = usePostTask({
    setOpen,
  });

  const pickImage = async () => {
    if (images.length >= 3) return; // Restrict to 3 images

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImages((prev) => [...prev, result.assets[0].uri].slice(0, 3));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
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

                  <Button 
                  style={styles.closeButton2}
                  onPress={() => setOpen(false)}>
                  <Text>Close</Text>
                  </Button>


                  {/* Close button now actually closes the modal */}
                  {/* <Pressable
                  onPress={() => setOpen(false)}
                  style={styles.closeButton}
                  accessibilityLabel="Close"
                  >
                  <Text style={styles.closeButtonText}>×</Text>
                  </Pressable> */}
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
                    <ControlledInput
                      name="location"
                      label="Location"
                      placeholder="Male Hostel"
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

                    <Animated.View entering={FadeInUp.delay(600).springify()}>
                      <View style={[styles.lastSection]}>
                        <Text style={[styles.label]}>Add Photos</Text>
                        <Pressable
                          style={styles.imageUpload}
                          onPress={pickImage}
                          disabled={images.length >= 3}
                        >
                          <LinearGradient
                            colors={["#22C55E", "#4ADE80"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.imageUploadGradient}
                          >
                            <View style={styles.imageUploadContent}>
                              <Ionicons name="images" size={32} color="#fff" />
                              <Text style={styles.imageUploadText}>
                                {images.length >= 3
                                  ? "Max 3 Images Reached"
                                  : "Upload Images"}
                              </Text>
                              <Text style={styles.imageUploadSubtext}>
                                {images.length}/3 images added
                              </Text>
                            </View>
                          </LinearGradient>
                        </Pressable>

                        {/* Image Previews */}
                        {images.length > 0 && (
                          <View style={styles.imagePreviewContainer}>
                            {images.map((img, index) => (
                              <View key={index} style={styles.imageWrapper}>
                                <Image
                                  source={{ uri: img }}
                                  style={styles.imagePreview}
                                />
                                <TouchableOpacity
                                  style={styles.removeImageButton}
                                  onPress={() => removeImage(index)}
                                >
                                  <Ionicons
                                    name="close-circle"
                                    size={24}
                                    color="red"
                                  />
                                </TouchableOpacity>
                              </View>
                            ))}
                          </View>
                        )}
                      </View>
                    </Animated.View>

                    <Button
                      style={{
                        height: 56,
                        backgroundColor: "#22c55e",
                        width: "100%",
                        marginTop: 20,
                      }}
                      onPress={() => {
                        onSubmit();
                      }}
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

const styles = StyleSheet.create({
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  lastSection: {
    borderBottomWidth: 0,
    paddingBottom: 32,
  },
  label: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  imageUpload: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageUploadGradient: {
    padding: 24,
  },
  imageUploadContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  imageUploadText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 12,
  },
  imageUploadSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    borderRadius: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 4,
  },
closeButton: {
position: "absolute",
top: 12,
right: 12,
width: 36,
height: 36,
borderRadius: 18,
backgroundColor: "#000",
alignItems: "center",
justifyContent: "center",
zIndex: 10,
},
closeButton2: {
  position: "absolute",
width: 'auto',
height: 6,
 top: 10,          // distance from top
  right: 10,        // distance from right
borderRadius: 18,
backgroundColor:'DBCBCB'
},
closeButtonText: {
color: "#fff",
fontSize: 20,
lineHeight: 20,
fontWeight: "700",
},
});
