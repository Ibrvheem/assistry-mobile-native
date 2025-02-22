import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useRouter, Stack, router, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
export { ErrorBoundary } from "expo-router";
import { createTamagui, TamaguiProvider, View } from "tamagui";
import defaultConfig from "@tamagui/config/v3";
import { Image, LogBox, StatusBar, Text, TouchableOpacity } from "react-native";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { GlobalStoreProvider } from "@/store/global-context";
import { Avatar } from "./avatar";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateTaskModal from "@/components/organism/create-task-modal";
StatusBar.setBarStyle("dark-content");
const config = createTamagui(defaultConfig);

export const unstable_settings = {
  initialRouteName: "(dashboard)",
};
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Poppins: require("../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins/Poppins-Medium.ttf"),

    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // router.push("/(dashboard)");
      async function findToken() {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/(dashboard)"); // Navigate to dashboard if token exists
        } else {
          router.replace("/(auth)"); // Navigate to auth if no token
        }
      }
      findToken().finally(() => {
        SplashScreen.hideAsync(); // Hide splash screen after navigation decision
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}
const queryClient = new QueryClient();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  // List of dashboard screens where the header should be hidden
  const hideHeaderOn = ["/profile", "/settings", "/messages", "/tasks"];

  const shouldShowHeader = !hideHeaderOn.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalStoreProvider>
        <TamaguiProvider config={config}>
          <ThemeProvider
            value={colorScheme! !== "dark" ? DarkTheme : DefaultTheme}
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
                  headerLeft: () => <Avatar />,
                  headerRight: () => (
                    <TouchableOpacity
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                        setOpen(true);
                      }}
                    >
                      <Text className="text-2xl">➕</Text>
                    </TouchableOpacity>
                  ),
                }}
              />
              <Stack.Screen
                name="modal"
                options={{ presentation: "modal", headerShown: false }}
              />
            </Stack>
          </ThemeProvider>
          <CreateTaskModal open={open} setOpen={setOpen} />
        </TamaguiProvider>
      </GlobalStoreProvider>
    </QueryClientProvider>
  );
}
