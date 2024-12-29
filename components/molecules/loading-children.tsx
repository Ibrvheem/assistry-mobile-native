import { Text, View } from "react-native";
import { Spinner } from "tamagui";

export default function LoadingChildren({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <View className="flex flex-row justify-center items-center">
      {loading && (
        <Spinner color={"white"} className="text-red-400 m-auto mr-2" />
      )}{" "}
      <Text
        className="font-bold text-white text-base"
        style={{ fontFamily: "PoppinsBold" }}
      >
        {children}
      </Text>
    </View>
  );
}
