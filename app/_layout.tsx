import { PortalProvider } from "@/components/Portal";
import * as Font from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      Hand: require("../assets/fonts/PatrickHand-Regular.ttf"),
    }).then(() => {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!fontsLoaded) return null; // 👈 clave: bloquea hasta que cargue

  return (
    <PortalProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PortalProvider>
  );
}
