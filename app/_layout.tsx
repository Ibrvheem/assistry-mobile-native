// // app/_layout.tsx
// import FontAwesome from "@expo/vector-icons/FontAwesome";
// import {
//   DarkTheme,
//   DefaultTheme,
//   ThemeProvider,
// } from "@react-navigation/native";
// import { useFonts } from "expo-font";
// import { useRouter, Stack, router, usePathname } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { useEffect, useState } from "react";
// import "react-native-reanimated";
// import { useColorScheme } from "@/components/useColorScheme";
// export { ErrorBoundary } from "expo-router";
// import { createTamagui, TamaguiProvider } from "tamagui";
// import defaultConfig from "@tamagui/config/v3";
// import { Image, LogBox, Platform, Text, TouchableOpacity } from "react-native";
// import {
//   QueryClient,
//   QueryClientProvider,
// } from "@tanstack/react-query";
// import {
//   GlobalStoreProvider,
// } from "@/store/global-context";
// import { Avatar } from "./avatar";
// import * as Haptics from "expo-haptics";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CreateTaskModal from "@/components/organism/create-task-modal";
// // import FundModal from "@/components/organism/fund-wallet-modal";
// import { StatusBar } from "expo-status-bar";
// import config from "../tamagui.config";
// import { PortalProvider } from 'tamagui';
// import { Slot } from "expo-router";
// import '@/global.css';

// // Wrap defaultConfig with createTamagui

// // const config = createTamagui(defaultConfig);
// const queryClient = new QueryClient();

// // Prevent the splash screen from auto-hiding until we explicitly hide it
// SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   initialRouteName: "(dashboard)",
// };
// // console.log('default tokens:', (defaultConfig as any).tokens);

// export default function RootLayout(): JSX.Element | null {
//   const [loaded, error] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
//     PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
//     PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),

//     ...FontAwesome.font,
//   });

//   const router = useRouter();
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     async function decideAndHide() {
//       if (!loaded) return;
//       try {
//         const token = await AsyncStorage.getItem("token");
//         if (token) {
//           router.replace("/(dashboard)");
//         } else {
//           router.replace("/(auth)");
//         }
//       } finally {
//         // hide the splash screen once we've made the navigation decision
//         SplashScreen.hideAsync().catch(() => {});
//       }
//     }
//     decideAndHide();
//   }, [loaded]);

//   if (!loaded) return null;

//   // Pass open/setOpen as props
//   return <ProvidersShell open={open} setOpen={setOpen} />;
// }

// function ProvidersShell({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
//   return (
//     <TamaguiProvider config={config}>
//            <PortalProvider shouldAddRootHost>
//     <QueryClientProvider client={queryClient}>
//       <GlobalStoreProvider>
//             <AppNavigator open={open} setOpen={setOpen} />
//             <CreateTaskModal open={open} setOpen={setOpen} />
//             {/* <FundModal open={open} setOpen={setOpen} /> */}
//       </GlobalStoreProvider>
//     </QueryClientProvider>
//     </PortalProvider>
//     </TamaguiProvider>
//   );
// }

// function AppNavigator({ open, setOpen }: { open: boolean; setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
//   const colorScheme = useColorScheme();
//   const pathname = usePathname();

//   // NOTE: Do NOT call useGobalStoreContext() here if your provider isn't exported properly.
//   // Any component that needs the store should call the hook inside its file (e.g. Avatar).

//   // List of dashboard screens where the header should be hidden
//   const hideHeaderOn = ["/profile", "/settings", "/messages", "/tasks"];
//   const shouldShowHeader = !hideHeaderOn.some((route) => pathname?.startsWith(route));

//   return (
//     <>
//       <ThemeProvider value={colorScheme !== "dark" ? DarkTheme : DefaultTheme}>
//         <Stack>
//           {/* Keep (auth) and (dashboard) as entry points for your route groups */}
//           <Stack.Screen name="(auth)" options={{ headerShown: false }} />
//           <Stack.Screen
//             name="(dashboard)"
//             options={{
//               headerShown: shouldShowHeader,
//               headerTitle: "",
//               headerStyle: {
//                 backgroundColor: "white",
//               },

//               headerBackVisible: false,
//               headerLeft: () => (
//                 <>
//                   <Avatar showGreeting={true} />
//                 </>
//               ),
//             }}
//           />

//           <Stack.Screen name="modal" options={{ presentation: "modal", headerShown: false }} />
//         </Stack>
//       </ThemeProvider>
//       <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
//       {/* Remove CreateTaskModal from here */}
//     </>
//   );
// }









// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { Image, Platform } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GlobalStoreProvider } from "@/store/global-context";
import { Avatar } from "./avatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTaskModal from "@/components/organism/create-task-modal";
import { StatusBar } from "expo-status-bar";
import config from "../tamagui.config";
import { PortalProvider } from "tamagui";
import "@/global.css";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding until we explicitly hide it
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(dashboard)",
};

