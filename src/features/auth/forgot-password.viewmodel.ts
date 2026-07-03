import { Controller } from "../../platform/core/types";
import { AuthRepository } from "./auth.repository";
import { BackendAuthRepository } from "./backend-auth.datasource";
import { sendPasswordResetLink } from "./send-password-reset-link.usecase";

export interface ForgotPasswordViewData {
  email: string;
  emailError: string;
  generalError: string;
  loading: boolean;
  isSuccess: boolean;
}

export type ForgotPasswordAction =
  | { type: "email_changed"; value: string }
  | { type: "submit" }
  | { type: "go_to_login" };

export class ForgotPasswordController implements Controller<ForgotPasswordViewData, ForgotPasswordAction> {
  private repository: AuthRepository;
  private email = "";
  private emailError = "";
  private generalError = "";
  private loading = false;
  private isSuccess = false;

  constructor(repository?: AuthRepository) {
    this.repository = repository ?? new BackendAuthRepository();
  }

  getInitialData(): ForgotPasswordViewData {
    return this.snapshot();
  }

  async dispatch(action: ForgotPasswordAction): Promise<ForgotPasswordViewData> {
    switch (action.type) {
      case "email_changed":
        this.email = action.value;
        this.emailError = "";
        break;

      case "submit": {
        const email = this.email.trim();
        if (!email) {
          this.emailError = "Email is required.";
          break;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          this.emailError = "Enter a valid email address.";
          break;
        }
        this.loading = true;
        this.emailError = "";
        this.generalError = "";
        const result = await sendPasswordResetLink(this.repository, email);
        this.loading = false;
        if (result.ok) {
          this.isSuccess = true;
        } else {
          this.generalError = result.error;
        }
        break;
      }

      case "go_to_login":
        break;
    }

    return this.snapshot();
  }

  private snapshot(): ForgotPasswordViewData {
    return {
      email: this.email,
      emailError: this.emailError,
      generalError: this.generalError,
      loading: this.loading,
      isSuccess: this.isSuccess,
    };
  }
}
