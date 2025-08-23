import { View, Text, SafeAreaView, Image,ImageBackground, LogBox,  TextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
  TextInput,
  StyleSheet,
  Pressable, } from "react-native";
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

  return (
    <View className="bg-[#DFF0DF] bg-opacity-0 h-full">
      <SafeAreaView>
         {/* Background photo */}
        <ImageBackground
          source={require("../../assets/logos/bck.png")} // your photo
          className="w-full h-96 rounded-md overflow-hidden mt-6"
          resizeMode="cover"
        >
          {/* Left logo (top-left) */}
          <View className="absolute top-4 left-4">
            <View className="rounded-lg p-1 shadow">
              <Image
                source={require("../../assets/logos/image.png")}
                style={{ width: 48, height: 48 }} // tweak size
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Right logos cluster (top-right) */}
          <View className="absolute top-4 right-4 flex-row items-center">
            {/* first right logo */}
            <View className="bg-[#DFF0DF] bg-opacity-0 rounded-full p-1 mt-3">
              <Image
                source={require("../../assets/logos/udus.png")}
                style={{ width: 25, height: 25 }}
                resizeMode="contain"
              />
            </View>

            {/* overlapping logos: use negative margin to overlap */}
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
                className="text-[#1C332B]"
                style={{
                    fontFamily: "Lato",
                    fontWeight: "600",
                    fontSize: 16,
                    lineHeight: 16,
                    color: "#1C332B",
                    textAlign:'center'
                  }}
              >
                Your all in one campus solutions
              </Text>
              

            </View>
          </View>
          <FormProvider {...methods}>
            {" "}
            {/* Provide the form context */}
            <View className="mt-6 w-full">
              
              <Text 
                className="mt-2 mb-2 text-[#1C332B]"
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
                style={{ fontFamily: "PoppinsBold", color: "white"}}
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
      </SafeAreaView>
    </View>
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
});
