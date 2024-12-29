import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { useDropzone } from "react-dropzone";

interface ControlledDropzoneProps {
  name: string;
  label: string;
}

const ControlledDropzone = ({ name, label }: ControlledDropzoneProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange } }) => {
          const { getRootProps, getInputProps, isDragActive } = useDropzone({
            onDrop: (acceptedFiles: any) => {
              onChange(acceptedFiles); // Update form state with selected files
            },
          });

          return (
            <View
              {...getRootProps()}
              style={[
                styles.dropzone,
                isDragActive ? styles.activeDropzone : styles.inactiveDropzone,
              ]}
            >
              <input {...getInputProps()} />
              <Text style={styles.dropzoneText}>
                {isDragActive
                  ? "Drop the files here..."
                  : "Drag & drop files here, or click to select"}
              </Text>
            </View>
          );
        }}
      />
      {errors[name] && (
        <Text style={styles.errorText}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    paddingBottom: 8,
    fontSize: 16,
    color: "#1C332B",
  },
  dropzone: {
    height: 128,
    borderWidth: 2,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
  },
  activeDropzone: {
    borderColor: "#22C55E", // green
    backgroundColor: "#ECFDF5", // light green
  },
  inactiveDropzone: {
    borderColor: "#D1D5DB", // gray
    backgroundColor: "#F3F4F6", // light gray
  },
  dropzoneText: {
    color: "#6B7280", // gray-500
  },
  errorText: {
    color: "#EF4444", // red
    marginTop: 4,
  },
});

export default ControlledDropzone;
