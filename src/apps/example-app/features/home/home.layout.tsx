import React from "react";
import { Body, Button, Heading, View, XStack, YStack } from "../../../../ui";
import { ProfileCard } from "../../../../blocks";
import { ui } from "../../../../ui/viz";

export interface HomeLayoutProps {
  title: string;
  description: string;
  sessionSectionTitle: string;
  refreshLabel: string;
  profileLabel: string;
  name: string;
  uid: string;
  email: string;
  onboardingComplete: boolean;
  onRefresh: () => void;
  onProfile: () => void;
}

export function HomeLayout({
  title = "Home",
  description = "Your member workspace.",
  sessionSectionTitle = "Session",
  refreshLabel = "Refresh session",
  profileLabel = "Profile",
  name, uid, email, onboardingComplete, onRefresh, onProfile,
}: HomeLayoutProps) {
  return (
    ui("home-0",
    <YStack f={1} bg="$bg" gap="$4" p="$4">
      {ui("home-1",
      <YStack gap="$2">
        {ui("home-2", <Heading>{title}</Heading>)}
        {ui("home-3", <Body tone="muted">{description}</Body>)}
      </YStack>
      )}
      <ProfileCard name={name} email={email} uid={uid} onPress={onProfile} />
      {ui("home-13",
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$3">
        {ui("home-14",
        <YStack gap="$2">
          {ui("home-15", <Heading size="md">{sessionSectionTitle}</Heading>)}
          {ui("home-16", <Body size="sm" tone="muted">User ID: {uid}</Body>)}
          {ui("home-17", <Body size="sm" tone="muted">Email: {email}</Body>)}
          {ui("home-18", <Body size="sm" tone="muted">Onboarding: {onboardingComplete ? "complete" : "pending"}</Body>)}
        </YStack>
        )}
      </View>
      )}
      {ui("home-19",
      <XStack gap="$3" flexWrap="wrap">
        {ui("home-20", <Button label={refreshLabel} onPress={onRefresh} />)}
        {ui("home-21", <Button variant="secondary" label={profileLabel} onPress={onProfile} />)}
      </XStack>
      )}
    </YStack>
    )
  );
}
