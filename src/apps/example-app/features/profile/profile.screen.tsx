import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Block, Button, Input, Text } from "../../../../ui/primitives";
import { Panel } from "../../../../ui/panels";
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
    <Block frame="fill" paint="page" safeArea="all" pad="md" space="md">
      <Block direction="horizontal" justify="space-between" align="center">
        <Text variant="pageTitle">Profile</Text>
        <Button label="Back" variant="secondary" onPress={() => router.replace(exampleAppRoutes.home)} fullWidth={false} />
      </Block>
      <ProfileCard identity={{ uid: profile.state.uid, email: profile.state.email, name: profile.state.name }} />
      <Panel variant="muted" pad="md">
        <Block space="sm">
          <Text variant="h3">Display name</Text>
          <Input value={profile.state.name} onChangeText={profile.actions.setDraftName} placeholder="Display name" />
          <Button label={saving ? "Saving..." : "Save profile"} onPress={() => { void handleSave(); }} disabled={saving || profile.state.name.trim().length < 2} />
        </Block>
      </Panel>
    </Block>
  );
}
