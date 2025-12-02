

// // app/(dashboard)/_layout.tsx
// import React from "react";
// import { View, StyleSheet } from "react-native";
// import { Stack } from "expo-router";
// import CustomTabBar from "../../components/CustomTabBar";
// import { BellDot } from "lucide-react-native";
// // import MyAvatar from "@/components/molecules/my-avatar";
// import { MyAvatar } from "../myavatar";

// export default function DashboardLayout() {
//   return (
//     <View style={styles.container}>
//       <Stack
//         screenOptions={{
//           headerShown:false ,
//           animation: "none",
//         }}
//       />
//       <CustomTabBar />
      
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
// });


// app/(dashboard)/_layout.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack, usePathname } from "expo-router";
import CustomTabBar from "../../components/CustomTabBar";
import { MotiView, AnimatePresence } from "moti";

export default function DashboardLayout() {
  const pathname = usePathname();

  // hide only when route matches /messages/[something]
  const hideTabBar =
    /^\/messages\/[^/]+$/.test(pathname) || /^\/tasks\/[^/]+$/.test(pathname); 

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
        }}
      />

      {/* AnimatePresence handles enter/exit animation */}
      <AnimatePresence>
        {!hideTabBar && (
          <MotiView
            key="tabbar"
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            exit={{ opacity: 0, translateY: 50 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.tabWrapper}
          >
            <CustomTabBar />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
