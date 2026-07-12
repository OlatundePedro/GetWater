import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useState } from "react";
import { View } from "react-native";
import SplashScreenView from "../components/SplashScreen";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { FavouritesProvider } from "../context/FavouritesContext";
import { ProductsProvider } from "../context/ProductContext";
import { ProfileProvider } from "../context/ProfileContext";
import { ThemeProvider } from "../context/ThemeContext";

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
        // real startup work goes here
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

  if (!fontsLoaded || !appIsReady) {
    return null;
  }

  if (showCustomSplash) {
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SplashScreenView />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductsProvider>
          <ProfileProvider>
            <CartProvider>
              <FavouritesProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </FavouritesProvider>
            </CartProvider>
          </ProfileProvider>
        </ProductsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
