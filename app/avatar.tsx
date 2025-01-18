import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { Image, View, Text, ActivityIndicator } from "react-native";
import { fetchAvatar } from "./services";

const queryClient = new QueryClient();

export function Avatar() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["avatar"],
    queryFn: fetchAvatar,
  });

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
      <Image
        source={{ uri: data.url }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 0,
          marginBottom: 10,
        }}
        resizeMode="cover"
      />
    );
  }

  return null;
}
