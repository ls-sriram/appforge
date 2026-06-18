import React from "react";
import { ForgotPasswordLayout } from "../../../../../apps/example-app/features/auth/forgot-password.layout";
import { LoginLayout } from "../../../../../apps/example-app/features/auth/login.layout";
import { RegisterLayout } from "../../../../../apps/example-app/features/auth/register.layout";
import { HomeLayout } from "../../../../../apps/example-app/features/home/home.layout";
import { OnboardingLayout } from "../../../../../apps/example-app/features/onboarding/onboarding.layout";
import { ProfileLayout } from "../../../../../apps/example-app/features/profile/profile.layout";

// Every screen renders its actual layout component so the visualizer canvas
// is pixel-identical to the native app. renderUiNode is not used for screens.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const LIVE_LAYOUTS: Record<string, React.ComponentType<any>> = {
  forgotpassword: ForgotPasswordLayout,
  login: LoginLayout,
  register: RegisterLayout,
  home: HomeLayout,
  onboarding: OnboardingLayout,
  profile: ProfileLayout,
};
