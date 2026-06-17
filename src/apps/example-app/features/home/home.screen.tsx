import React from "react";
import { useRouter } from "expo-router";
import { Body, Button, Display, Heading, SafeAreaView, View, XStack, YStack } from "../../../../ui";
import { ProfileCard } from "../../../../features/settings";
import { useSessionContext } from "../../../../providers/SessionProvider";
import { exampleAppRoutes } from "../../navigation/routes";

function resolveIdentity(session: ReturnType<typeof useSessionContext>["session"]) {
  return {
    uid: session?.identity?.uid ?? session?.uid ?? "",
    email: session?.identity?.email ?? session?.email ?? "",
    name: session?.identity?.name ?? session?.name ?? "",
  };
}

export function ExampleAppHomeScreen() {
  const router = useRouter();
  const { session, refreshSession } = useSessionContext();
  const identity = resolveIdentity(session);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} bg="$bg" gap="$4" p="$4">
        <YStack gap="$2">
          <Display>Example App</Display>
          <Body color="$textMuted">Example member workspace wired into session and onboarding state.</Body>
        </YStack>
        <ProfileCard identity={identity} onPress={() => router.push(exampleAppRoutes.profile)} />
        <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$3">
          <YStack gap="$2">
            <Heading fontSize="$4">Backend session</Heading>
            <Body fontSize="$2" color="$textMuted">User ID: {identity.uid || "Unavailable"}</Body>
            <Body fontSize="$2" color="$textMuted">Email: {identity.email || "Unavailable"}</Body>
            <Body fontSize="$2" color="$textMuted">Onboarding complete: {session?.onboardingCompleted ? "Yes" : "No"}</Body>
          </YStack>
        </View>
        <XStack gap="$3" flexWrap="wrap">
          <Button onPress={() => { void refreshSession(); }} bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Refresh session</Body>
          </Button>
          <Button onPress={() => router.push(exampleAppRoutes.profile)} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
            <Body>Profile</Body>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
