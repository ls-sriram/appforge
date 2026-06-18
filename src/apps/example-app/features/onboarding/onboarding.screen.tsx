import React from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView, View, Body } from "../../../../ui";
import { app } from "../../../../config/app";
import { api } from "../../../../services/ApiClient";
import { useSessionContext } from "../../../../providers/SessionProvider";
import { exampleAppRoutes } from "../../navigation/routes";
import { OnboardingLayout } from "./onboarding.layout";

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
      if (!result.ok) { setError(result.error); setLoading(false); return; }
      setFlow(result.data);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const currentStep = flow?.steps[stepIndex];
  const isLastStep = flow ? stepIndex === flow.steps.length - 1 : false;
  const canContinue = Boolean(currentStep && currentStep.fields.every((f) => hasValue(answers[f.id])));

  const handleContinue = async () => {
    if (!flow || !currentStep) return;
    if (!isLastStep) { setStepIndex((i) => i + 1); return; }
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
    if (!result.ok) { setError(result.error); return; }
    await refreshSession();
    Alert.alert("Onboarding complete", "Your profile setup has been saved.");
    router.replace(exampleAppRoutes.home);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View f={1} bg="$bg" jc="center" ai="center">
          <Body color="$textMuted">Loading…</Body>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <OnboardingLayout
        stepTitle={currentStep?.title ?? ""}
        stepDescription={currentStep?.description ?? ""}
        answerSectionTitle={app.copy.onboarding.answerSectionTitle}
        options={(currentStep?.fields[0]?.options ?? []).map((o) => o.label)}
        continueLabel={app.copy.onboarding.continueLabel}
        finishLabel={app.copy.onboarding.finishLabel}
        stepIndex={stepIndex}
        totalSteps={flow?.steps.length ?? 1}
        error={error}
        submitting={submitting}
        isLastStep={isLastStep}
        onContinue={() => { void handleContinue(); }}
      />
    </SafeAreaView>
  );
}
