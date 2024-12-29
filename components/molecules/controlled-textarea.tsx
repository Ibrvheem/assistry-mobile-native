import React from "react";
import { Text, View } from "react-native";
import { useFormContext, Controller } from "react-hook-form"; // Using Controller to handle form registration
import { TextArea, Label } from "tamagui";

interface ControlledTextAreaProps {
  name: string;
  placeholder: string;
  label: string;
  className?: string;
  disabled?: boolean;
  rows?: number; // Optional rows for text area height
}

const ControlledTextArea = ({
  name,
  placeholder,
  label,
  className,
  disabled = false,
  rows = 4,
}: ControlledTextAreaProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext(); // Access control and errors from context

  return (
    <View>
      <Text
        className="font-bold py-2 text-lg text-[#1C332B]"
        style={{ fontFamily: "PoppinsBold" }}
      >
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextArea
            value={value} // Bind value
            onChangeText={onChange} // Bind onChange handler
            onBlur={onBlur} // Bind onBlur handler
            borderWidth={2}
            rows={rows} // Set rows for height
            multiline={true} // Enable multiline input
            style={{ fontFamily: "PoppinsBold" }}
            className={`w-full mb-1 h-36 text-lg tracking-wider ${disabled && "bg-gray-100 text-gray-400 border-gray-300"} ${className}`}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 mb-2 font-bold">
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default ControlledTextArea;
