import React from "react";
import { createUi, YStack, type UiStamp } from "../index";
import { LoginSurface } from "../../../features/login/ui/LoginSurface";
import { RegisterSurface } from "../../../features/register/ui/RegisterSurface";
import { ForgotPasswordSurface } from "../../../features/auth/ForgotPasswordSurface";
import { OnboardingScaffold } from "../../../features/onboarding/ui/OnboardingScaffold";
import { OnboardingStepperBlock } from "../../../features/onboarding/ui/OnboardingStepperBlock";
import { OnboardingHeroBlock } from "../../../features/onboarding/ui/OnboardingHeroBlock";
import { OnboardingQuestionBlock } from "../../../features/onboarding/ui/OnboardingQuestionBlock";
import { OnboardingChipsBlock } from "../../../features/onboarding/ui/OnboardingChipsBlock";
import { AuthWelcomeBlock } from "../../../features/auth/ui/blocks/AuthWelcomeBlock";
import { AuthFormBlock } from "../../../features/auth/ui/blocks/AuthFormBlock";
import { AuthFieldBlock } from "../../../features/auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../../../features/auth/ui/blocks/AuthSubmitBlock";

export interface VisualizerScreenRegistration {
  id: string;
  label: string;
  sourcePath: string;
  feature?: string;
  kind: "screen";
  renderPreview: () => React.ReactElement;
}

export interface VisualizerBlockRegistration {
  id: string;
  label: string;
  sourcePath: string;
  feature?: string;
  kind: "block";
  renderPreview: (ui: UiStamp) => React.ReactElement;
}

export const VISUALIZER_SCREENS: VisualizerScreenRegistration[] = [
  {
    id: "login",
    label: "Login",
    sourcePath: "src/features/login/ui/LoginSurface.tsx",
    feature: "login",
    kind: "screen",
    renderPreview: () => (
      <LoginSurface
        ui={createUi("login")}
        data={{ email: "", password: "", emailError: "", passwordError: "", generalError: "", loading: false, isAuthenticated: false }}
        dispatch={() => {}}
      />
    ),
  },
  {
    id: "register",
    label: "Register",
    sourcePath: "src/features/register/ui/RegisterSurface.tsx",
    feature: "register",
    kind: "screen",
    renderPreview: () => (
      <RegisterSurface
        ui={createUi("register")}
        data={{ fullName: "", fullNameError: "", email: "", emailError: "", password: "", passwordError: "", generalError: "", loading: false, registered: false }}
        dispatch={() => {}}
      />
    ),
  },
  {
    id: "forgot-password",
    label: "Forgot Password",
    sourcePath: "src/features/auth/ForgotPasswordSurface.tsx",
    feature: "auth",
    kind: "screen",
    renderPreview: () => (
      <ForgotPasswordSurface
        ui={createUi("forgot-password")}
        data={{ email: "", emailError: "", generalError: "", loading: false, isSuccess: false }}
        dispatch={() => {}}
      />
    ),
  },
  {
    id: "onboarding",
    label: "Onboarding",
    sourcePath: "src/features/onboarding/ui/OnboardingScaffold.tsx",
    feature: "onboarding",
    kind: "screen",
    renderPreview: () => {
      const ui = createUi("onboarding");
      return (
        <YStack {...ui("root")} bg="$bg" f={1} p="$4" gap="$4">
          <OnboardingStepperBlock ui={ui.scope("stepper")} step={1} total={3} />
          <OnboardingScaffold
            ui={ui.scope("scaffold")}
            stepper={null}
            hero={
              <OnboardingHeroBlock
                ui={ui.scope("hero")}
                title="Tell us about yourself"
                subtitle="This helps us personalize your experience."
              />
            }
            question={<OnboardingQuestionBlock ui={ui.scope("question")} text="What best describes you?" />}
            answerRegion={
              <OnboardingChipsBlock
                ui={ui.scope("answers")}
                options={["Beginner", "Intermediate", "Advanced"]}
                selected="Intermediate"
              />
            }
          />
        </YStack>
      );
    },
  },
];

