import React from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api } from "../../../../services/ApiClient";
import { useSessionContext } from "../../../../providers/SessionProvider";
import { Block, Button, Input, SelectableChip, Text } from "../../../../ui/primitives";
import { Panel } from "../../../../ui/panels";
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
    router.replace(exampleAppRoutes.home);
  };

  if (loading) {
    return <Block frame="fill" paint="page" safeArea="all" justify="center" align="center"><ActivityIndicator size="large" /></Block>;
  }

  if (!flow || !currentStep) {
    return (
      <Block frame="fill" paint="page" safeArea="all" pad="md" justify="center">
        <Panel variant="muted" pad="md">
          <Block space="sm">
            <Text variant="h3">Unable to load onboarding</Text>
            <Text variant="bodySm" tone="secondary">{error || "The onboarding flow is not available right now."}</Text>
            <Button label="Try again" onPress={() => router.replace(exampleAppRoutes.onboarding)} />
          </Block>
        </Panel>
      </Block>
    );
  }

  return (
    <Block frame="fill" paint="page" safeArea="all" pad="md" space="md">
      <Block space="xs">
        <Text variant="pageTitle">{currentStep.title}</Text>
        <Text variant="bodySm" tone="secondary">{currentStep.description}</Text>
      </Block>
      <Panel pad="md">
        <Block space="md">
          {currentStep.fields.map((field) => {
            const value = answers[field.id];
            return (
              <Block key={field.id} space="sm">
                <Text variant="h3">{field.label}</Text>
                {field.type === "text" ? (
                  <Input value={typeof value === "string" ? value : ""} onChangeText={(next) => setTextValue(field.id, next)} placeholder={field.label} />
                ) : (
                  <Block direction="horizontal" wrap space="sm">
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
                  </Block>
                )}
              </Block>
            );
          })}
        </Block>
      </Panel>
      {error ? <Panel variant="muted" pad="md"><Text variant="bodySm" tone="danger">{error}</Text></Panel> : null}
      <Block direction="horizontal" justify="space-between" align="center">
        <Text variant="caption" tone="muted">Step {stepIndex + 1} of {flow.steps.length}</Text>
        <Button label={submitting ? "Saving..." : currentStep.ctaLabel || (isLastStep ? "Finish" : "Continue")} onPress={() => { void handleContinue(); }} disabled={!canContinue || submitting} fullWidth={false} />
      </Block>
    </Block>
  );
}
