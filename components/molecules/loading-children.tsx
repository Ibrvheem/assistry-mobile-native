import { Text, View } from "react-native";
import { Spinner } from "tamagui";

export default function LoadingChildren({
  loading,
  children,
  textColor = "white",
}: {
  loading: boolean;
  children: React.ReactNode;
  textColor?: string;
}) {
  return (
    <View className="flex flex-row justify-center items-center">
      {loading && (
        <Spinner color={"white"} className="text-red-400 m-auto mr-2" />
      )}{" "}
      <Text
        className={`font-bold text-white text-base`}
        style={{ fontFamily: "PoppinsBold", color: `${textColor}` }}
      >
        {children}
      </Text>
    </View>
  );
}
