import fs from "node:fs";
import path from "node:path";
import { ROOT, pascal, rel, slugify, title, writeIfMissing } from "./shared.mjs";

const MANIFEST_PATH = path.join(ROOT, "config", "app-manifest.json");

function normalizeRouteBase(value, appId) {
  if (!value) return `/${appId}`;
  const trimmed = value.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function routePath(base, suffix = "") {
  if (!base) return suffix || "/";
  if (!suffix) return base;
  return `${base}${suffix}`;
}

function routeFilePath(routerRoot, routeBase, leaf = "index.tsx") {
  const baseSegment = routeBase.replace(/^\/+/, "");
  if (!baseSegment) return path.join(ROOT, routerRoot, leaf);
  return path.join(ROOT, routerRoot, baseSegment, leaf);
}

function renderText(values) {
  const routesIdent = values.routesIdent;
  return {
    srcAgents: `# AGENTS.md for \`src/apps/${values.appId}\`

## Scope

- Applies to \`src/apps/${values.appId}/**\`.

## Purpose

- Owns ${values.displayName}-specific frontend code: feature slices, navigation, and app-owned presentation.

## Must Follow

- Keep app-specific features under \`features/\`.
- Keep app-specific route constants under \`navigation/\`.
- Keep app-owned reusable presentation under \`ui/\` only when reused by multiple features.
- Prefer shared \`src/ui\`, providers, and shared feature use cases before adding app-local primitives.
- Do not import from other app scopes under \`src/apps/*\`.
`,
    routerAgents: `# AGENTS.md for \`${values.routerRoot}\`

## Scope

- Applies to \`${values.routerRoot}/**\`.

## Purpose

- Expo Router entrypoints for ${values.displayName}.

## Must Follow

- Route files stay thin.
- Route files should only compose app feature screens or shared route screens.
- Do not put business logic, viewmodel logic, or styling in route entry files.
`,
    routesTs: `export const ${routesIdent} = {
  home: ${JSON.stringify(routePath(values.routeBase))} as const,
  onboarding: "/onboarding" as const,
  profile: ${JSON.stringify(routePath(values.routeBase, "/profile"))} as const,
} as const;
`,
    layout: `import React from "react";
import { ActivityIndicator } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "../src/theme/ThemeProvider";
import { UIProvider, YStack } from "../src/ui";
import { useGateState } from "../src/features/app-gate/viewmodel/use-gate-state";
import { EntitlementProvider } from "../src/providers/EntitlementProvider";
import { SessionProvider } from "../src/providers/SessionProvider";
import { ${routesIdent} } from "../src/apps/${values.appId}/navigation/routes";

const PUBLIC_AUTH_ROUTES = new Set(["/login", "/register", "/forgot-password"]);

function ${values.appPascal}Gate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const gate = useGateState();
  const isPublicAuthRoute = PUBLIC_AUTH_ROUTES.has(pathname);
  const isOnboardingRoute = pathname === ${routesIdent}.onboarding;

  if (gate.loading) {
    return (
      <YStack bg="$bg" f={1} jc="center" ai="center">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (!gate.authenticated) {
    if (isPublicAuthRoute) return <>{children}</>;
    return <Redirect href="/login" />;
  }

  if (!gate.onboardingComplete) {
    if (isOnboardingRoute) return <>{children}</>;
    return <Redirect href={${routesIdent}.onboarding} />;
  }

  if (isPublicAuthRoute || isOnboardingRoute) {
    return <Redirect href={${routesIdent}.home} />;
  }

  return <>{children}</>;
}

export default function ${values.appPascal}RootLayout() {
  return (
    <UIProvider>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <EntitlementProvider>
              <StatusBar style="dark" translucent={false} />
              <${values.appPascal}Gate>
                <Stack screenOptions={{ headerShown: false }} />
              </${values.appPascal}Gate>
            </EntitlementProvider>
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </UIProvider>
  );
}
`,
    rootIndex: `import React from "react";
import { Redirect } from "expo-router";
import { ${routesIdent} } from "../src/apps/${values.appId}/navigation/routes";

export default function ${values.appPascal}IndexRoute() {
  return <Redirect href={${routesIdent}.home} />;
}
`,
    loginRoute: `import React from "react";
import { LoginRouteScreen } from "../src/features/login/LoginRouteScreen";
import { ${routesIdent} } from "../src/apps/${values.appId}/navigation/routes";

export default function ${values.appPascal}LoginRoute() {
  return <LoginRouteScreen authenticatedHref={${routesIdent}.home} />;
}
`,
    forgotPasswordRoute: `import React from "react";
import { routes } from "../src/navigation/routes";
import { ForgotPasswordRouteScreen } from "../src/features/auth/ForgotPasswordRouteScreen";

export default function ForgotPasswordPage() {
  return <ForgotPasswordRouteScreen loginHref={routes.login} />;
}
`,
    registerRoute: `import React, { useCallback, useMemo, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import { routes } from "../src/navigation/routes";
import { ${routesIdent} } from "../src/apps/${values.appId}/navigation/routes";
import {
  RegisterAction,
  RegisterController,
  RegisterSurface,
  RegisterViewData,
  FirebaseRegisterModel,
} from "../src/features/register";

export default function ${values.appPascal}RegisterRoute() {
  const router = useRouter();
  const controller = useMemo(() => new RegisterController(new FirebaseRegisterModel()), []);
  const [data, setData] = useState<RegisterViewData>(() => controller.getInitialData());

  const dispatch = useCallback(
    async (action: RegisterAction) => {
      if (action.type === "go_to_login") {
        router.replace(routes.login);
        return;
      }
      const next = await controller.dispatch(action);
      setData(next);
    },
    [controller, router],
  );

  if (data.registered) {
    return <Redirect href={${routesIdent}.home} />;
  }

  return <RegisterSurface data={data} dispatch={dispatch} />;
}
`,
    homeScreen: `import React from "react";
import { useRouter } from "expo-router";
import { Body, Button, Heading, SafeAreaView, View, XStack, YStack } from "../../../../ui";
import { ProfileCard } from "../../../../features/settings";
import { useSessionContext } from "../../../../providers/SessionProvider";
import { ${routesIdent} } from "../../navigation/routes";

function resolveIdentity(session: ReturnType<typeof useSessionContext>["session"]) {
  return {
    uid: session?.identity?.uid ?? session?.uid ?? "",
    email: session?.identity?.email ?? session?.email ?? "",
    name: session?.identity?.name ?? session?.name ?? "",
  };
}

export function ${values.appPascal}HomeScreen() {
  const router = useRouter();
  const { session, refreshSession } = useSessionContext();
  const identity = resolveIdentity(session);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack bg="$bg" f={1} p="$4" gap="$4">
        <YStack gap="$1">
          <Heading>${values.displayName}</Heading>
          <Body fontSize="$2" color="$textMuted">
            Example member workspace wired into session and onboarding state.
          </Body>
        </YStack>
        <ProfileCard identity={identity} onPress={() => router.push(${routesIdent}.profile)} />
        <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
          <YStack gap="$1">
            <Heading>Backend session</Heading>
            <Body fontSize="$2" color="$textMuted">User ID: {identity.uid || "Unavailable"}</Body>
            <Body fontSize="$2" color="$textMuted">Email: {identity.email || "Unavailable"}</Body>
            <Body fontSize="$2" color="$textMuted">Onboarding complete: {session?.onboardingCompleted ? "Yes" : "No"}</Body>
          </YStack>
        </View>
        <XStack gap="$3" flexWrap="wrap">
          <Button onPress={() => { void refreshSession(); }} bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Refresh session</Body>
          </Button>
          <Button onPress={() => router.push(${routesIdent}.profile)} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
            <Body>Profile</Body>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
`,
    homeRoute: `import React from "react";
import { ${values.appPascal}HomeScreen } from "../../../src/apps/${values.appId}/features/home/home.screen";

export default function ${values.appPascal}HomeRoute() {
  return <${values.appPascal}HomeScreen />;
}
`,
    profileScreen: `import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { Body, Button, Heading, Input, SafeAreaView, View, XStack, YStack } from "../../../../ui";
import { ProfileCard, useProfileEditViewModel } from "../../../../features/settings";
import { ${routesIdent} } from "../../navigation/routes";

export function ${values.appPascal}ProfileScreen() {
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
      <YStack bg="$bg" f={1} p="$4" gap="$4">
        <XStack ai="center" jc="space-between" gap="$3">
          <Heading>Profile</Heading>
          <Button onPress={() => router.replace(${routesIdent}.home)} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
            <Body>Back</Body>
          </Button>
        </XStack>
        <ProfileCard identity={{ uid: profile.state.uid, email: profile.state.email, name: profile.state.name }} />
        <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
          <YStack gap="$3">
            <Heading>Display name</Heading>
            <Input value={profile.state.name} onChangeText={profile.actions.setDraftName} placeholder="Display name" />
            <Button onPress={() => { void handleSave(); }} disabled={saving || profile.state.name.trim().length < 2} bg="$primary">
              <Body color="$textInverse" fontFamily="$bold">{saving ? "Saving..." : "Save profile"}</Body>
            </Button>
          </YStack>
        </View>
      </YStack>
    </SafeAreaView>
  );
}
`,
    profileRoute: `import React from "react";
import { ${values.appPascal}ProfileScreen } from "../../../src/apps/${values.appId}/features/profile/profile.screen";

export default function ${values.appPascal}ProfileRoute() {
  return <${values.appPascal}ProfileScreen />;
}
`,
    onboardingScreen: `import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../../../services/ApiClient";
import { useSessionContext } from "../../../../providers/SessionProvider";
import { Body, Button, Heading, Input, SafeAreaView, SelectableChip, View, XStack, YStack } from "../../../../ui";
import { ${routesIdent} } from "../../navigation/routes";

type OnboardingQuestionType = "single_select" | "multi_select" | "text";
type OnboardingFlowOption = { id: string; label: string };
type OnboardingFlowField = { id: string; label: string; type: OnboardingQuestionType; options: OnboardingFlowOption[] };
type OnboardingFlowStep = { title: string; description: string; ctaLabel: string; fields: OnboardingFlowField[] };
type OnboardingFlowResponse = { id: string; version: number; name: string; steps: OnboardingFlowStep[] };
type OnboardingSubmitResponse = { success: boolean; uid?: string };
type AnswerValue = string | string[];

function hasValue(value: AnswerValue | undefined): boolean {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" && value.trim().length > 0;
}

export function ${values.appPascal}OnboardingScreen() {
  const router = useRouter();
  const { refreshSession } = useSessionContext();
  const [flow, setFlow] = React.useState<OnboardingFlowResponse | null>(null);
  const [answers, setAnswers] = React.useState<Record<string, AnswerValue>>({});
  const [stepIndex, setStepIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await api.get<OnboardingFlowResponse>("/onboarding/flow");
      if (cancelled) return;
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setFlow(result.data);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const currentStep = flow?.steps[stepIndex];
  const isLastStep = flow ? stepIndex === flow.steps.length - 1 : false;
  const setTextValue = (fieldId: string, value: string) => setAnswers((current) => ({ ...current, [fieldId]: value }));
  const setSingleOption = (fieldId: string, optionId: string) => setAnswers((current) => ({ ...current, [fieldId]: [optionId] }));
  const toggleMultiOption = (fieldId: string, optionId: string) => {
    setAnswers((current) => {
      const existing = Array.isArray(current[fieldId]) ? current[fieldId] : [];
      const next = existing.includes(optionId) ? existing.filter((value) => value !== optionId) : [...existing, optionId];
      return { ...current, [fieldId]: next };
    });
  };
  const canContinue = Boolean(currentStep && currentStep.fields.every((field) => hasValue(answers[field.id])));

  const handleContinue = async () => {
    if (!flow || !currentStep) return;
    if (!isLastStep) {
      setStepIndex((current) => current + 1);
      return;
    }
    setSubmitting(true);
    setError("");
    const payload = {
      answers: flow.steps.flatMap((step) =>
        step.fields.map((field) => {
          const value = answers[field.id];
          if (field.type === "text") return { questionId: field.id, textValue: typeof value === "string" ? value.trim() : "" };
          return { questionId: field.id, optionIds: Array.isArray(value) ? value : [] };
        }),
      ),
      completedAt: { seconds: Math.floor(Date.now() / 1000), nanos: 0 },
    };
    const result = await api.post<OnboardingSubmitResponse>("/onboarding/submit", payload);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    await refreshSession();
    Alert.alert("Onboarding complete", "Your profile setup has been saved.");
    router.replace(${routesIdent}.home);
  };

  if (loading) {
    return <SafeAreaView style={{ flex: 1 }}><YStack bg="$bg" f={1} jc="center" ai="center"><ActivityIndicator size="large" /></YStack></SafeAreaView>;
  }

  if (!flow || !currentStep) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <YStack bg="$bg" f={1} p="$4" jc="center">
          <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
            <YStack gap="$3">
              <Heading>Unable to load onboarding</Heading>
              <Body color="$textMuted">{error || "The onboarding flow is not available right now."}</Body>
              <Button onPress={() => router.replace(${routesIdent}.onboarding)} bg="$primary">
                <Body color="$textInverse" fontFamily="$bold">Try again</Body>
              </Button>
            </YStack>
          </View>
        </YStack>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack bg="$bg" f={1} p="$4" gap="$4">
        <YStack gap="$1">
          <Heading>{currentStep.title}</Heading>
          <Body color="$textMuted">{currentStep.description}</Body>
        </YStack>
        <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$4" p="$4">
          <YStack gap="$4">
          {currentStep.fields.map((field) => {
            const value = answers[field.id];
            return (
              <YStack key={field.id} gap="$3">
                <Heading>{field.label}</Heading>
                {field.type === "text" ? (
                  <Input value={typeof value === "string" ? value : ""} onChangeText={(next) => setTextValue(field.id, next)} placeholder={field.label} />
                ) : (
                  <XStack gap="$3" flexWrap="wrap">
                    {field.options.map((option) => {
                      const selected = Array.isArray(value) ? value.includes(option.id) : false;
                      return (
                        <SelectableChip
                          key={option.id}
                          label={option.label}
                          selected={selected}
                          onPress={() => field.type === "single_select" ? setSingleOption(field.id, option.id) : toggleMultiOption(field.id, option.id)}
                        />
                      );
                    })}
                  </XStack>
                )}
              </YStack>
            );
          })}
          </YStack>
        </View>
        {error ? <Body color="$error">{error}</Body> : null}
        <XStack ai="center" jc="space-between" gap="$3">
          <Body fontSize="$2" color="$textMuted">Step {stepIndex + 1} of {flow.steps.length}</Body>
          <Button onPress={() => { void handleContinue(); }} disabled={!canContinue || submitting} bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">{submitting ? "Saving..." : currentStep.ctaLabel || (isLastStep ? "Finish" : "Continue")}</Body>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
`,
    onboardingRoute: `import React from "react";
import { ${values.appPascal}OnboardingScreen } from "../src/apps/${values.appId}/features/onboarding/onboarding.screen";

export default function ${values.appPascal}OnboardingRoute() {
  return <${values.appPascal}OnboardingScreen />;
}
`,
  };
}

export function initApp({ name, displayName = "", routeBase = "", dryRun = false }) {
  const appId = slugify(name);
  if (!appId) throw new Error("Unable to derive a valid app id from --name.");

  const resolvedDisplayName = displayName.trim() || title(appId);
  const resolvedRouteBase = normalizeRouteBase(routeBase, appId);
  const routerRoot = `app-${appId}`;
  const appPascal = pascal(appId);
  const routesIdent = `${appPascal[0].toLowerCase()}${appPascal.slice(1)}Routes`;
  const values = { appId, displayName: resolvedDisplayName, routeBase: resolvedRouteBase, routerRoot, appPascal, routesIdent };
  const text = renderText(values);
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  if (manifest.apps[appId]) throw new Error(`App '${appId}' already exists in ${rel(MANIFEST_PATH)}.`);

  const files = [
    [path.join(ROOT, "src", "apps", appId, "AGENTS.md"), text.srcAgents],
    [path.join(ROOT, "src", "apps", appId, "navigation", "routes.ts"), text.routesTs],
    [path.join(ROOT, "src", "apps", appId, "features", "home", "home.screen.tsx"), text.homeScreen],
    [path.join(ROOT, "src", "apps", appId, "features", "profile", "profile.screen.tsx"), text.profileScreen],
    [path.join(ROOT, "src", "apps", appId, "features", "onboarding", "onboarding.screen.tsx"), text.onboardingScreen],
    [path.join(ROOT, routerRoot, "AGENTS.md"), text.routerAgents],
    [path.join(ROOT, routerRoot, "_layout.tsx"), text.layout],
    [path.join(ROOT, routerRoot, "index.tsx"), text.rootIndex],
    [path.join(ROOT, routerRoot, "login.tsx"), text.loginRoute],
    [path.join(ROOT, routerRoot, "register.tsx"), text.registerRoute],
    [path.join(ROOT, routerRoot, "forgot-password.tsx"), text.forgotPasswordRoute],
    [path.join(ROOT, routerRoot, "onboarding.tsx"), text.onboardingRoute],
    [routeFilePath(routerRoot, resolvedRouteBase, "index.tsx"), text.homeRoute],
    [routeFilePath(routerRoot, resolvedRouteBase, "profile.tsx"), text.profileRoute],
  ];

  const created = [];
  const skipped = [];
  for (const [file, content] of files) {
    const result = writeIfMissing(file, content, dryRun);
    if (result.created && !result.skipped) created.push(rel(file));
    if (result.skipped) skipped.push(rel(file));
  }

  if (!dryRun) {
    const updatedManifest = {
      ...manifest,
      apps: {
        ...manifest.apps,
        [appId]: {
          appId,
          displayName: resolvedDisplayName,
          routerRoot,
          routeBase: resolvedRouteBase,
          storageNamespace: appId,
        },
      },
    };
    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(updatedManifest, null, 2) + "\n", "utf8");
  }

  return {
    mode: dryRun ? "dry-run" : "write",
    appId,
    displayName: resolvedDisplayName,
    routerRoot,
    routeBase: resolvedRouteBase,
    manifest: rel(MANIFEST_PATH),
    created,
    skipped,
  };
}
