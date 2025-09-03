import React from "react";
import {
  View,
  Text,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useFormContext, Controller } from "react-hook-form";
import { TextArea } from "tamagui";

interface ControlledTextAreaProps {
  name: string;
  placeholder: string;
  label?: string;
  description?: string;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  rows?: number; // optional number of rows
}

const ControlledTextArea = ({
  name,
  placeholder,
  label,
  description,
  containerStyle,
  inputStyle,
  disabled = false,
  rows = 4,
}: ControlledTextAreaProps) => {
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
            color: "#1C332B",
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
          <TextArea
            value={value ?? ""} // ✅ default empty string
            onChangeText={onChange} // ✅ consistent handler
            onBlur={onBlur}
            placeholder={placeholder}
            editable={!disabled} // ✅ matches Input
            // borderWidth={2}
            rows={rows}
              borderRadius={8}      // rounded corners
  borderWidth={1}       // 1px border
  borderColor="#000"    // visible border
  fontSize={13}         // text-lg equivalent
  opacity={1}
            multiline
            style={[{  fontFamily: "ReadexPro" , fontSize: 16 }, inputStyle]}
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

export default ControlledTextArea;
