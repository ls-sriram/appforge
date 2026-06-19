/**
 * ─────────────────────────────────────────────────────────────────
 * REGISTER MODEL — Auth via backend API.
 *
 * Delegates all auth calls to AuthService (backend-backed).
 * Thin adapter: no direct Firebase or HTTP imports.
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "@core/types";
import { AuthRepository } from "../auth/domain/repository";
import { BackendAuthRepository } from "../auth/data/backend-auth.repository";
import { signUp } from "../auth/usecases/sign-up";

export interface RegisterState {
  userId?: string;
}

export interface RegisterModel {
  registerWithEmailAndPassword(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<Result<{ userId: string }>>;
}

/**
 * AuthService-backed implementation.
 * Defaults to BackendAuthService (connects to the AppForge server).
 * Swappable for mock/testing.
 */
export class FirebaseRegisterModel implements RegisterModel {
  private repository: AuthRepository;

  constructor(repository?: AuthRepository) {
    this.repository = repository ?? new BackendAuthRepository();
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<Result<{ userId: string }>> {
    console.log("[register][model] signUp usecase start", { emailLength: email.length });
    const result = await signUp(this.repository, email, password, fullName);
    console.log("[register][model] signUp usecase result", {
      ok: result.ok,
      error: result.ok ? null : result.error,
    });
    return result;
  }
}
