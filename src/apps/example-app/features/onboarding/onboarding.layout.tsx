import React from "react";
import { Body, Button, Heading, Label, View, XStack, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";

export interface OnboardingLayoutProps {
  stepTitle: string;
  stepDescription: string;
  answerSectionTitle: string;
  options: string[];
  continueLabel: string;
  finishLabel: string;
  stepIndex: number;
  totalSteps: number;
  error: string;
  submitting: boolean;
  isLastStep: boolean;
  onContinue: () => void;
}

export function OnboardingLayout({
  stepTitle = "Step title",
  stepDescription = "Step description goes here.",
  answerSectionTitle = "Your answer",
  options = ["Option A", "Option B", "Option C"],
  continueLabel = "Continue",
  finishLabel = "Finish",
  stepIndex, totalSteps, error, submitting, isLastStep, onContinue,
}: OnboardingLayoutProps) {
  return (
    ui("onboarding-0",
    <YStack f={1} bg="$bg" gap="$4" p="$4">
      {ui("onboarding-1",
      <YStack gap="$2">
        {ui("onboarding-2", <Heading>{stepTitle}</Heading>)}
        {ui("onboarding-3", <Body tone="muted">{stepDescription}</Body>)}
      </YStack>
      )}
      {ui("onboarding-4",
      <View bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$4">
        {ui("onboarding-5",
        <YStack gap="$4">
          {ui("onboarding-6", <Heading size="md">{answerSectionTitle}</Heading>)}
          {ui("onboarding-7",
          <XStack gap="$2" flexWrap="wrap">
            {options.map((opt, i) => (
              <View key={i} px="$3" py="$2" br={999}
                bg={i === 0 ? "$primaryMuted" : "$surfaceAlt"}
                borderColor={i === 0 ? "$primary" : "$borderSubtle"} borderWidth={1}>
                <Body size="sm" tone={i === 0 ? "accent" : "muted"}>{opt}</Body>
              </View>
            ))}
          </XStack>
          )}
        </YStack>
        )}
      </View>
      )}
      {error ? (
        <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
          <Body tone="danger" size="sm">{error}</Body>
        </View>
      ) : null}
      {ui("onboarding-10",
      <XStack jc="space-between" ai="center">
        {ui("onboarding-11", <Label tone="muted">Step {stepIndex + 1} of {totalSteps}</Label>)}
        {ui("onboarding-12", <Button label={isLastStep ? finishLabel : continueLabel} loading={submitting} onPress={onContinue} />)}
      </XStack>
      )}
    </YStack>
    )
  );
}
