/**
 * ─────────────────────────────────────────────────────────────────
 * REGISTER CONTROLLER — Mediates between View and Model.
 *
 * Responsibilities:
 *   - Receives actions from the view
 *   - Calls model methods
 *   - Formats data for the view
 *   - Manages loading state, errors
 *
 * NO direct Firebase calls (delegates to model).
 * NO UI rendering (delegates to view).
 * ─────────────────────────────────────────────────────────────────
 */

import { Controller } from "../../platform/core/types";
import { RegisterModel } from "./RegisterModel";

// ─── View Data ───────────────────────────────────────────────────

export interface RegisterViewData {
  fullName: string;
  fullNameError: string;
  email: string;
  password: string;
  emailError: string;
  passwordError: string;
  generalError: string;
  loading: boolean;
  registered: boolean;
}

// ─── View Actions ────────────────────────────────────────────────

export type RegisterAction =
  | { type: "full_name_changed"; value: string }
  | { type: "email_changed"; value: string }
  | { type: "password_changed"; value: string }
  | { type: "submit" }
  | { type: "go_to_login" };

// ─── Controller ──────────────────────────────────────────────────

export class RegisterController implements Controller<RegisterViewData, RegisterAction> {
  private model: RegisterModel;
  private fullName = "";
  private fullNameError = "";
  private email = "";
  private password = "";
  private emailError = "";
  private passwordError = "";
  private generalError = "";
  private loading = false;
  private registered = false;

  constructor(model: RegisterModel) {
    this.model = model;
  }

  getInitialData(): RegisterViewData {
    return this.snapshot();
  }

  async dispatch(action: RegisterAction): Promise<RegisterViewData> {
    if (action.type === "submit") {
      console.log("[register][controller] submit tapped", {
        emailLength: this.email.length,
        passwordLength: this.password.length,
      });
    }

    switch (action.type) {
      case "full_name_changed":
        this.fullName = action.value;
        this.fullNameError = this.validateFullName(action.value);
        break;
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
        this.fullNameError = this.validateFullName(this.fullName);
        this.emailError = this.validateEmail(this.email);
        this.passwordError = this.validatePassword(this.password);

        console.log("[register][controller] validation result", {
          emailError: this.emailError || undefined,
          fullNameError: this.fullNameError || undefined,
          passwordError: this.passwordError || undefined,
        });

        if (this.fullNameError || this.emailError || this.passwordError) {
          console.log("[register][controller] blocked by validation");
          this.loading = false;
          break;
        }
        console.log("[register][controller] calling model.registerWithEmailAndPassword");
        const result = await this.model.registerWithEmailAndPassword(
          this.email,
          this.password,
          this.fullName.trim(),
        );

        console.log("[register][controller] model result", {
          ok: result.ok,
          error: result.ok ? null : result.error,
          userId: result.ok ? result.data.userId : null,
        });

        if (result.ok) {
          this.registered = true;
          this.generalError = "";
        } else {
          this.generalError = result.error;
        }
        this.loading = false;
        break;

      case "go_to_login":
        break;
    }

    return this.snapshot();
  }

  private snapshot(): RegisterViewData {
    return {
      fullName: this.fullName,
      fullNameError: this.fullNameError,
      email: this.email,
      password: this.password,
      emailError: this.emailError,
      passwordError: this.passwordError,
      generalError: this.generalError,
      loading: this.loading,
      registered: this.registered,
    };
  }

  private validateFullName(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return "Full name is required.";
    if (trimmed.length < 2) return "Enter your full name.";
    return "";
  }

  private validateEmail(value: string): string {
    if (!value) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    return "";
  }

  private validatePassword(value: string): string {
    if (!value) return "Password is required.";
    if (value.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

}
