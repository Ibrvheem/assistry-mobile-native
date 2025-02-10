import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { io } from "socket.io-client";
import { Input, Separator } from "tamagui";
import { PaperAirplaneIcon } from "react-native-heroicons/outline";
import { Avatar } from "@/app/avatar";
import { useGobalStoreContext } from "@/store/global-context"; // Fixed typo
import { router, useLocalSearchParams } from "expo-router";
import dayjs from "dayjs";

const SOCKET_URL = "https://bc38-197-210-53-228.ngrok-free.app";

const MessageDetail = () => {
  const { id } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);
  const socketRef = useRef(null);
  const { userData } = useGobalStoreContext(); // Fixed typo

  if (!id) {
    router.push("/(dashboard)");
    return null;
  }

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current = socket;

    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.senderId !== userData.id) {
        // Prevent duplicate for own messages
        setMessages((prev) => [...prev, newMessage]);
      }
    });

    // Fetch chat history when component mounts
    socket.emit("getChatHistory", { user1: userData.id, user2: id });

    socket.on("chatHistory", (history) => {
      setMessages(history);
    });

    return () => {
      socket.disconnect();
    };
  }, [id, userData.id]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      message,
      senderId: userData.id,
      receiverId: id,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]); // Optimistic update
    socketRef.current?.emit("sendMessage", newMessage); // Send to server
    setMessage(""); // Clear input
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="flex-1 px-6">
          {/* Header */}
          <View className="items-center mt-4">
            <Avatar size={70} />
            <Text className="text-lg">Musa Lawan</Text>
            <Text className="text-sm text-gray-500">
              musalawan@assistry.com
            </Text>
            <Separator />
          </View>

          {/* Messages List */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View
                className={`w-[70%] mb-2 p-2 rounded-xl ${
                  item.senderId === userData.id
                    ? "bg-indigo-500 ml-auto rounded-br-none"
                    : "bg-pink-500 rounded-bl-none"
                }`}
              >
                <Text className="text-white">{item.message}</Text>
                <Text className="text-white text-xs">
                  {dayjs(item.createdAt).format("H:mma")}
                </Text>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Chat Input */}
          <View className="flex-row items-center p-2 border-t border-gray-200 bg-white">
            <Input
              className="flex-1 px-3 py-2 bg-gray-100 rounded-full"
              placeholder="Type message"
              value={message}
              onChangeText={setMessage}
            />
            <TouchableOpacity
              className="h-10 w-10 bg-indigo-500 rounded-full flex items-center justify-center ml-2"
              onPress={sendMessage}
            >
              <PaperAirplaneIcon size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageDetail;
