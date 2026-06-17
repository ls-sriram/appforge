import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Body, Button, Display, Heading, Input, SafeAreaView, View, XStack, YStack } from "../../../../ui";
import { ProfileCard, useProfileEditViewModel } from "../../../../features/settings";
import { exampleAppRoutes } from "../../navigation/routes";

export function ExampleAppProfileScreen() {
  const router = useRouter();
  const profile = useProfileEditViewModel();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await profile.actions.saveDraftName();
    setSaving(false);
    Alert.alert(ok ? "Profile saved" : "Save failed", ok ? "Your name was updated." : "Try again.");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} bg="$bg" gap="$4" p="$4">
        <XStack jc="space-between" ai="center">
          <Display>Profile</Display>
          <Button onPress={() => router.replace(exampleAppRoutes.home)} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
            <Body>Back</Body>
          </Button>
        </XStack>
        <ProfileCard identity={{ uid: profile.state.uid, email: profile.state.email, name: profile.state.name }} />
        <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
          <YStack gap="$3">
            <Heading fontSize="$4">Display name</Heading>
            <Input value={profile.state.name} onChangeText={profile.actions.setDraftName} placeholder="Display name" />
            <Button onPress={() => { void handleSave(); }} disabled={saving || profile.state.name.trim().length < 2} bg="$primary" opacity={saving || profile.state.name.trim().length < 2 ? 0.45 : 1}>
              <Body color="$textInverse" fontFamily="$bold">{saving ? "Saving..." : "Save profile"}</Body>
            </Button>
          </YStack>
        </View>
      </YStack>
    </SafeAreaView>
  );
}
