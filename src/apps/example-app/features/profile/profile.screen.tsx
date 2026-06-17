import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Block, Col, Row, Card, Display, Heading, Button, Input } from "../../../../ui/primitives";
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
    <Block frame="fill" paint="page" safeArea="all">
      <Col fill between="md" pad="md">
        <Row spread centered>
          <Display>Profile</Display>
          <Button label="Back" variant="secondary" onPress={() => router.replace(exampleAppRoutes.home)} fullWidth={false} />
        </Row>
        <ProfileCard identity={{ uid: profile.state.uid, email: profile.state.email, name: profile.state.name }} />
        <Card variant="subtle" pad="md">
          <Col between="sm">
            <Heading size="sm">Display name</Heading>
            <Input value={profile.state.name} onChangeText={profile.actions.setDraftName} placeholder="Display name" />
            <Button label={saving ? "Saving..." : "Save profile"} onPress={() => { void handleSave(); }} disabled={saving || profile.state.name.trim().length < 2} />
          </Col>
        </Card>
      </Col>
    </Block>
  );
}
