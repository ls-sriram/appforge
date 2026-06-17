import React from "react";
import { ActivityIndicator } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { UIProvider } from "../src/ui/Provider";
import { Block } from "../src/ui/primitives";
import { useGateState } from "../src/features/app-gate/viewmodel/use-gate-state";
import { EntitlementProvider } from "../src/providers/EntitlementProvider";
import { SessionProvider } from "../src/providers/SessionProvider";
import { exampleAppRoutes } from "../src/apps/example-app/navigation/routes";

const PUBLIC_AUTH_ROUTES = new Set(["/login", "/register", "/forgot-password"]);

function ExampleAppGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const gate = useGateState();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.has(pathname);
  const isOnboardingRoute = pathname === exampleAppRoutes.onboarding;

  if (gate.loading) {
    return (
      <Block frame="fill" paint="page" justify="center" align="center">
        <ActivityIndicator size="large" />
      </Block>
    );
  }

  if (!gate.authenticated) {
    if (isPublicAuthRoute) return <>{children}</>;
    return <Redirect href="/login" />;
  }

  if (!gate.onboardingComplete) {
    if (isOnboardingRoute) return <>{children}</>;
    return <Redirect href={exampleAppRoutes.onboarding} />;
  }

  if (isPublicAuthRoute || isOnboardingRoute) {
    return <Redirect href={exampleAppRoutes.home} />;
  }

  return <>{children}</>;
}

export default function ExampleAppRootLayout() {
  return (
    <UIProvider>
    <ThemeProvider>
      <SafeAreaProvider>
        <SessionProvider>
          <EntitlementProvider>
            <StatusBar style="dark" translucent={false} />
            <ExampleAppGate>
              <Stack screenOptions={{ headerShown: false }} />
            </ExampleAppGate>
          </EntitlementProvider>
        </SessionProvider>
      </SafeAreaProvider>
    </ThemeProvider>
    </UIProvider>
  );
}
