import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { LogBox, Platform, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ErrorBoundary } from "@/src/components/error-boundary";
import { queryClient } from "@/src/query-client";
import { useTheme } from "@/src/theme";

LogBox.ignoreAllLogs(true);

// Prewarm the app-image asset so it is available in Expo Go on Android.
// Do not remove this — see prewarm notes for icon assets.
const APP_IMAGE = require("../assets/images/app-image.png");
void APP_IMAGE;

export default function RootLayout() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    "SpaceGrotesk-Medium": require("../assets/fonts/SpaceGrotesk-Medium.ttf"),
    "SpaceGrotesk-Bold": require("../assets/fonts/SpaceGrotesk-Bold.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Medium": require("../assets/fonts/Geist-Medium.ttf"),
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.surface }} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.surface }}>
        <QueryClientProvider client={queryClient}>
          <KeyboardProvider>
            <StatusBar style="light" />
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.surface },
                animation: Platform.OS === "ios" ? "default" : "fade",
              }}
            />
          </KeyboardProvider>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
