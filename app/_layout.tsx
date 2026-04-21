import { PortalProvider } from "@/components/Portal";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <PortalProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </PortalProvider>
  );
}
