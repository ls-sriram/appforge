/**
 * ─────────────────────────────────────────────────────────────────
 * LOGIN CONTROLLER — Mediates between View and Model.
 *
 * Responsibilities:
 *   - Receives actions from the view
 *   - Calls model methods
 *   - Formats data for the view
 *   - Manages loading state, errors, navigation
 *
 * NO direct Firebase calls (delegates to model).
 * NO UI rendering (delegates to view).
 * ─────────────────────────────────────────────────────────────────
 */

import { Controller, Result } from "@core/types";
import { LoginModel, LoginState } from "./LoginModel";
import { createMockEntitlementSnapshot } from "../entitlements/domain/model";
import { clearEntitlementSnapshot, setEntitlementSnapshot } from "../entitlements/viewmodel/store";

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

// ─── Controller ──────────────────────────────────────────────────

export class LoginController implements Controller<LoginViewData, LoginAction> {
  private model: LoginModel;
  private bypassValidation: boolean;
  private email = "";
  private password = "";
  private emailError = "";
  private passwordError = "";
  private generalError = "";
  private loading = false;
  private isAuthenticated = false;

  constructor(model: LoginModel, options?: { bypassValidation?: boolean }) {
    this.model = model;
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

        const result = await this.model.signInWithEmailAndPassword(
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
        await this.model.signOut();
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
