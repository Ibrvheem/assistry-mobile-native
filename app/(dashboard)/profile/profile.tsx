// import { View } from "@/components/Themed";
// import React from "react";
// import { SafeAreaView, ScrollView, Text, TouchableOpacity } from "react-native";
// import { Avatar } from "../../avatar";
// import { Button, Separator } from "tamagui";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// // import {
// //   ArrowLeftIcon,
// //   ArrowRightIcon,
// //   BanknotesIcon,
// //   ChatBubbleOvalLeftIcon,
// //   DocumentIcon,
// //   ExclamationCircleIcon,
// //   UserMinusIcon,
// // } from "react-native-heroicons/outline/tsx";

// import {
//   ArrowLeft,
//   ArrowRight,
//   CreditCard,       // closest to CreditCard
//   MessageCircle,    // closest to MessageCircle
//   File,             // closest to DocumentIcon
//   AlertCircle,      // closest to ExclamationCircleIcon
//   UserMinus,
// } from 'lucide-react-native';

// import { router, useRouter } from "expo-router";
// import { useGobalStoreContext } from "@/store/global-context";

// export default function ProfilePage() {
//   const { replace } = useRouter();
//   const { userData } = useGobalStoreContext();
//   return (
//     <ScrollView className="flex-1 bg-white">
//       <SafeAreaView className="bg-white">
//         <View 
//         className="bg-white flex items-center mt-12"
//         style={{ backgroundColor:"white" }}
//         >
//           {userData?.profile_picture ? (
//                         <Image
//                           source={{
//               uri: userData?.profile_picture?.startsWith('http')
//                 ? userData?.profile_picture
//                 : `https://res.cloudinary.com/<your-cloud-name>/image/upload/${user.profile_picture}`,
//             }}
//                           style={styles.profileImage}
//                           contentFit="cover"
//                           transition={200}
//                         />
//                       ) : (
//                         <Avatar size={100} />
//                       )}
//           {/* <Avatar size={100} /> */}
//           <Text>{userData?.first_name}</Text>
//           <Text
//             className="text-slate-600 text-xs"
//             style={{ fontFamily: "poppins" }}
//           >
//             {userData?.email}
//           </Text>
//           <Button className="rounded-3xl bg-black !text-white font-semibold text-sm mt-2"
//           style={{ fontFamily: "poppins", color: "white", fontWeight: "600", fontSize: 14, backgroundColor: "black", marginTop: 8 }} 
//           onPress={() => {
//                             router.push("/(dashboard)/profile/edit");
//                           }}>
//             <Text
//               className="text-white font-semibold"
//               style={{ fontFamily: "poppins", color: "white", fontWeight: "600", fontSize: 14 }}
//             >
//               Edit profile
//             </Text>
//           </Button>
//         </View>

//         <View className="bg-white px-6 mt-6 space-y-2"
//          style={{ backgroundColor:"white" }}>
//           {/* <Text
//             className="text-sm text-slate-600"
//             style={{ fontFamily: "poppins" }}
//           >
//             User
//           </Text> */}
//           <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4" 
//           style={{ backgroundColor:"#dbf0dd" }}>
//             <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400"
//             onPress={() => {
//                             router.push("/(dashboard)/tasks");
//                           }}>
            
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <File color={"gray"} size={20} />
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Task History
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center"
//             onPress={() => {
//                             router.push("/(dashboard)/transactions");
//                           }}>
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <CreditCard color={"gray"} size={20} />
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Transaction History
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View className="bg-white px-6 mt-6 space-y-2"
//          style={{ backgroundColor:"white" }}>
//           {/* <Text
//             className="text-sm text-slate-600"
//             style={{ fontFamily: "poppins" }}
//           >
//             Contact Support
//           </Text> */}
//           <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4"
//           style={{ backgroundColor:"#dbf0dd" }}>
//             <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400">
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <AlertCircle color={"gray"} size={20} />
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Report Fraud Activity
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center">
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <MessageCircle color={"gray"} size={20} />{" "}
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Support Center
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//         <View className="bg-white px-6 mt-6 space-y-2"
//          style={{ backgroundColor:"white" }}>
//           {/* <Text
//             className="text-sm text-slate-600"
//             style={{ fontFamily: "poppins" }}
//           >
//             Account
//           </Text> */}
//           <View className="bg-gray-100 rounded-2xl border border-gray-300 p-2 px-4" 
//           style={{ backgroundColor:"#dbf0dd" }}>
//             <TouchableOpacity
//               className="bg-transparent py-2 flex flex-row gap-2 items-center border-b-[0.2px] border-gray-400"
//               onPress={() => {
//                 const handleLogout = async () => {
//                   try {
//                     await AsyncStorage.removeItem("token");
//                     replace("/(auth)/signin");
//                   } catch (error) {
//                     console.error("Error removing token:", error);
//                   }
//                 };

