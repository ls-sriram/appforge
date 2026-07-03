/**
 * ─────────────────────────────────────────────────────────────────
 * REGISTER SERVICE — Auth via backend API.
 *
 * Delegates all auth calls to AuthService (backend-backed).
 * Thin adapter: no direct Firebase or HTTP imports.
 * ─────────────────────────────────────────────────────────────────
 */

import { Result } from "../../platform/core/types";
import { AuthRepository } from "../auth/auth.repository";
import { BackendAuthRepository } from "../auth/backend-auth.datasource";

export interface RegisterState {
  userId?: string;
}

export interface RegisterService {
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
export class FirebaseRegisterService implements RegisterService {
  private repository: AuthRepository;

  constructor(repository?: AuthRepository) {
    this.repository = repository ?? new BackendAuthRepository();
  }

  async registerWithEmailAndPassword(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<Result<{ userId: string }>> {
    console.log("[register][service] signUp start", { emailLength: email.length });
    const result = await this.repository.signUp(email, password, fullName);
    console.log("[register][service] signUp result", {
      ok: result.ok,
      error: result.ok ? null : result.error,
    });
    return result;
  }
}
