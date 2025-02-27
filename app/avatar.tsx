import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { fetchAvatar } from "./services";
import { useGobalStoreContext } from "@/store/global-context";

const queryClient = new QueryClient();

export function Avatar({
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
  console.log(userData);

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
      <View className="flex items-center flex-row gap-2">
        <Image
          source={{ uri: data.url }}
          style={{
            width: size,
            height: size,
            borderRadius: 0,
            marginBottom: 10,
          }}
          resizeMode="cover"
        />
        {showGreeting && (
          <Text className="font-medium">Hi, {userData?.first_name}</Text>
        )}
      </View>
    );
  }

  return null;
}