//                 handleLogout();
//               }}
//             >
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <AlertCircle color={"gray"} size={20} />
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Log Out
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>

//             <TouchableOpacity className="bg-transparent py-2 flex flex-row gap-2 items-center">
//               <View className="flex items-center justify-center w-10 h-10 p-1 bg-white rounded-xl border border-gray-300" style={{ backgroundColor:"transparent" }}>
//                 <UserMinus color={"gray"} size={20} />
//               </View>
//               <Text className="" style={{ fontFamily: "poppins" }}>
//                 Delete Account
//               </Text>
//               <View className="flex-1 flex items-end bg-transparent" style={{ backgroundColor:"transparent" }}>
//                 <ArrowRight color={"gray"} size={20} />
//               </View>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </SafeAreaView>
//     </ScrollView>
//   );
// }


import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
// import { Button } from "@/components/ui/button";
import { Button, Separator } from "tamagui";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ArrowRight,
  CreditCard,
  MessageCircle,
  File,
  AlertCircle,
  UserMinus,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useGobalStoreContext } from "@/store/global-context";
// import { Avatar } from "@/components/avatar";
import { useFocusEffect } from "@react-navigation/native";
import { Avatar } from "../../avatar";
import { cloudinaryUrl } from "@/lib/helpers";

export default function ProfilePage(): JSX.Element {
   const router = useRouter();
  const { userData, refreshUser } = useGobalStoreContext();

  useFocusEffect(
    useCallback(() => {
      refreshUser?.();
    }, [refreshUser])
  );

  const { replace } = router;

  // 🧠 Logout handler
  const handleLogout = useCallback(async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("token");
      replace("/(auth)/signin");
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }, [replace]);

  // 🖼️ Helper for Cloudinary URLs
  // const cloudinaryUrl = (path?: string): string | undefined => {
  //   if (!path) return undefined;
  //   if (path.startsWith("http")) return path;
  //   return `https://res.cloudinary.com/<your-cloud-name>/image/upload/${path}`;
  // };

  return (
    <ScrollView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* ===== Profile Header ===== */}
        <View style={styles.profileHeader}>
          {userData?.profile_picture ? (
            <Image
              source={{ uri: cloudinaryUrl(userData.profile_picture) }}
              style={styles.profileImage}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Avatar size={100} />
          )}

          <Text style={styles.name}>{userData?.first_name}</Text>
          <Text style={styles.email}>{userData?.email}</Text>

          <Button
            className="rounded-3xl"
            style={styles.editButton}
            onPress={() => router.push("/(dashboard)/profile/edit")}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Button>
        </View>

        {/* ===== Task + Transaction Section ===== */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardRow}
              onPress={() => router.push("/(dashboard)/tasks")}
            >
              <View style={styles.iconWrapper}>
                <File color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Task History</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cardRow, styles.noBorder]}
              onPress={() => router.push("/(dashboard)/transactions")}
            >
              <View style={styles.iconWrapper}>
                <CreditCard color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Transaction History</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Support Section ===== */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardRow}>
              <View style={styles.iconWrapper}>
                <AlertCircle color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Report Fraud Activity</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cardRow, styles.noBorder]}>
              <View style={styles.iconWrapper}>
                <MessageCircle color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Support Center</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ===== Account Section ===== */}
        <View style={styles.section}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.cardRow} onPress={handleLogout}>
              <View style={styles.iconWrapper}>
                <AlertCircle color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Log Out</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cardRow, styles.noBorder]}>
              <View style={styles.iconWrapper}>
                <UserMinus color={"gray"} size={20} />
              </View>
              <Text style={styles.rowText}>Delete Account</Text>
              <View style={styles.arrowWrapper}>
                <ArrowRight color={"gray"} size={20} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 48,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  email: {
    color: "#555",
    fontSize: 13,
    fontFamily: "poppins",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "poppins",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#dbf0dd",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#bbb",
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "poppins",
    color: "#000",
  },
  arrowWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
});
