import React from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "@ui";
import { app } from "../../../../config/app";
import { useSessionContext } from "@providers/SessionProvider";
import { exampleAppRoutes } from "../../navigation/routes";
import { HomeLayout } from "./home.layout";

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
      <HomeLayout
        title={app.copy.home.title}
        description={app.copy.home.description}
        sessionSectionTitle={app.copy.home.sessionSectionTitle}
        refreshLabel={app.copy.home.refreshLabel}
        profileLabel={app.copy.home.profileLabel}
        name={identity.name}
        uid={identity.uid}
        email={identity.email}
        onboardingComplete={session?.onboardingCompleted ?? false}
        onRefresh={() => { void refreshSession(); }}
        onProfile={() => router.push(exampleAppRoutes.profile)}
      />
    </SafeAreaView>
  );
}