export const VISUALIZER_BLOCKS: VisualizerBlockRegistration[] = [
  {
    id: "auth-welcome",
    label: "Auth Welcome",
    sourcePath: "src/features/auth/ui/blocks/AuthWelcomeBlock.tsx",
    feature: "auth",
    kind: "block",
    renderPreview: (ui) => (
      <AuthWelcomeBlock
        ui={ui}
        onSignIn={() => {}}
        onCreateAccount={() => {}}
      />
    ),
  },
  {
    id: "auth-form",
    label: "Auth Form",
    sourcePath: "src/features/auth/ui/blocks/AuthFormBlock.tsx",
    feature: "auth",
    kind: "block",
    renderPreview: (ui) => (
      <AuthFormBlock
        ui={ui}
        subtitle="Use your account to continue."
        showTerms
        footer={{ prompt: "Need an account?", linkLabel: "Create one", onPress: () => {} }}
      >
        <AuthFieldBlock
          ui={ui.scope("email")}
          icon="user"
          placeholder="Email"
          value="alex@example.com"
          onChangeText={() => {}}
        />
        <AuthSubmitBlock
          ui={ui.scope("submit")}
          label="Continue"
          loading={false}
          onPress={() => {}}
        />
      </AuthFormBlock>
    ),
  },
  {
    id: "auth-field",
    label: "Auth Field",
    sourcePath: "src/features/auth/ui/blocks/AuthFieldBlock.tsx",
    feature: "auth",
    kind: "block",
    renderPreview: (ui) => (
      <AuthFieldBlock
        ui={ui}
        icon="user"
        placeholder="Email"
        value="alex@example.com"
        onChangeText={() => {}}
        error="Required field"
      />
    ),
  },
  {
    id: "auth-submit",
    label: "Auth Submit",
    sourcePath: "src/features/auth/ui/blocks/AuthSubmitBlock.tsx",
    feature: "auth",
    kind: "block",
    renderPreview: (ui) => (
      <AuthSubmitBlock
        ui={ui}
        label="Continue"
        loading={false}
        generalError="Something went wrong"
        onPress={() => {}}
      />
    ),
  },
  {
    id: "onboarding-hero",
    label: "Onboarding Hero",
    sourcePath: "src/features/onboarding/ui/OnboardingHeroBlock.tsx",
    feature: "onboarding",
    kind: "block",
    renderPreview: (ui) => (
      <OnboardingHeroBlock
        ui={ui}
        title="Tell us about yourself"
        subtitle="This helps us personalize your experience."
      />
    ),
  },
  {
    id: "onboarding-question",
    label: "Onboarding Question",
    sourcePath: "src/features/onboarding/ui/OnboardingQuestionBlock.tsx",
    feature: "onboarding",
    kind: "block",
    renderPreview: (ui) => (
      <OnboardingQuestionBlock
        ui={ui}
        text="What best describes you?"
      />
    ),
  },
  {
    id: "onboarding-chips",
    label: "Onboarding Chips",
    sourcePath: "src/features/onboarding/ui/OnboardingChipsBlock.tsx",
    feature: "onboarding",
    kind: "block",
    renderPreview: (ui) => (
      <OnboardingChipsBlock
        ui={ui}
        options={["Beginner", "Intermediate", "Advanced"]}
        selected="Intermediate"
      />
    ),
  },
  {
    id: "onboarding-stepper",
    label: "Onboarding Stepper",
    sourcePath: "src/features/onboarding/ui/OnboardingStepperBlock.tsx",
    feature: "onboarding",
    kind: "block",
    renderPreview: (ui) => (
      <OnboardingStepperBlock
        ui={ui}
        step={1}
        total={3}
      />
    ),
  },
];

export function createBlockUi(blockId: string) {
  return createUi(`blocks.${blockId}`);
}
