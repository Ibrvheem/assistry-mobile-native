

// app/_layout.tsx
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter, Stack, usePathname, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import Colors from "@/constants/Colors";

import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";
import { TamaguiProvider } from "tamagui";
import { Image, Platform } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { GlobalStoreProvider } from "@/store/global-context";
import { ChatProvider } from "@/store/chat-store";
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
                backgroundColor: Colors[colorScheme ?? "light"].background, // Use theme background
              },
              // headerBackVisible: false,
              headerLeft: () => <MyAvatar showGreeting={true} />,
              headerRight: () => <BellDot color={Colors[colorScheme ?? "light"].text} />, // Use theme text color
            }}
          />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", headerShown: false }}
          />
        </Stack>
      </ThemeProvider>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
    </>
  );
}



import { useNotificationObserver } from "@/lib/notifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { useGobalStoreContext } from "@/store/global-context";
import { updateProfile } from "./(auth)/services";
import { UserDataSchema } from "./(auth)/types";

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
          <ChatProvider>
            <GlobalStoreProvider>
              {children}
              <CreateTaskModal open={false} setOpen={() => {}} />
            </GlobalStoreProvider>
          </ChatProvider>
        </QueryClientProvider>
      </PortalProvider>
    </TamaguiProvider>
  );
}

function NavigationDecider() {
  const router = useRouter();
  const { userData, loading, refreshUser } = useGobalStoreContext();
  const pathname = usePathname();
  const segments = useSegments();

  // Push Notifications Token
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const handlePushToken = async () => {
        if (userData && expoPushToken && userData.push_token !== expoPushToken && userData._id) {
            console.log("Updating push token for user:", userData._id);
            // try {
            //     await updateProfile({ push_token: expoPushToken });
            //     await refreshUser(); // Refresh checks
            // } catch (error) {
            //     console.error("Failed to update push token", error);
            // }
        }
    };
    if(expoPushToken && userData) {
        handlePushToken();
    }
  }, [expoPushToken, userData, refreshUser]);


  useEffect(() => {
    const decideAndHide = async () => {
        if(loading) return; // Wait for user data

      try {
        const token = await AsyncStorage.getItem("token");
        const hasSkipped = await AsyncStorage.getItem("skipProfileCompletion");
        
        // 1. Not Logged In
        if (!token) {
          console.log('No token')
          // useSegments returns segments representing the file system structure (e.g. ['(auth)', 'index'])
          // So we check the first segment (the group).
          if (segments[0] !== '(auth)') {
              router.replace("/(auth)");
          }
        } 
        // 2. Logged In
        else {
             // Check Profile Completion (if userData is loaded)
             if (userData) {
                 const isProfileComplete = 
                    userData.username && 
                    userData.dob && 
                    userData.id_card_url && 
                    userData.preferred_task_categories && userData.preferred_task_categories.length > 0;
                 
                 // If Profile Incomplete and NOT already on profile-completion page AND HAS NOT SKIPPED
                 if (!isProfileComplete && !hasSkipped && pathname !== '/(auth)/profile-completion') {
                     console.log("Profile incomplete, redirecting...");
                     router.replace("/(auth)/profile-completion");
                 } 
                 // If Profile Complete and user tries to access auth (like signin), redirect to dashboard
                 else if (segments[0] === '(auth)' && pathname !== '/(auth)/profile-completion') {
                      router.replace("/(dashboard)");
                 }
                 // If Profile Complete and on profile-completion, redirect to dashboard
                 else if (isProfileComplete && pathname === '/(auth)/profile-completion') {
                      router.replace("/(dashboard)");
                 }
                 // If Skipped and on profile-completion, redirect to dashboard
                 else if (!isProfileComplete && hasSkipped && pathname === '/(auth)/profile-completion') {
                      router.replace("/(dashboard)");
                 }
             }
        }

      } finally {
        SplashScreen.hideAsync().catch(() => {});
      }
    };
    decideAndHide();
  }, [loading, userData, pathname]);

  return <AppNavigator />;
}
