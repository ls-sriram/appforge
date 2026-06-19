/**
 * ─────────────────────────────────────────────────────────────────
 * LOGIN MODEL — Auth via backend API.
 *
 * Delegates all auth calls to AuthService (backend-backed).
 * Thin adapter: no direct Firebase or HTTP imports.
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "@core/types";
import { AuthRepository, AuthState } from "../auth/domain/repository";
import { BackendAuthRepository } from "../auth/data/backend-auth.repository";
import { signIn } from "../auth/usecases/sign-in";
import { signOut } from "../auth/usecases/sign-out";
import { checkAuthState } from "../auth/usecases/check-auth-state";

export interface LoginState {
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  userId?: string;
}

export interface LoginModel {
  signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Result<{ userId: string }>>;
  signOut(): Promise<Result<void>>;
  checkAuthState(): Promise<Result<AuthState>>;
}

/**
 * AuthService-backed implementation.
 * Defaults to BackendAuthService (connects to the AppForge server).
 * Swappable for mock/testing.
 */
export class FirebaseLoginModel implements LoginModel {
  private repository: AuthRepository;

  constructor(repository?: AuthRepository) {
    this.repository = repository ?? new BackendAuthRepository();
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Result<{ userId: string }>> {
    return signIn(this.repository, email, password);
  }

  async signOut(): Promise<Result<void>> {
    return signOut(this.repository);
  }

  async checkAuthState(): Promise<Result<AuthState>> {
    return checkAuthState(this.repository);
  }
}
