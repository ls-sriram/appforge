/**
 * ─────────────────────────────────────────────────────────────────
 * APP CONFIG — Per-app identity, feature flags, and branding.
 *
 * This is the single source of truth for what this frontend instance is.
 * When launching a new app, only this file needs to change.
 * ─────────────────────────────────────────────────────────────────
 */

import { BUILD_APP_DISPLAY_NAME, BUILD_APP_ID } from "../generated/build-app-config";

/**
 * Feature flags — gate entire sections of the UI.
 * Toggle these per environment in environments.ts.
 */
export interface FeatureFlags {
  billing: boolean;
  analytics: boolean;
  teamManagement: boolean;
  aiReviews: boolean;
  fileUploads: boolean;
  sharing: boolean;
  earlyAccess: boolean;
}

/**
 * App identity — branding and metadata.
 */
export interface AppConfig {
  /** Unique app identifier, sent as X-App-Id header to backend */
  appId: string;
  /** Display name */
  name: string;
  /** Short tagline */
  tagline: string;
  /** Support email */
  supportEmail: string;
  /** App version shown in UI copy */
  versionLabel: string;
  /** Frontend-visible copy and labels */
  copy: {
    aboutLabel: string;
    onboardingFlowName: string;
    auth: {
      loginSubtitle: string;
      registerSubtitle: string;
      forgotPasswordTitle: string;
      forgotPasswordSubtitle: string;
      forgotPasswordSuccessTitle: string;
      forgotPasswordSuccessMessage: string;
    };
    settings: {
      deleteAccountTitle: string;
      deleteAccountConfirmMessage: string;
      deleteAccountErrorTitle: string;
      sessionsTitle: string;
      sessionsComingSoon: string;
      passwordTitle: string;
      passwordComingSoon: string;
      helpTitle: string;
      helpComingSoon: string;
      supportTitle: string;
      supportComingSoon: string;
    };
  };
  /** Default feature flags for this app */
  features: FeatureFlags;
}

/**
 * Current app configuration.
 * Change this to launch a new app with different branding.
 */
export const app: AppConfig = {
  appId: BUILD_APP_ID,
  name: BUILD_APP_DISPLAY_NAME,
  tagline: "Analytics & Insights",
  supportEmail: "support@appforge.dev",
  versionLabel: "v0.1.0",
  copy: {
    aboutLabel: `About ${BUILD_APP_DISPLAY_NAME}`,
    onboardingFlowName: `${BUILD_APP_DISPLAY_NAME} onboarding`,
    auth: {
      loginSubtitle: "Enter info to jump back into the app.",
      registerSubtitle: "Sign up to start boosting your scores.",
      forgotPasswordTitle: "Forgot password",
      forgotPasswordSubtitle: "We will send you a reset link",
      forgotPasswordSuccessTitle: "Reset Link Sent",
      forgotPasswordSuccessMessage: "Check your email for password reset instructions.",
    },
    settings: {
      deleteAccountTitle: "Delete Account",
      deleteAccountConfirmMessage:
        "This will permanently delete your account and all associated data. This action cannot be undone.",
      deleteAccountErrorTitle: "Delete failed",
      sessionsTitle: "Sessions",
      sessionsComingSoon: "Session management coming soon.",
      passwordTitle: "Password",
      passwordComingSoon: "Password change flow coming soon.",
      helpTitle: "Help",
      helpComingSoon: "Help center coming soon.",
      supportTitle: "Support",
      supportComingSoon: "Support contact form coming soon.",
    },
  },
  features: {
    billing: true,
    analytics: true,
    teamManagement: false,
    aiReviews: false,
    fileUploads: true,
    sharing: true,
    earlyAccess: false,
  },
};

/**
 * Feature flag hook — use in components to conditionally render.
 *
 *   if (useFeature('billing')) { <PlanCard /> }
 */
export function useFeature(flag: keyof FeatureFlags): boolean {
  return app.features[flag];
}

export const config = {};
