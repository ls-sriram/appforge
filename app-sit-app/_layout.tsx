import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { UIProvider } from "../src/ui";

export default function SitAppRootLayout() {
  return (
    <UIProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <StatusBar style="light" translucent={false} />
          <Stack screenOptions={{ headerShown: false, animation: "none" }} />
        </ThemeProvider>
      </SafeAreaProvider>
    </UIProvider>
  );
}
