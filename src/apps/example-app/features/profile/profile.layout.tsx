import React from "react";
import { Body, Button, Heading, View, XStack, YStack } from "../../../../ui";
import { ProfileCard } from "../../../../blocks";
import { ui } from "../../../../ui/viz";

export interface ProfileLayoutProps {
  title: string;
  backLabel: string;
  displayNameSectionTitle: string;
  namePlaceholder: string;
  saveLabel: string;
  savingLabel: string;
  name: string;
  email: string;
  uid: string;
  draftName: string;
  saving: boolean;
  onBack: () => void;
  onSave: () => void;
}

export function ProfileLayout({
  title = "Profile",
  backLabel = "Back",
  displayNameSectionTitle = "Display name",
  namePlaceholder = "Enter display name…",
  saveLabel = "Save profile",
  savingLabel = "Saving…",
  name, email, uid, draftName, saving, onBack, onSave,
}: ProfileLayoutProps) {
  return (
    ui("profile-0",
    <YStack f={1} bg="$bg" gap="$4" p="$4">
      {ui("profile-1",
      <XStack jc="space-between" ai="center">
        {ui("profile-2", <Heading>{title}</Heading>)}
        {ui("profile-3", <Button variant="secondary" label={backLabel} onPress={onBack} />)}
      </XStack>
      )}
      <ProfileCard name={name} email={email} uid={uid} />
      {ui("profile-13",
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
        {ui("profile-14",
        <YStack gap="$3">
          {ui("profile-15", <Heading size="md">{displayNameSectionTitle}</Heading>)}
          {ui("profile-16",
          <View bg="$surfaceStrong" h={44} br="$2" borderColor="$borderSubtle" borderWidth={1} px="$3" jc="center">
            {ui("profile-17", <Body tone={draftName ? "primary" : "muted"}>{draftName || namePlaceholder}</Body>)}
          </View>
          )}
          {ui("profile-18", <Button label={saving ? savingLabel : saveLabel} loading={saving} onPress={onSave} />)}
        </YStack>
        )}
      </View>
      )}
    </YStack>
    )
  );
}
