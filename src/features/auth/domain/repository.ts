import { Result } from "../../../core/types";

export type AuthState =
  | { isAuthenticated: false; onboardingComplete: false }
  | { isAuthenticated: true; userId: string; onboardingComplete: boolean };

export interface AuthRepository {
  signIn(email: string, password: string): Promise<Result<{ userId: string }>>;
  signUp(email: string, password: string, fullName?: string): Promise<Result<{ userId: string }>>;
  sendPasswordResetLink(email: string): Promise<Result<void>>;
  signOut(): Promise<Result<void>>;
  checkAuthState(): Promise<Result<AuthState>>;
}
