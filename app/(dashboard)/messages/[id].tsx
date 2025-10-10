// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { io } from "socket.io-client";
// import { Input, Separator } from "tamagui";
// import { PaperAirplaneIcon } from "react-native-heroicons/outline/tsx";
// import { Avatar } from "@/app/avatar";
// import { useGobalStoreContext } from "@/store/global-context";
// import { router, useLocalSearchParams } from "expo-router";
// import dayjs from "dayjs";
// import { getContact } from "@/app/(auth)/services";
// import { useQuery } from "@tanstack/react-query";

// const SOCKET_URL = "https://ea0f-197-210-53-14.ngrok-free.app";

// const MessageDetail = () => {
//   const { id } = useLocalSearchParams() as { id: string };
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState("");
//   const flatListRef = useRef<FlatList>(null);
//   const socketRef = useRef(null);
//   const { userData } = useGobalStoreContext();
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["users"],
//     queryFn: () => getContact(id),
//   });

//   if (!id) {
//     router.push("/(dashboard)");
//     return null;
//   }

//   useEffect(() => {
//     const socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       withCredentials: true,
//     });

//     socketRef.current = socket;

//     socket.on("receiveMessage", (newMessage) => {
//       if (newMessage.senderId !== userData.id) {
//         setMessages((prev) => [...prev, newMessage]);
//       }
//     });

//     socket.emit("getChatHistory", { user1: userData.id, user2: id });

//     socket.on("chatHistory", (history) => {
//       setMessages(history);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [id, userData.id]);

//   const sendMessage = () => {
//     if (!message.trim()) return;

//     const newMessage = {
//       message,
//       senderId: userData.id,
//       receiverId: id,
//       createdAt: new Date().toISOString(),
//     };

//     setMessages((prev) => [...prev, newMessage]);
//     socketRef.current?.emit("sendMessage", newMessage);
//     setMessage("");
//   };

//   const renderMessages = () => {
//     let lastDate = null;

//     return messages.map((item, index) => {
//       const messageDate = dayjs(item.createdAt);
//       const showDate = !lastDate || !dayjs(lastDate).isSame(messageDate, "day");
//       lastDate = item.createdAt;

//       return (
//         <View key={index}>
//           {showDate && (
//             <View className="flex items-center my-3">
//               <Text className="bg-gray-300 px-4 py-2 rounded-full text-gray-700 text-xs font-semibold">
//                 {messageDate.format("MMMM D, YYYY")}
//               </Text>
//             </View>
//           )}

//           <View
//             className={`max-w-[80%] mb-3 p-4 rounded-xl shadow-lg ${
//               item.senderId === userData.id
//                 ? "from-green-400 rounded-br-none"
//                 : "from-gray-200  rounded-bl-none"
//             }`}
//           >
//             <Text
//               className={
//                 item.senderId === userData.id
//                   ? "text-white text-base"
//                   : "text-gray-900 text-base"
//               }
//             >
//               {item.message}
//             </Text>
//           </View>
//         </View>
//       );
//     });
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-100">
//       <KeyboardAvoidingView
//         className="flex-1"
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//       >
//         <View className="flex-1 px-5 py-4">
//           {/* User Info */}
//           <View className="items-center mb-4">
//             <Avatar size={70} />
//             <Text className="text-2xl font-semibold text-gray-800 mt-2">
//               {data?.first_name} {data?.last_name}
//             </Text>
//             <Text className="text-sm text-gray-500">{data?.email}</Text>
//             <Separator />
//           </View>

//           {/* Messages */}
//           <FlatList
//             ref={flatListRef}
//             data={[{}]}
//             keyExtractor={() => "dummy"}
//             renderItem={renderMessages}
//             contentContainerStyle={{ flexGrow: 1, paddingVertical: 10 }}
//             showsVerticalScrollIndicator={false}
//             onContentSizeChange={() =>
//               flatListRef.current?.scrollToEnd({ animated: true })
//             }
//           />

//           {/* Input Field */}
//           <View className="flex-row items-center p-4 border-t border-gray-200 bg-white shadow-md rounded-2xl">
//             <Input
//               className="flex-1 px-4 py-3 bg-gray-100 rounded-full border border-gray-300 text-gray-800"
//               placeholder="Type a message..."
//               value={message}
//               onChangeText={setMessage}
//             />
//             <TouchableOpacity
//               className="h-12 w-12 bg-green-600 rounded-full flex items-center justify-center ml-3 shadow-lg"
//               onPress={sendMessage}
//             >
//               <PaperAirplaneIcon size={24} color="white" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default MessageDetail;
