// // app/(dashboard)/_layout.tsx
// import React from "react";
// import { Tabs } from "expo-router";
// import {
//   Home,
//   Settings2,
//   MessageCircle,
//   User,
//   List,
// } from 'lucide-react-native';


// export default function DashboardLayout() {
//   return (
//     <Tabs
//       screenOptions={({ route }) => ({
//         tabBarStyle: {
//           backgroundColor: "white",
//           height: 50,
//           borderColor: "transparent",
//         },
//         tabBarLabelStyle: {
//           fontSize: 12,
//           fontWeight: "600",
//           color: "gray",
//         },
//         tabBarActiveTintColor: "green",
//         headerShown: false,
//       })}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarLabelStyle: { display: "none" },
//           tabBarIcon: ({ color, size }) => (
//             // <HomeIcon color={color} size={size} />
//             <Home color={color} size={size} />
//           ),
//           title: "Home",
//         }}
//       />
//       <Tabs.Screen
//         name="settings"
//         options={{
//           tabBarStyle: { display: "none" },
//           tabBarLabelStyle: { display: "none" },
//           tabBarIcon: ({ color, size }) => (
//             <Settings2 color={color} size={size} />
//           ),
//           title: "Settings",
//         }}
//       />

//       <Tabs.Screen
//         name="tasks/index"
//         options={{
//           headerShown: false,
//           headerStyle: { backgroundColor: "white" },
//           headerTitleStyle: { color: "black" },
//           tabBarLabelStyle: { display: "none" },
//           tabBarIcon: ({ color, size }) => (
//             <List color={color} size={size} />
//           ),
//           title: "Messages",
//         }}
//       />

//       <Tabs.Screen
//         name="messages/index"
//         options={{
//           tabBarStyle: { display: "none" },
//           href: null,
//           title: "Messages",
//         }}
//       />

//       <Tabs.Screen
//         name="messages/[id]"
//         options={{
//           tabBarStyle: { display: "none" },
//           href: null,
//           title: "Messages",
//         }}
//       />
//       <Tabs.Screen
//         name="tasks/[id]"
//         options={{
//           tabBarStyle: { display: "none" },
//           href: null,
//           title: "Messages",
//         }}
//       />
      

//       <Tabs.Screen
//         name="profile/profile"
//         options={{
//           tabBarLabelStyle: { display: "none" },
//           tabBarIcon: ({ color, size }) => (
//             <User color={color} size={size} />
//           ),
//           title: "Profile",
//         }}
//       />
//       <Tabs.Screen
//         name="profile/edit/index"
//         options={{
//           tabBarStyle: { display: "none" },
//           href: null,
//           title: "Messages",
//         }}
//       />

//            <Tabs.Screen
//   name="transactions"            // must match the folder name
//   options={{
//     href: null,
//   }}
// />
//     </Tabs>
//   );
// }



import React from "react";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import CustomTabBar from "../../components/CustomTabBar"; // 👈 we’ll make this next

export default function DashboardLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
      <CustomTabBar /> {/* 👈 your personal footer */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
