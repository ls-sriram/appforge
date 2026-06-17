import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../../../services/ApiClient";
import { useSessionContext } from "../../../../providers/SessionProvider";
import {
  Body,
  Button,
  Display,
  Heading,
  Input,
  Label,
  SafeAreaView,
  SelectableChip,
  View,
  XStack,
  YStack,
} from "../../../../ui";
import { exampleAppRoutes } from "../../navigation/routes";

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

export function ExampleAppOnboardingScreen() {
  const router = useRouter();
  const { refreshSession } = useSessionContext();
  const [flow, setFlow] = React.useState<OnboardingFlowResponse>();
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
    router.replace(exampleAppRoutes.home);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View f={1} bg="$bg" jc="center" ai="center">
        <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!flow || !currentStep) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View f={1} bg="$bg" p="$4" jc="center" ai="center">
          <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4" w="100%" maxWidth={640}>
            <YStack gap="$3">
              <Heading>Unable to load onboarding</Heading>
              <Body color="$textMuted">{error || "The onboarding flow is not available right now."}</Body>
              <Button onPress={() => router.replace(exampleAppRoutes.onboarding)} bg="$primary">
                <Body color="$textInverse" fontFamily="$bold">Try again</Body>
              </Button>
            </YStack>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack f={1} bg="$bg" gap="$4" p="$4">
        <YStack gap="$2">
          <Display>{currentStep.title}</Display>
          <Body color="$textMuted">{currentStep.description}</Body>
        </YStack>
        <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
          <YStack gap="$4">
            {currentStep.fields.map((field) => {
              const value = answers[field.id];
              return (
                <YStack key={field.id} gap="$3">
                  <Heading fontSize="$4">{field.label}</Heading>
                  {field.type === "text" ? (
                    <Input value={typeof value === "string" ? value : ""} onChangeText={(next) => setTextValue(field.id, next)} placeholder={field.label} />
                  ) : (
                    <XStack flexWrap="wrap" gap="$3">
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
        {error ? (
          <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
            <Body color="$error" fontSize="$2">{error}</Body>
          </View>
        ) : null}
        <XStack jc="space-between" ai="center">
          <Label color="$textMuted">Step {stepIndex + 1} of {flow.steps.length}</Label>
          <Button
            onPress={() => {
              void handleContinue();
            }}
            disabled={!canContinue || submitting}
            bg="$primary"
            opacity={!canContinue || submitting ? 0.45 : 1}
          >
            <Body color="$textInverse" fontFamily="$bold">
              {submitting ? "Saving..." : currentStep.ctaLabel || (isLastStep ? "Finish" : "Continue")}
            </Body>
          </Button>
        </XStack>
      </YStack>
    </SafeAreaView>
  );
}
