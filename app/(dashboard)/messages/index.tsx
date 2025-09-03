// import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
// import React from "react";
// import { Separator } from "tamagui";
// import { Avatar } from "@/app/avatar";
// import { Link } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import { getUsers } from "../services";
// import { useGobalStoreContext } from "@/store/global-context";

// export default function Messages() {
//   const { data, isLoading, error } = useQuery({
//     queryKey: ["users"],
//     queryFn: getUsers,
//   });
//   const { userData } = useGobalStoreContext();

//   console.log("Fetched data:", data, userData.id);

//   return (
//     <View className="flex-1 bg-white p-6">
//       <SafeAreaView className="space-y-2">
//         {data?.map((user) => (
//           <Link
//             className="py-2"
//             key={user._id}
//             href={{
//               pathname: "/messages/[id]",
//               params: { id: user._id },
//             }}
//             asChild
//           >
//             <TouchableOpacity className="flex flex-row w-full space-x-2 items-center hover:bg-slate-300">
//               <View className="relative">
//                 <Avatar size={50} />
//                 {/* Dummy unreadCount check */}
//                 {user.status === "otp_verified" && (
//                   <View className="h-3 w-3 rounded-full absolute bottom-2.5 border border-white right-0 bg-green-400"></View>
//                 )}
//               </View>
//               <View className="text-ellipsis flex-1">
//                 <View className="flex flex-row justify-between">
//                   <View className="flex flex-row gap-1">
//                     <Text className="" style={{ fontFamily: "poppins" }}>
//                       {user._id !== userData?.id
//                         ? user.first_name + " " + user.last_name
//                         : "You"}
//                     </Text>
//                   </View>
//                   <Text className="text-xs text-gray-500">
//                     {new Date(user.created_at).toLocaleDateString()}
//                   </Text>
//                 </View>
//                 <Text className="w-30 text-sm text-gray-600">{user.email}</Text>
//               </View>
//             </TouchableOpacity>
//           </Link>
//         ))}
//       </SafeAreaView>
//     </View>
//   );
// }
