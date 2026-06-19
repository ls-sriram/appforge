import { api } from "@api/client";
import type { ApiResult } from "@api/client";
import type { IsoUtcTimestamp } from "@core/dates";

export type SessionIdentity = {
  uid?: string;
  email?: string;
  name?: string;
};

export type SessionMePayload = {
  identity?: SessionIdentity;
  uid?: string;
  email?: string;
  name?: string;
  onboardingCompleted?: boolean;
  createdAt?: IsoUtcTimestamp | string;
  lastLoginAt?: IsoUtcTimestamp | string;
};

let pendingSessionMeRequest: Promise<ApiResult<SessionMePayload>> | null = null;

async function fetchSessionMe(): Promise<ApiResult<SessionMePayload>> {
  try {
    return await api.get<SessionMePayload>("/session/me");
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : "Session check failed.",
    };
  }
}

/**
 * Returns /session/me with in-flight dedupe only (no cache window).
 * Concurrent callers share one request; once settled, next call hits network again.
 */
export async function getSessionMe(): Promise<ApiResult<SessionMePayload>> {
  if (pendingSessionMeRequest) {
    return pendingSessionMeRequest;
  }
  pendingSessionMeRequest = (async () => {
    try {
      return await fetchSessionMe();
    } finally {
      pendingSessionMeRequest = null;
    }
  })();
  return pendingSessionMeRequest;
}

export function isSessionAuthenticated(
  session: SessionMePayload | undefined | null,
): boolean {
  return Boolean(session?.identity?.uid || session?.uid);
}

// Test-only helper to clear singleton state between unit tests.
export function __resetSessionClientForTests() {
  pendingSessionMeRequest = null;
}
