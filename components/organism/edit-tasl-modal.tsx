


// components/organism/edit-task-modal.tsx
import React, { useEffect, Dispatch, SetStateAction } from "react";
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ControlledInput from "@/components/molecules/controlled-input";
import ControlledTextArea from "@/components/molecules/controlled-textarea";
import LoadingChildren from "@/components/molecules/loading-children";
import { useUpdateTask } from "@/app/hooks/useUpdateTask";
import { TaskSchema } from "../../app/(dashboard)/types";
import { X } from "lucide-react-native";

interface EditTaskModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  task: TaskSchema;
}

export default function EditTaskModal({
  open,
  setOpen,
  task,
}: EditTaskModalProps) {
  const { onSubmit, loading, error, images, setImages, methods } =
    useUpdateTask({
      setOpen,
      taskId: task._id,
      task
    });

  // Preload existing values
  // useEffect(() => {
  //   methods.reset({
  //     task: task?.task ?? "",
  //     description: task?.description ?? "",
  //     location: task?.location ?? "",
  //     incentive: (task?.incentive?/100).toString() ?? "",
  //     expires: task?.expires?.toString() ?? "",
  //   });
  // }, [task, methods]);

  useEffect(() => {
  // if no task, reset to empty values
  if (!task) {
    methods.reset({
      task: "",
      description: "",
      location: "",
      incentive: "",
      expires: "",
    });
    return;
  }

  const incentive =
    typeof task.incentive === "number" ? String(task.incentive / 100) : "";

  const expires = task.expires != null ? String(task.expires) : "";

  methods.reset({
    task: task.task ?? "",
    description: task.description ?? "",
    location: task.location ?? "",
    incentive,
    expires,
  });
  // include methods.reset to satisfy hooks linting; methods object itself can cause reruns
}, [task, methods.reset]);


  // preload existing images
  useEffect(() => {
    if (task?.assets?.length) {
      // console.log("Preloading images:", task.assets.map((a) => a.url));
      setImages(task.assets.map((a) => a.url.replace("auto/upload", "image/upload")));
    }
  }, [task, setImages]);

  const pickImage = async (): Promise<void> => {
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

  const removeImage = (index: number): void => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
  <Modal visible={open} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <YStack space>
          <View style={styles.editHeader}>
            <Text style={styles.editText}>Edit Task</Text>
            <Pressable onPress={() => setOpen(false)}>
              <X size={28} color="red" strokeWidth={3} />
            </Pressable>
          </View>

          {/* ✅ Use a single KeyboardAwareScrollView instead of nesting */}
          <KeyboardAwareScrollView
            enableOnAndroid
            keyboardShouldPersistTaps="handled"
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 80, // 👈 ensures Save button is scrollable into view
            }}
          >
            <View style={{ backgroundColor: "white" }}>

              {error && (
  <Text style={styles.errorText}>
    {typeof error === "string" ? error : String(error)}
  </Text>
)}


              

              <FormProvider {...methods}>
                <View className="mt-7">
                  <ControlledInput
                    name="task"
                    label="What’s the task?"
                    placeholder="e.g., Buy groceries"
                  />
                </View>

                <View className="mt-4">
                  <ControlledTextArea
                    rows={8}
                    name="description"
                    label="Description"
                    placeholder="Describe the task"
                  />
                </View>

                <View className="mt-4">
                  <ControlledInput
                    name="location"
                    label="Location"
                    placeholder="Enter task location"
                  />
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View className="mt-4" style={{ width: "48%" }}>
                    <ControlledInput
                      name="incentive"
                      label="Reward"
                      placeholder="N1000"
                      keyboardType="numeric"
                    />
                  </View>
                  <View className="mt-4" style={{ width: "48%" }}>
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
                    <Text style={styles.label}>Task Photos</Text>
                    <Text style={styles.imageUploadSubtext}>
                      {images.length}/3 images
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
                        colors={
                          images.length >= 3
                            ? ["#DC2626", "#EF4444"]
                            : ["#22C55E", "#4ADE80"]
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.imageUploadGradient}
                      >
                        <View style={styles.imageUploadContent}>
                          <Text style={styles.imageUploadText}>Upload</Text>
                          <Ionicons
                            name={
                              images.length >= 3 ? "close-circle" : "images"
                            }
                            size={28}
                            color="#fff"
                          />
                        </View>
                      </LinearGradient>
                    </Pressable>
                  </View>
                </Animated.View>

                {/* ✅ Always scrollable to this point */}
                <Button
                  style={styles.submitButton}
                  onPress={methods.handleSubmit(onSubmit)}
                  disabled={loading}
                  opacity={loading ? 0.6 : 1}
                >
                
                  <LoadingChildren loading={loading}>
                    Save Changes
                  </LoadingChildren>
                </Button>

              </FormProvider>
            </View>
          </KeyboardAwareScrollView>
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
  editHeader:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  editText:{
    fontSize:26,
    fontWeight:'700',},
  closeButton: {
    height: 32,
    width: "30%",
    borderRadius: 16,
    backgroundColor: "#DBCBCB",
    alignItems: "center",
    justifyContent: "center",
    // alignSelf: "flex-end",
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
  imageUploadSubtext: {
    fontSize: 12,
    color: "black",
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
  imageUpload: {
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
    elevation: 5,
    width: "35%",
    alignSelf: "flex-end",
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
  },
  submitButton: {
    height: 56,
    backgroundColor: "#22c55e",
    width: "100%",
  },
});

