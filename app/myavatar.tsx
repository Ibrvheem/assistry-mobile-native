import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import Colors from "@/constants/Colors";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { fetchAvatar } from "./services";
import { useGobalStoreContext } from "@/store/global-context";
import { cloudinaryUrl } from "@/lib/helpers";
// import { Notification} from "lucide-react-native"
import { BellDot } from "lucide-react-native";

const queryClient = new QueryClient();

export function MyAvatar({
  size = 40,
  showGreeting = false,
}: {
  size?: number;
  showGreeting?: boolean;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["avatar"],
    queryFn: fetchAvatar,
  });
  const { userData } = useGobalStoreContext();
 
  // // // console.log(userData);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text style={{ color: "red" }}>
          Failed to load avatar. Please try again.
        </Text>
      </View>
    );
  }

  if (data) {
    return (
  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
      <Image
        source={{
          uri: userData?.profile_picture
            ? cloudinaryUrl(userData.profile_picture)
            : data.url,
        }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        resizeMode="cover"
      />
      {showGreeting && (
        <Text style={{ fontWeight: "500", color: Colors.brand.text }}>Hi, {userData?.first_name}</Text>
      )}
    </View>

    {/* <BellDot /> */}
  </View>
);

  }

  return null;
}
