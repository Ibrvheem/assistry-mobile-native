import React from "react";
import { TextInput, Text, View, KeyboardTypeOptions } from "react-native";
import { useFormContext, Controller } from "react-hook-form"; // Using Controller to handle form registration
import { Input, Label } from "tamagui";

interface ControlledInputProps {
  name: string;
  placeholder: string;
  label: string;
  description?: string;
  className?: string;
  secureTextEntry?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const ControlledInput = ({
  name,
  placeholder,
  label,
  description,
  className,
  secureTextEntry = false,
  disabled = false,
  keyboardType,
}: ControlledInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
          <Input
            value={value} // Bind value
            onChangeText={onChange} // Bind onChange handler
            onBlur={onBlur} // Bind onBlur handler
            borderWidth={2}
            style={{ fontFamily: "PoppinsBold" }}
            className={`h-16 w-full mb-1 text-lg tracking-wider ${disabled && "bg-gray-100 text-gray-400 border-gray-300"} ${className}`}
            placeholder={placeholder}
            disabled={disabled}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
          />
        )}
      />
      {description && (
        <Text className="text-gray-500 text-xs font-bold">{description}</Text>
      )}

      {errors[name] && (
        <Text className="text-red-500 mb-2 font-bold">
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default ControlledInput;
