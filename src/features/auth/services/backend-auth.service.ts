/**
 * ─────────────────────────────────────────────────────────────────
 * BACKEND AUTH SERVICE — Connects frontend to the AppForge backend.
 *
 * Flow:
 *   1. Firebase Auth (on device) → ID token
 *   2. POST /session/login → backend verifies → session cookie set
 *   3. All subsequent requests use the cookie
 *
 * The backend owns session state. Firebase only issues ID tokens.
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "@core/types";
import { callProto } from "@api/proto-client";
import { api } from "@api/client";
import type { AuthState } from "../domain/repository";
import type {
  SessionLoginRequest,
  SessionLoginResponse,
  SessionLogoutResponse,
  SessionMeResponse,
} from "../../../generated/proto/auth/v1/auth";

// ─── Service interface ───────────────────────────────────────────

export interface AuthService {
  signIn(email: string, password: string): Promise<Result<{ userId: string }>>;
  signUp(email: string, password: string, fullName?: string): Promise<Result<{ userId: string }>>;
  sendPasswordResetLink(email: string): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  checkAuthState(): Promise<Result<AuthState>>;
}

// ─── Backend implementation ──────────────────────────────────────

export class BackendAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<Result<{ userId: string }>> {
    try {
      // Step 1: Firebase Auth REST → ID token
      const authResult = await firebaseEmailPasswordAuth("signIn", email, password);
      if (!authResult.ok) {
        return { ok: false, error: authResult.error };
      }
      const { idToken, localId } = authResult.data;

      // Step 2: Backend login → session cookie
      const body: SessionLoginRequest = { idToken };
      const result = await callProto<SessionLoginRequest, SessionLoginResponse>(
        "auth.v1.AuthService.SessionLogin",
        body,
      );

      if (!result.ok) {
        return { ok: false, error: result.error };
      }

      return { ok: true, data: { userId: localId } };
    } catch (err: unknown) {
      return { ok: false, error: mapError(err) };
    }
  }

  async signUp(email: string, password: string, fullName?: string): Promise<Result<{ userId: string }>> {
    try {
      const authResult = await firebaseEmailPasswordAuth("signUp", email, password);
      if (!authResult.ok) {
        return { ok: false, error: authResult.error };
      }
      const { idToken, localId } = authResult.data;
      if (fullName && fullName.trim().length > 0) {
        const displayNameResult = await firebaseUpdateProfileDisplayName(idToken, fullName.trim());
        if (!displayNameResult.ok) {
          return { ok: false, error: displayNameResult.error };
        }
      }
      const loginResult = await callProto<SessionLoginRequest, SessionLoginResponse>(
        "auth.v1.AuthService.SessionLogin",
        { idToken },
      );

      if (!loginResult.ok) {
        return { ok: false, error: loginResult.error };
      }

      return { ok: true, data: { userId: localId } };
    } catch (err: unknown) {
      return { ok: false, error: mapError(err) };
    }
  }

  async signOut(): Promise<Result<void>> {
    try {
      await callProto<Record<string, never>, SessionLogoutResponse>(
        "auth.v1.AuthService.SessionLogout",
        {},
      );
      return { ok: true, data: undefined };
    } catch (err: unknown) {
      return { ok: false, error: mapError(err) };
    }
  }

  async sendPasswordResetLink(email: string): Promise<Result<void>> {
    const normalizedEmail = email.trim();
    const result = await api.post<{ success: boolean }>("/session/password/reset-link", {
      email: normalizedEmail,
    });
    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    if (!result.data.success) {
      return { ok: false, error: "Failed to send password reset link." };
    }
    return { ok: true, data: undefined };
  }

  async checkAuthState(): Promise<Result<AuthState>> {
    try {
      const result = await callProto<Record<string, never>, SessionMeResponse>(
        "auth.v1.AuthService.SessionMe",
      );

      if (!result.ok) {
        return { ok: true, data: { isAuthenticated: false, onboardingComplete: false } };
      }

      const identity = result.data.identity;
      const fallbackUid = (result.data as unknown as { uid?: string }).uid;
      const onboardingComplete =
        (result.data as unknown as { onboardingCompleted?: boolean }).onboardingCompleted ?? false;
      const userId = identity?.uid ?? fallbackUid;
      if (!userId) {
        return { ok: true, data: { isAuthenticated: false, onboardingComplete: false } };
      }
      return {
        ok: true,
        data: {
          isAuthenticated: true,
          userId,
          onboardingComplete,
        },
      };
    } catch {
      return { ok: true, data: { isAuthenticated: false, onboardingComplete: false } };
    }
  }

}

type FirebaseAuthMode = "signIn" | "signUp";

interface FirebaseEmailPasswordResponse {
  idToken: string;
  localId: string;
}

async function firebaseEmailPasswordAuth(
  mode: FirebaseAuthMode,
  email: string,
  password: string,
): Promise<Result<FirebaseEmailPasswordResponse>> {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "";
  if (!apiKey) {
    return { ok: false, error: "Missing EXPO_PUBLIC_FIREBASE_API_KEY." };
  }

  const endpoint =
    mode === "signUp"
      ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
      : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const json = (await response.json()) as
      | { idToken: string; localId: string }
      | { error?: { message?: string } };

    if (!response.ok || !("idToken" in json) || !("localId" in json)) {
      const code = "error" in json ? (json.error?.message ?? "") : "";
      return { ok: false, error: mapFirebaseRestError(code) };
    }

    return {
      ok: true,
      data: { idToken: json.idToken, localId: json.localId },
    };
  } catch {
    return { ok: false, error: "Network error. Check your connection." };
  }
}

async function firebaseUpdateProfileDisplayName(
  idToken: string,
  displayName: string,
): Promise<Result<void>> {
  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY ?? "";
  if (!apiKey) {
    return { ok: false, error: "Missing EXPO_PUBLIC_FIREBASE_API_KEY." };
  }
  try {
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken,
          displayName,
          returnSecureToken: false,
        }),
      },
    );
    if (!response.ok) {
      return { ok: false, error: "Failed to save profile name. Please try again." };
    }
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, error: "Network error. Check your connection." };
  }
}

function mapFirebaseRestError(code: string): string {
  switch (code) {
    case "EMAIL_NOT_FOUND":
    case "INVALID_PASSWORD":
    case "INVALID_LOGIN_CREDENTIALS":
      return "Invalid email or password.";
    case "EMAIL_EXISTS":
      return "An account with this email already exists.";
    case "WEAK_PASSWORD : Password should be at least 6 characters":
    case "WEAK_PASSWORD":
      return "Password must be at least 6 characters.";
    case "OPERATION_NOT_ALLOWED":
      return "Email/password sign-in is disabled in Firebase Auth.";
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      return "Too many attempts. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

// ─── Error mapper ────────────────────────────────────────────────

function mapError(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = (err as { code: string }).code;
    switch (code) {
      case "auth/invalid-credential":
      case "auth/wrong-password":
        return "Invalid email or password.";
      case "auth/user-not-found":
        return "No account found with this email.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";
      case "auth/network-request-failed":
        return "Network error. Check your connection.";
      case "auth/configuration-not-found":
        return "Firebase Auth is not configured for this project. Enable Email/Password in Firebase Console.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "An unexpected error occurred.";
}
