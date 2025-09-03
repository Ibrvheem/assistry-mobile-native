import { View, Text, SafeAreaView, Image, ImageBackground, LogBox, TextInputProps,
  StyleProp, TextStyle, ViewStyle, TextInput, StyleSheet, Pressable,
  KeyboardAvoidingView, Platform, Keyboard,Animated // <-- add import
} from "react-native";
import React from "react";
import { Button, Input, Spinner } from "tamagui";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
// import ControlledInput from "@/components/molecules/controlled-input";
import { FormProvider, useForm ,Controller, useFormContext} from "react-hook-form";
import { getStudentData } from "./services";
import { useMutation } from "@tanstack/react-query";
import { useGobalStoreContext } from "@/store/global-context";
import { useConfirmRegistrationNo } from "./hooks/useConfirmRegistrationNo";
import LoadingChildren from "@/components/molecules/loading-children";

import { useState, useEffect, useRef } from 'react';

type FormValues = { reg_no: string };

type ControlledInputProps = TextInputProps & {
  name: keyof FormValues | string;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<TextStyle>;
};


const ControlledInput: React.FC<ControlledInputProps> = ({
  name,
  containerStyle,
  style,
  ...props
}) => {
  const { control } = useFormContext<FormValues>();

  return (
    <Controller
      control={control}
      name={name as keyof FormValues}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View style={containerStyle}>
          <TextInput
            value={(value as string) ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholderTextColor="#9CA3AF"
            style={[styles.input, error && styles.inputError, style]} // ✅ styles works here
            {...props}
          />
          {error?.message ? <Text style={styles.errorText}>{error.message}</Text> : null}
        </View>
      )}
    />
  );
};

export default function SignInPage() {
  const navigation = useNavigation();
  const { studentData, setStudentData } = useGobalStoreContext();

  const handlePress = () => {
    router.push("/(auth)/confirm-number");
  };
  const { methods, onSubmit, error, loading } = useConfirmRegistrationNo();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const bgHeight = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    Animated.timing(bgHeight, {
      toValue: keyboardVisible ? 0.4 : 0.6,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [keyboardVisible]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={keyboardVisible ? (Platform.OS === "ios" ? "padding" : "height") : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
        {/* <SafeAreaView> */}
         {/* Background photo */}
        <Animated.View
      style={{
        width: "100%",
        height: bgHeight.interpolate({
          inputRange: [0, 1],
          outputRange: ["0%", "100%"],
        }),
        borderRadius: 12,
        overflow: "hidden",
        // marginTop: 24,
      }}
    >
        <ImageBackground
          source={require("../../assets/logos/bck.png")} // your photo
          // className="w-full h-3/5 rounded-md overflow-hidden mt-6"
          // resizeMode="cover"

          style={{ flex: 1 }}
          resizeMode="cover"
        >

          <View style={{marginTop:50, marginLeft:16}}>
                                <Image
                                  source={require("../../assets/logos/image.png")}
                                  style={{ width: 50, height: 50}}
                                  className="rounded-md"
                                />
                   </View>

          <View className="absolute right-4 flex-row items-center"
          style={{marginTop:50}}>
            <View className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/udus.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ marginLeft: -10 }} className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/abu.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>

            <View style={{ marginLeft: -10 }} className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/buk.jpg")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>
          </View>
        </ImageBackground>
        </Animated.View>
        {/* <View className="mt-6">
          <Image
                source={require("../../assets/logos/Frame 4.png")}
                // style={{ width: 300, height: 400 }}
                className="rounded-md"
              />
        </View> */}
        <View className="p-4">
          <View className="space-y-4">
            {/* <View className="flex flex-row items-center gap-2 w-full">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 50, height: 50 }}
                className="rounded-md"
              />
            </View> */}
            <View className="space-y-2">
              <View style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center" }}>
                <Text
                  style={{
                    fontFamily: "Lato",
                    fontWeight: "700",
                    fontSize: 26,
                    lineHeight: 26,
                    color: "#1C332B",
                  }}
                >
                  Welcome To{" "}
                </Text>

                <View
                  style={{
                    backgroundColor: "#091D17",
                    borderRadius: 12,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "#DFF0DF",
                      fontSize: 28,
                      fontFamily: "Lato",
                      fontWeight: "700",
                    }}
                  >
                    Assistry !
                  </Text>
                </View>
              </View>
              </View>
              <Text
                className="text-[#036924]"
                style={{
                    fontFamily: "Lato",
                    fontWeight: "600",
                    fontSize: 16,
                    lineHeight: 16,
                    marginTop: 10,
                    color: "#1C332B",
                    textAlign:'center',
                    fontStyle:'italic'
                  }}
              >
                Your all in one campus solutions
              </Text>
              

            </View>
          </View>
          <FormProvider {...methods}>
            {" "}
            {/* Provide the form context */}
            <View className="mt-5 w-full">
              
              <Text 
                className="mt-0 mb-2 text-[#1C332B]"
                style={{
                  fontFamily: "Lato",
                  fontWeight: "600",
                  fontSize: 16,
                  lineHeight: 20,
                  fontStyle: "italic",         // centers text horizontally
                  letterSpacing: 0.5,           // slight spacing for readability
                  color: "#1C332B",             // keeps brand color
                  opacity: 0.8,              // softer look
                }}
              >
                Kindly input Your REG NO to get verified..
              </Text>
              <ControlledInput
                name="reg_no"
                placeholder="CST/18/IFT/00111"
                placeholderTextColor="#9CA3AF"  
              />
              {error && (
                <Text
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-sm  text-[#f85959]"
                >
                  {error.toString()}
                </Text>
              )}
              <View className="flex-row justify-end mt-2">
              <Button
                style={styles.veify}
                className={"mt-2 h-10 bg-green-500 w-1/4"}
                onPress={() => onSubmit()}
              >
                <LoadingChildren loading={loading}>
                  Verify
                </LoadingChildren>
              </Button>
              </View>
              <Text className="mt-2">
                Have an account?{" "}
                <Text
                  onPress={() => {
                    router.push("/(auth)/signin");
                  }}
                  style={{ fontFamily: "PoppinsBold" }}
                  className="text-green-500 underline"
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </FormProvider>
        </View>
      {/* </SafeAreaView> */}
    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1C332B",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    color: "#EF4444",
    marginTop: 4,
    fontSize: 12,
  },
  veify:{
    fontFamily: "PoppinsBold", color: "white", backgroundColor:'green'
  }
});


