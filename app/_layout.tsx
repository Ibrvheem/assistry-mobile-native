

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
import { Provider as DatabaseProvider } from "@/database/provider";
import { Avatar } from "./avatar";
import { MyAvatar } from "./myavatar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTaskModal from "@/components/organism/create-task-modal";
import { StatusBar } from "expo-status-bar";
import config from "../tamagui.config";
import { PortalProvider } from "tamagui";
import "@/global.css";
import { BellDot } from "lucide-react-native";

const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding until we explicitly hide it
SplashScreen.preventAutoHideAsync();

// export const unstable_settings = {
//   initialRouteName: "(dashboard)",
// };


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
              headerShown: false,
              headerTitle: "",
              headerStyle: {
                backgroundColor: "white",
              },
              // headerBackVisible: false,
              headerLeft: () => <MyAvatar showGreeting={true} />,
              headerRight: () => <BellDot />,
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



import { useNotificationObserver } from "@/lib/notifications";

// ... imports

export default function RootLayout(): JSX.Element | null {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),
    ...FontAwesome.font,
  });

  // Initialize Notification Listeners
  useNotificationObserver();

  if (error) throw error;
  if (!loaded) return null;

  return (
    <ProvidersShell >
      <NavigationDecider />
    </ProvidersShell>
  );
}
// ... rest of file

function ProvidersShell({ children }: { children: React.ReactNode }) {
  return (
    <TamaguiProvider config={config}>
      <PortalProvider shouldAddRootHost>
        <QueryClientProvider client={queryClient}>
          <DatabaseProvider>
            <GlobalStoreProvider>
              {children}
              <CreateTaskModal open={false} setOpen={() => {}} />
            </GlobalStoreProvider>
          </DatabaseProvider>
        </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}


// function NavigationDecider() {
//   const router = useRouter();

//   useEffect(() => {
//     const decideAndHide = async () => {
//       try {
//         const token = await AsyncStorage.getItem("token");
//         router.replace("/(auth)");
//       } finally {
//         SplashScreen.hideAsync().catch(() => {});
//       }
//     };
//     decideAndHide();
//   }, []);

//   return <AppNavigator />;
// }

function NavigationDecider() {
  const router = useRouter();

  useEffect(() => {
    const decideAndHide = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (token) {
          router.replace("/(dashboard)");
        } else {
          router.replace("/(auth)");
        }
      } finally {
        SplashScreen.hideAsync().catch(() => {});
      }
    };
    decideAndHide();
  }, []);

  return <AppNavigator />;
}
