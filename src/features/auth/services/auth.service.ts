/**
 * ─────────────────────────────────────────────────────────────────
 * AUTH SERVICE — Modular Firebase API gateway.
 *
 * Single point of contact for all Firebase auth operations.
 * Controllers call models. Models call this service.
 * Never imported by views or controllers directly.
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "../../../platform/core/types";
import { getFirebaseAuth } from "../../../config/firebase";
import type { AuthState } from "../domain/repository";

// ─── Domain types ────────────────────────────────────────────────

export interface AuthUser {
  uid: string;
  email?: string;
}

// ─── Service interface ───────────────────────────────────────────

export interface AuthService {
  signIn(email: string, password: string): Promise<Result<{ userId: string }>>;
  signUp(email: string, password: string, fullName?: string): Promise<Result<{ userId: string }>>;
  sendPasswordResetLink(email: string): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  checkAuthState(): Promise<Result<AuthState>>;
}

// ─── Firebase-backed implementation ──────────────────────────────

export class FirebaseAuthService implements AuthService {
  async signIn(email: string, password: string): Promise<Result<{ userId: string }>> {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return { ok: true, data: { userId: cred.user.uid } };
    } catch (err: unknown) {
      return { ok: false, error: mapAuthError(err) };
    }
  }

  async signUp(email: string, password: string, _fullName?: string): Promise<Result<{ userId: string }>> {
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const auth = getFirebaseAuth();
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      return { ok: true, data: { userId: cred.user.uid } };
    } catch (err: unknown) {
      return { ok: false, error: mapAuthError(err) };
    }
  }

  async signOut(): Promise<Result<void>> {
    try {
      const { signOut } = await import("firebase/auth");
      const auth = getFirebaseAuth();
      await signOut(auth);
      return { ok: true, data: undefined };
    } catch (err: unknown) {
      return { ok: false, error: mapAuthError(err) };
    }
  }

  async sendPasswordResetLink(): Promise<Result<void>> {
    return { ok: false, error: "Password reset link is only supported via backend auth service." };
  }

  async checkAuthState(): Promise<Result<AuthState>> {
    try {
      const auth = getFirebaseAuth();
      const user = auth.currentUser;
      if (!user?.uid) {
        return { ok: true, data: { isAuthenticated: false, onboardingComplete: false } };
      }
      return { ok: true, data: { isAuthenticated: true, userId: user.uid, onboardingComplete: false } };
    } catch (err: unknown) {
      return { ok: false, error: mapAuthError(err) };
    }
  }
}

// ─── Error mapper ────────────────────────────────────────────────

function mapAuthError(err: unknown): string {
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
  return "An unexpected error occurred.";
}
