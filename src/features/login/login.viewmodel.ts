/**
 * ─────────────────────────────────────────────────────────────────
 * LOGIN VIEWMODEL — Owns view state and coordinates auth actions.
 *
 * Responsibilities:
 *   - Receives actions from the view
 *   - Calls auth use cases through the repository boundary
 *   - Formats data for the view
 *   - Manages loading state, errors, navigation outcomes
 *
 * NO UI rendering (delegates to the view).
 * ─────────────────────────────────────────────────────────────────
 */

import { Controller, Result } from "../../platform/core/types";
import { AuthRepository, AuthState } from "../auth/auth.repository";
import { BackendAuthRepository } from "../auth/backend-auth.datasource";
import { signIn } from "../auth/sign-in.usecase";
import { signOut } from "../auth/sign-out.usecase";
import { checkAuthState } from "../auth/check-auth-state.usecase";
import { createMockEntitlementSnapshot } from "../entitlements/entitlements.model";
import { clearEntitlementSnapshot, setEntitlementSnapshot } from "../entitlements/entitlements.store";

// ─── View Data ───────────────────────────────────────────────────

export interface LoginViewData {
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  generalError: string;
  loading: boolean;
  isAuthenticated: boolean;
}

// ─── View Actions ────────────────────────────────────────────────

export type LoginAction =
  | { type: "email_changed"; value: string }
  | { type: "password_changed"; value: string }
  | { type: "submit" }
  | { type: "sign_out" }
      | { type: "go_to_register" }
      | { type: "go_to_forgot_password" };

export interface LoginGateway {
  signInWithEmailAndPassword(
    email: string,
    password: string,
  ): Promise<Result<{ userId: string }>>;
  signOut(): Promise<Result<void>>;
  checkAuthState(): Promise<Result<AuthState>>;
}

export class AuthLoginGateway implements LoginGateway {
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

export class LoginViewModel implements Controller<LoginViewData, LoginAction> {
  private gateway: LoginGateway;
  private bypassValidation: boolean;
  private email = "";
  private password = "";
  private emailError = "";
  private passwordError = "";
  private generalError = "";
  private loading = false;
  private isAuthenticated = false;

  constructor(gateway: LoginGateway = new AuthLoginGateway(), options?: { bypassValidation?: boolean }) {
    this.gateway = gateway;
    this.bypassValidation = options?.bypassValidation ?? false;
  }

  getInitialData(): LoginViewData {
    return this.snapshot();
  }

  async dispatch(action: LoginAction): Promise<LoginViewData> {
    switch (action.type) {
      case "email_changed":
        this.email = action.value;
        this.emailError = this.validateEmail(action.value);
        break;

      case "password_changed":
        this.password = action.value;
        this.passwordError = this.validatePassword(action.value);
        break;

      case "submit":
        this.loading = true;
        this.generalError = "";
        this.emailError = this.bypassValidation ? "" : this.validateEmail(this.email);
        this.passwordError = this.bypassValidation ? "" : this.validatePassword(this.password);

        if (this.emailError || this.passwordError) {
          this.loading = false;
          break;
        }

        const result = await this.gateway.signInWithEmailAndPassword(
          this.email,
          this.password,
        );

        if (result.ok) {
          setEntitlementSnapshot(createMockEntitlementSnapshot(result.data.userId, "trial"));
          this.isAuthenticated = true;
          this.generalError = "";
        } else {
          this.generalError = result.error;
        }
        this.loading = false;
        break;

      case "sign_out":
        await this.gateway.signOut();
        clearEntitlementSnapshot();
        this.isAuthenticated = false;
        this.email = "";
        this.password = "";
        this.generalError = "";
        this.emailError = "";
        this.passwordError = "";
        break;

      case "go_to_register":
      case "go_to_forgot_password":
        break;
    }

    return this.snapshot();
  }

  private snapshot(): LoginViewData {
    return {
      email: this.email,
      password: this.password,
      emailError: this.emailError,
      passwordError: this.passwordError,
      generalError: this.generalError,
      loading: this.loading,
      isAuthenticated: this.isAuthenticated,
    };
  }

  private validateEmail(value: string): string {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    return "";
  }

  private validatePassword(value: string): string {
    if (!value) return "Password is required.";
    return "";
  }
}
