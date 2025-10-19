// import React from "react";
// import {
//   View,
//   Text,
//   SafeAreaView,
//   TouchableOpacity,
//   StyleSheet,
//   FlatList,
// } from "react-native";
// import { Image } from "expo-image";
// import { Link } from "expo-router";
// import { useQuery } from "@tanstack/react-query";
// import {
//   formatDistanceToNowStrict,
//   isToday,
//   isYesterday,
//   format,
// } from "date-fns";
// import { Avatar } from "@/app/avatar";
// import { getUsers } from "../services";
// import { useGobalStoreContext } from "@/store/global-context";
// import { cloudinaryUrl } from "@/lib/helpers";
// import { getMyChats } from "./services";

// interface User {
//   _id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   profile_picture?: string;
//   status?: string;
//   created_at: string;
//   lastMessage?: {
//     text: string;
//     created_at: string;
//     unreadCount?: number;
//   };
// }

// export default function Messages() {
//   const { userData } = useGobalStoreContext();

//   const { data: chats, isLoading, error } = useQuery<Chat[]>({
//     queryKey: ["chats"],
//     queryFn: getMyChats,
//   });

//   const formatMessageTime = (dateStr: string): string => {
//     const date = new Date(dateStr);
//     if (isToday(date)) return format(date, "h:mm a");
//     if (isYesterday(date)) return "Yesterday";
//     return formatDistanceToNowStrict(date, { addSuffix: true });
//   };

//   const renderUserItem = ({ item }: { item: User }) => {
//     const isCurrentUser = item._id === userData?._id;
//     const fullName = isCurrentUser ? "You" : `${item.first_name} ${item.last_name}`;
//     const lastMsg = item.lastMessage?.text || "Start a conversation...";
//     const unreadCount = item.lastMessage?.unreadCount || 8;

//     return (
//       <Link
//         key={item._id}
//         href={{ pathname: "/messages/[id]", params: { id: item._id } }}
//         asChild
//       >
//         <TouchableOpacity style={styles.chatRow}>
//           {/* Avatar */}
//           <View style={styles.avatarContainer}>
//             {item.profile_picture ? (
//               <Image
//                 source={{ uri: cloudinaryUrl(item.profile_picture) }}
//                 style={styles.profileImage}
//                 contentFit="cover"
//                 transition={200}
//               />
//             ) : (
//               <Avatar size={55} />
//             )}
//             {item.status === "otp_verified" && (
//               <View style={styles.onlineIndicator} />
//             )}
//           </View>

//           {/* Chat Info */}
//           <View style={styles.chatInfo}>
//             <View style={styles.chatHeader}>
//               <Text style={styles.userName}>{fullName}</Text>
//               <Text style={styles.messageTime}>
//                 {item.lastMessage?.created_at
//                   ? formatMessageTime(item.lastMessage.created_at)
//                   : formatMessageTime("2025-10-12T12:32:34.974Z")}
//               </Text>
//             </View>

//             <View style={styles.messageRow}>
//               <Text
//                 style={[
//                   styles.lastMessage,
//                   unreadCount > 0 && styles.unreadMessage,
//                 ]}
//                 numberOfLines={1}
//               >
//                 {lastMsg}
//               </Text>

//               {unreadCount > 0 && (
//                 <View style={styles.unreadBadge}>
//                   <Text style={styles.unreadText}>{unreadCount}</Text>
//                 </View>
//               )}
//             </View>
//           </View>
//         </TouchableOpacity>
//       </Link>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
    
//       <View style={styles.header}>
//         <Text style={styles.headerTitle}>Messages</Text>
//       </View>

//       {isLoading ? (
//         <Text style={styles.loadingText}>Loading chats...</Text>
//       ) : error ? (
//         <Text style={styles.errorText}>Failed to load chats.</Text>
//       ) : (
//         <FlatList
//           data={users}
//           keyExtractor={(item) => item._id}
//           renderItem={renderUserItem}
//           showsVerticalScrollIndicator={false}
//           ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
//         />
//       )}
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 16,

