
// components/organism/create-task-modal.tsx
import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { Button, YStack } from "tamagui";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormProvider } from "react-hook-form";
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

export default function CreateTaskModal({ open, setOpen }: CreateTaskModalProps) {
  const { methods, onSubmit, loading, error, images, setImages } = usePostTask({
    setOpen,
  });

  const pickImage = async () => {
    if (images.length >= 3) return;

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
    <Modal visible={open} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <YStack space>
            <ScrollView style={{ minHeight: "100%", backgroundColor: "white" }}>
              <KeyboardAwareScrollView>
                <View style={{ backgroundColor: "white", height: "100%" }}>
                  {error && (
                    <Text style={styles.errorText}>{error.toString()}</Text>
                  )}

                  <Button style={styles.closeButton2} onPress={() => setOpen(false)}>
                    <Text>Close</Text>
                  </Button>

                  <FormProvider {...methods}>
                    <View
                    className="mt-7">
                    <ControlledInput
                      name="task"
                      label="What’s the task?"
                      placeholder="e.g., Buy groceries"
                    />
                    </View>

                    <View
                    className="mt-4"
                    >
                    
                    <ControlledTextArea
                      rows={8}
                      name="description"
                      label="Description"
                      placeholder="e.g., Need someone to pick up fruits and vegetables from the market."
                    />
                    </View>

                    <View
                    className="mt-4">
                    <ControlledInput
                    
                      name="location"
                      label="Location"
                      placeholder="Male Hostel"
                    />
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <View 
                      className="mt-4"
                      style={{ width: "48%" }}>
                        <ControlledInput
                          name="incentive"
                          label="Reward"
                          placeholder="N1000"
                          keyboardType="numeric"
                        />
                      </View>
                      <View 
                      className="mt-4"
                      style={{ width: "48%" }}>
                        <ControlledInput
                          name="expires"
                          label="Expires In"
                          description="EG: 0.5 = 30min, 1 = 1hr"
                          placeholder="0.5"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>

                    <Animated.View entering={FadeInUp.delay(600).springify()}>
                      <View style={styles.lastSection}>
                        <Text style={styles.label}>Add Photos</Text>
                        <Text style={styles.imageUploadSubtext}>
                                {images.length}/3 images added
                              </Text>
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
                        <Pressable
                          style={styles.imageUpload}
                          onPress={pickImage}
                          disabled={images.length >= 3}
                        >
                          <LinearGradient
                            colors={images.length >= 3 ? ["red", "red"] : ["#22C55E", "#4ADE80"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.imageUploadGradient}
                          >
                            <View style={styles.imageUploadContent}>
                              <Text style={styles.imageUploadText}>Upload</Text>
                              
                             <Ionicons
                                name={images.length >= 3 ? "close-circle" : "images"}
                                size={28}
                                color="#fff"
                              />
                              {/* <Text style={styles.imageUploadText}>
                                {images.length >= 3
                                  ? "Max 3 Images Reached"
                                  : "Upload Images"}
                              </Text> */}
                              
                            </View>
                          </LinearGradient>
                        </Pressable>

                        
                      </View>
                    </Animated.View>

                    <Button
                                            style={styles.submitButton}
                                            onPress={() => onSubmit()}
                                            disabled={loading}
                                            opacity={loading ? 0.6 : 1}
                                          >
                                            <LoadingChildren loading={loading}>
                        Pay & Submit Task
                      </LoadingChildren>
                    </Button> 
                  </FormProvider>
                </View>
              </KeyboardAwareScrollView>
            </ScrollView>
          </YStack>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
    padding: 16,
  },
  errorText: {
    fontSize: 14,
    color: "#D5A247",
    backgroundColor: "#EEDD97",
    padding: 8,
    borderRadius: 5,
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
    marginTop: 10,
    elevation: 5,
    width: "35%",
    alignSelf:"flex-end"
    
  },
  imageUploadGradient: {
    padding: 10,
  },
  imageUploadContent: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
    
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    // marginTop: 12,
  },
  imageUploadSubtext: {
    fontSize: 12,
    color: "BLACK",
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
  closeButton2: {
    // position: "absolute",
    // top: 8,
    // right: 10,
    // paddingHorizontal: 12,
    height: 32,
    width: "30%",
    borderRadius: 16,
    backgroundColor: "#DBCBCB",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
  },
  submitButton: {
    height: 56,
    backgroundColor: "#22c55e",
    width: "100%",
    marginTop: 6,
  },
});
