import React from "react";
import { View, Text, KeyboardTypeOptions, StyleProp, ViewStyle, TextStyle } from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "tamagui";

interface ControlledInputProps {
  name: string;
  placeholder: string;
  label?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  disabled?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

const ControlledInput = ({
  name,
  placeholder,
  label,
  description,
  containerStyle,
  inputStyle,
  secureTextEntry = false,
  disabled = false,
  keyboardType,
}: ControlledInputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <View style={containerStyle}>
      {label && (
        <Text
          style={{
            // fontFamily: "PoppinsBold",
            // fontSize: 14,
            color: "#2D2D2D",
            // paddingVertical: 8,
            marginBottom: 4,
            fontFamily: "ReadexPro-Medium", // must match the font you load in Expo
  fontWeight: "500",              // optional if you already have the Medium variant
  fontSize: 15,                   // no "px"
  lineHeight: 15,                 // 100% of font size → same as fontSize
  letterSpacing: 0, 
          }}
        >
          {label}
        </Text>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
  value={value ?? ""}
  onChange={(e) => onChange(e.nativeEvent.text)} // extract text
  onBlur={onBlur}
  placeholder={placeholder}
  editable={!disabled}
  secureTextEntry={secureTextEntry}
  keyboardType={keyboardType}
  h={56}                // matches Figma height
  borderRadius={8}      // rounded corners
  borderWidth={1}       // 1px border
  borderColor="#000"    // visible border
  fontSize={13}         // text-lg equivalent
  opacity={1}
  style={[{ fontFamily: "ReadexPro", fontSize:16 }, inputStyle]} // custom font + overrides
/>

        )}
      />

      {description && (
        <Text style={{ fontSize: 12, color: "#6B7280", fontWeight: "bold" }}>
          {description}
        </Text>
      )}

      {errors[name] && (
        <Text style={{ color: "red", marginBottom: 8, fontWeight: "bold" }}>
          {errors[name]?.message?.toString()}
        </Text>
      )}
    </View>
  );
};

export default ControlledInput;
