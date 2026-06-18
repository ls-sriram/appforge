import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { UIProvider } from "../src/ui/Provider";
import { appforgeSiteTheme } from "../src/apps/appforge-site/theme";

// Public marketing site — no auth gate. Every route renders for anonymous
// visitors. Session/entitlement providers are intentionally omitted; they get
// added back only when a gated playground/editor surface needs accounts.
export default function AppforgeSiteRootLayout() {
  return (
    <UIProvider>
    <ThemeProvider value={appforgeSiteTheme}>
      <SafeAreaProvider>
        <StatusBar style="light" translucent={false} />
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </ThemeProvider>
    </UIProvider>
  );
}
