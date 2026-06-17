import React from "react";
import { useRouter } from "expo-router";
import { Block, Col, Row, Card, Display, Heading, Body, Button } from "../../../../ui/primitives";
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
    <Block frame="fill" paint="page" safeArea="all">
      <Col fill between="md" pad="md">
        <Col between="xs">
          <Display>Example App</Display>
          <Body dim>Example member workspace wired into session and onboarding state.</Body>
        </Col>
        <ProfileCard identity={identity} onPress={() => router.push(exampleAppRoutes.profile)} />
        <Card variant="subtle" pad="sm">
          <Col between="xs">
            <Heading size="sm">Backend session</Heading>
            <Body size="sm" dim>User ID: {identity.uid || "Unavailable"}</Body>
            <Body size="sm" dim>Email: {identity.email || "Unavailable"}</Body>
            <Body size="sm" dim>Onboarding complete: {session?.onboardingCompleted ? "Yes" : "No"}</Body>
          </Col>
        </Card>
        <Row between="sm" flexWrap="wrap">
          <Button label="Refresh session" onPress={() => { void refreshSession(); }} fullWidth={false} />
          <Button label="Profile" variant="secondary" onPress={() => router.push(exampleAppRoutes.profile)} fullWidth={false} />
        </Row>
      </Col>
    </Block>
  );
}
