import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import SplashScreenView from "../components/SplashScreen";
import { AuthProvider } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "GoogleSansFlex-Bold": require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_9pt-Bold.ttf"),
    "GoogleSansFlex-ExtraBold": require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_9pt-ExtraBold.ttf"),
    "GoogleSansFlex-Regular": require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_9pt-Regular.ttf"),
    "GoogleSansFlex-Medium": require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_9pt-Medium.ttf"),
    "GoogleSansFlex-SemiBold": require("../assets/fonts/Google_Sans_Flex/static/GoogleSansFlex_9pt-SemiBold.ttf"),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const [showCustomSplash, setShowCustomSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  useEffect(() => {
    async function prepare() {
      try {
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      setTimeout(() => setShowCustomSplash(false), 5000);
    }
  }, [appIsReady]);

  if (!fontsLoaded) {
    return null;
    if (!appIsReady) return null;
  }

  if (showCustomSplash) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SplashScreenView />
      </View>
    );
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="step-2" />
        <Stack.Screen name="step-3" />
        <Stack.Screen name="welcome" />
      </Stack>
    </AuthProvider>
  );
}
