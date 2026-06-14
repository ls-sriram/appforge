import React from "react";
import { useRouter } from "expo-router";
import { Block, Button, Text } from "../../../../ui/primitives";
import { Panel } from "../../../../ui/panels";
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
    <Block frame="fill" paint="page" safeArea="all" pad="md" space="md">
      <Block space="xs">
        <Text variant="pageTitle">Example App</Text>
        <Text variant="bodySm" tone="secondary">
          Example member workspace wired into session and onboarding state.
        </Text>
      </Block>
      <ProfileCard identity={identity} onPress={() => router.push(exampleAppRoutes.profile)} />
      <Panel variant="muted" pad="md">
        <Block space="xs">
          <Text variant="h3">Backend session</Text>
          <Text variant="bodySm" tone="secondary">User ID: {identity.uid || "Unavailable"}</Text>
          <Text variant="bodySm" tone="secondary">Email: {identity.email || "Unavailable"}</Text>
          <Text variant="bodySm" tone="secondary">Onboarding complete: {session?.onboardingCompleted ? "Yes" : "No"}</Text>
        </Block>
      </Panel>
      <Block direction="horizontal" space="sm" wrap>
        <Button label="Refresh session" onPress={() => { void refreshSession(); }} fullWidth={false} />
        <Button label="Profile" variant="secondary" onPress={() => router.push(exampleAppRoutes.profile)} fullWidth={false} />
      </Block>
    </Block>
  );
}
