import React from "react";
import { createUi, type UiStamp } from "../index";
import { LoginLayout } from "../../../features/login/login.stage";
import { RegisterLayout } from "../../../features/register/register.stage";
import { ForgotPasswordLayout } from "../../../features/auth/forgot-password.stage";
import { OnboardingLayout } from "../../../features/onboarding/onboarding.stage";
import { AuthWelcomeBlock } from "../../../features/auth/ui/blocks/AuthWelcomeBlock";
import { AuthFormBlock } from "../../../features/auth/ui/blocks/AuthFormBlock";
import { AuthFieldBlock } from "../../../features/auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../../../features/auth/ui/blocks/AuthSubmitBlock";
import { OnboardingHeroBlock } from "../../../features/onboarding/ui/OnboardingHeroBlock";
import { OnboardingQuestionBlock } from "../../../features/onboarding/ui/OnboardingQuestionBlock";
import { OnboardingChipsBlock } from "../../../features/onboarding/ui/OnboardingChipsBlock";
import { OnboardingStepperBlock } from "../../../features/onboarding/ui/OnboardingStepperBlock";

export interface VisualizerScreenRegistration {
  id: string;
  label: string;
  sourcePath: string;
  feature?: string;
  kind: "screen";
  Component: React.ComponentType;
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
    sourcePath: "src/features/login/login.stage.tsx",
    feature: "login",
    kind: "screen",
    Component: LoginLayout,
  },
  {
    id: "register",
    label: "Register",
    sourcePath: "src/features/register/register.stage.tsx",
    feature: "register",
    kind: "screen",
    Component: RegisterLayout,
  },
  {
    id: "forgot-password",
    label: "Forgot Password",
    sourcePath: "src/features/auth/forgot-password.stage.tsx",
    feature: "auth",
    kind: "screen",
    Component: ForgotPasswordLayout,
  },
  {
    id: "onboarding",
    label: "Onboarding",
    sourcePath: "src/features/onboarding/onboarding.stage.tsx",
    feature: "onboarding",
    kind: "screen",
    Component: OnboardingLayout,
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
