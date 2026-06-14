/**
 * ─────────────────────────────────────────────────────────────────
 * ENVIRONMENTS — Per-environment backend endpoints and config.
 *
 * Selects the right API URL, Firebase project, and feature overrides
 * based on the current environment.
 *
 * Auto-detected from EXPO_PUBLIC_ENV or defaults to 'local'.
 * ─────────────────────────────────────────────────────────────────
 */

import type { FeatureFlags } from "./app";

type EnvName = "local" | "staging" | "production";

interface EnvironmentConfig {
  name: EnvName;
  /** Backend API base URL */
  apiUrl: string;
  /** Firebase project ID (for client-side auth) */
  firebaseProjectId: string;
  /** Firebase API key */
  firebaseApiKey: string;
  /** Override feature flags (merged with app defaults) */
  featureOverrides: Partial<FeatureFlags>;
  /** Whether to use secure cookies */
  cookieSecure: boolean;
}

const environments: Record<EnvName, EnvironmentConfig> = {
  local: {
    name: "local",
    apiUrl: "http://localhost:8080",
    firebaseProjectId: "",
    firebaseApiKey: "",
    featureOverrides: {
      billing: false, // Dodo test mode not configured locally
      analytics: false,
      earlyAccess: false,
    },
    cookieSecure: false,
  },
  staging: {
    name: "staging",
    apiUrl: "https://dev.appforge.example.com",
    firebaseProjectId: "appforge-dev",
    firebaseApiKey: "",
    featureOverrides: {
      billing: true,
      analytics: true,
    },
    cookieSecure: true,
  },
  production: {
    name: "production",
    apiUrl: "https://api.appforge.example.com",
    firebaseProjectId: "appforge-prod",
    firebaseApiKey: "",
    featureOverrides: {
      billing: true,
      analytics: true,
      teamManagement: true,
    },
    cookieSecure: true,
  },
};

/**
 * Current environment — auto-detected from EXPO_PUBLIC_ENV,
 * falls back to 'local'.
 */
export function currentEnv(): EnvironmentConfig {
  const envName = (process.env.EXPO_PUBLIC_ENV as EnvName | undefined) ?? "local";
  return environments[envName] ?? environments.local;
}

/**
 * Convenience getter for API URL.
 */
export function apiUrl(): string {
  return process.env.EXPO_PUBLIC_API_BASE_URL ?? currentEnv().apiUrl;
}