//   },
//   header: {
//     paddingTop: 15,
//     paddingBottom: 10,
//     marginLeft: 15,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "800",
//     color: "#1C332B",
//     marginBottom: 10,
//   },
//   loadingText: {
//     textAlign: "center",
//     marginTop: 50,
//     color: "#999",
//   },
//   errorText: {
//     textAlign: "center",
//     marginTop: 50,
//     color: "red",
//   },
//   chatRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingLeft: 10,
//     paddingVertical: 10,
//     borderBottomWidth: StyleSheet.hairlineWidth,
//     borderBottomColor: "#E5E7EB",
//     borderRadius: 12,
//     backgroundColor: "#fff",
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowOffset: { width: 0, height: 1 },
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   avatarContainer: {
//     position: "relative",
//     marginRight: 14,
//     marginLeft: 5,
//   },
//   profileImage: {
//     width: 55,
//     height: 55,
//     borderRadius: 30,
//   },
//   onlineIndicator: {
//     position: "absolute",
//     bottom: 3,
//     right: 3,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#22C55E",
//     borderWidth: 2,
//     borderColor: "#fff",
//   },
//   chatInfo: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   chatHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 3,
//   },
//   userName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   messageTime: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     marginRight: 15
//   },
//   messageRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   lastMessage: {
//     flex: 1,
//     fontSize: 14,
//     color: "#6B7280",
//   },
//   unreadMessage: {
//     fontWeight: "600",
//     color: "#111827",
//   },
//   unreadBadge: {
//     backgroundColor: "#22C55E",
//     borderRadius: 10,
//     minWidth: 20,
//     height: 20,
//     alignItems: "center",
//     justifyContent: "center",
//     marginLeft: 6,
//     marginRight: 15
//   },
//   unreadText: {
//     color: "#fff",
//     fontSize: 12,
//     fontWeight: "700",
//   },
// });

import React, { useMemo } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import {
  formatDistanceToNowStrict,
  isToday,
  isYesterday,
  format,
} from "date-fns";
import { Avatar } from "@/app/avatar";
import { useGobalStoreContext } from "@/store/global-context";
import { getMyChats } from "./services";
import { DualAvatar } from "./helper";

/* ---------- TYPES ---------- */
interface ChatUser {
  _id: string;
  first_name: string;
  last_name: string;
  profile_picture?: string;
}

interface Chat {
  _id: string;
  name: string;
  taskId: string;
  task_picture?: string;
  participants: string[];
  lastMessageAt: string;
  unreadCount: number;
  users: ChatUser[];
  task?: {
    _id: string;
    task: string;
    incentive: number;
    location: string;
    created_at: string;
  };
  lastMessage?: {
    _id: string;
    sender: string;
    text: string;
    createdAt: string;
  };
}

/* ---------- COMPONENT ---------- */
export default function Messages() {
  const { userData } = useGobalStoreContext();

  const { data: chats = [], isLoading, error } = useQuery<Chat[]>({
    queryKey: ["chats"],
    queryFn: getMyChats,
  });

  const formatMessageTime = (dateStr: string): string => {
    const date = new Date(dateStr);
    if (isToday(date)) return format(date, "h:mm a");
    if (isYesterday(date)) return "Yesterday";
    return formatDistanceToNowStrict(date, { addSuffix: true });
  };

  const renderChatItem = ({ item }: { item: Chat }) => {
    const otherUser = item.users.find((u) => u._id !== userData?._id);
    const taskPicture= item.task_picture?.replace("auto/upload", "image/upload");
    console.log('piccc', taskPicture)
    const fullName = otherUser
      ? `${otherUser.first_name.trim()} ${otherUser.last_name.trim()}`
      : "Unknown User";
    const name= `${item.name} -- ${otherUser?.first_name.trim()} `

    const lastMsg = item.lastMessage?.text || "Start a conversation...";
    const lastMsgTime = item.lastMessage?.createdAt || item.lastMessageAt;
    const unreadCount = item.unreadCount || 0;

    return (
      <Link
        href={{ pathname: "/messages/[id]", params: { id: item._id, data: JSON.stringify(item) } }}
        asChild
      >
        <TouchableOpacity style={styles.chatRow}>
          {/* Avatar */}
          {/* <View style={styles.avatarContainer}>
            {otherUser?.profile_picture ? (
              <Image
                source={{ uri: otherUser.profile_picture }}
                style={styles.profileImage}
                contentFit="cover"
                transition={200}
              />
            ) : (
              <Avatar size={55} />
            )}
          </View> */}

          <View style={styles.avatarContainer}>
  {item.users.length === 2 ? (
    <DualAvatar
  leftImage={taskPicture ?? ""}
  rightImage={otherUser?.profile_picture ?? ""}
  size={55}
/>
  ) : (
    <Avatar size={55} />
  )}
</View>

          {/* Chat Info */}
          <View style={styles.chatInfo}>
            <View style={styles.chatHeader}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.messageTime}>
                {lastMsgTime ? formatMessageTime(lastMsgTime) : ""}
              </Text>
            </View>

            <View style={styles.messageRow}>
              <Text
                style={[
                  styles.lastMessage,
                  unreadCount > 0 && styles.unreadMessage,
                ]}
                numberOfLines={1}
              >
                {lastMsg}
              </Text>

              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>
                    {unreadCount > 10 ? "10+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    );
  };

  const sortedChats = useMemo(
    () =>
      [...chats].sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime(),
      ),
    [chats],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {isLoading ? (
        <Text style={styles.loadingText}>Loading chats...</Text>
      ) : error ? (
        <Text style={styles.errorText}>Failed to load chats.</Text>
      ) : sortedChats.length === 0 ? (
        <Text style={styles.loadingText}>No chats yet.</Text>
      ) : (
        <FlatList
          data={sortedChats}
          keyExtractor={(item) => item._id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 6 }} />}
        />
      )}
    </SafeAreaView>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 15,
    paddingBottom: 10,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1C332B",
    marginBottom: 10,
  },
  loadingText: {
    textAlign: "center",
    marginTop: 50,
    color: "#999",
  },
  errorText: {
    textAlign: "center",
    marginTop: 50,
    color: "red",
  },
  chatRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 14,
    marginLeft: 5,
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
  },
  chatInfo: {
    flex: 1,
    justifyContent: "center",
  },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  messageTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginRight: 15,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: "#6B7280",
  },
  unreadMessage: {
    fontWeight: "700",
    color: "#111827",
  },
  unreadBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
    marginRight: 15,
  },
  unreadText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
