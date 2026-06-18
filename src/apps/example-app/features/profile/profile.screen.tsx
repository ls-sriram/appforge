import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "../../../../ui";
import { app } from "../../../../config/app";
import { useProfileEditViewModel } from "../../../../features/settings";
import { exampleAppRoutes } from "../../navigation/routes";
import { ProfileLayout } from "./profile.layout";

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
      <ProfileLayout
        title={app.copy.profile.title}
        backLabel={app.copy.profile.backLabel}
        displayNameSectionTitle={app.copy.profile.displayNameSectionTitle}
        namePlaceholder={app.copy.profile.namePlaceholder}
        saveLabel={app.copy.profile.saveLabel}
        savingLabel={app.copy.profile.savingLabel}
        name={profile.state.name}
        email={profile.state.email}
        uid={profile.state.uid}
        draftName={profile.state.name}
        saving={saving}
        onBack={() => router.replace(exampleAppRoutes.home)}
        onSave={() => { void handleSave(); }}
      />
    </SafeAreaView>
  );
}