// export default function RootLayout(): JSX.Element | null {
//   const [loaded, error] = useFonts({
//     SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
//     Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
//     PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
//     PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
//     ...FontAwesome.font,
//   });

//   const router = useRouter();
//   const [open, setOpen] = useState(false);

//   useEffect(() => {
//     if (error) throw error;
//   }, [error]);

//   useEffect(() => {
//     async function decideAndHide() {
//       if (!loaded) return;
//       try {
//         const token = await AsyncStorage.getItem("token");
//         router.replace("/(auth)");
//         // if (token) {
//         //   router.replace("/(dashboard)");
//         // } else {
//         //   router.replace("/(auth)");
//         // }
//       } finally {
//         // hide the splash screen once we've made the navigation decision
//         SplashScreen.hideAsync().catch(() => {});
//       }
//     }
//     decideAndHide();
//   }, [loaded]);

//   if (!loaded) return null;

//   return <ProvidersShell open={open} setOpen={setOpen} />;
// }

// function ProvidersShell({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) {
//   return (
//     <TamaguiProvider config={config}>
//       <PortalProvider shouldAddRootHost>
//         <QueryClientProvider client={queryClient}>
//           <GlobalStoreProvider>
//             <AppNavigator />
//             <CreateTaskModal open={open} setOpen={setOpen} />
//           </GlobalStoreProvider>
//         </QueryClientProvider>
//       </PortalProvider>
//     </TamaguiProvider>
//   );
// }

function AppNavigator() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();

  // List of dashboard screens where the header should be hidden
  const hideHeaderOn = ["/profile", "/settings", "/messages", "/tasks"];
  const shouldShowHeader = !hideHeaderOn.some((route) =>
    pathname?.startsWith(route)
  );

  return (
    <>
      <ThemeProvider
        value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      >
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(dashboard)"
            options={{
              headerShown: shouldShowHeader,
              headerTitle: "",
              headerStyle: {
                backgroundColor: "white",
              },
              headerBackVisible: false,
              headerLeft: () => <Avatar showGreeting={true} />,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </>
  );
}


// app/_layout.tsx
export default function RootLayout(): JSX.Element | null {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    ...FontAwesome.font,
  });

  if (error) throw error;
  if (!loaded) return null;

  return (
    <ProvidersShell>
      <NavigationDecider />
    </ProvidersShell>
  );
}

function ProvidersShell({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config}>
      <PortalProvider shouldAddRootHost>
        <QueryClientProvider client={queryClient}>
          <GlobalStoreProvider>
            {children}
            <CreateTaskModal open={false} setOpen={() => {}} />
          </GlobalStoreProvider>
        </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}


function NavigationDecider() {
  const router = useRouter();

  useEffect(() => {
    const decideAndHide = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        router.replace(token ? "/(dashboard)" : "/(auth)");
      } finally {
        SplashScreen.hideAsync().catch(() => {});
      }
    };
    decideAndHide();
  }, []);

  return <AppNavigator />;
}
