import { Alert } from "react-native";
import { Result } from "../../../../core/types";
import { AuthState } from "../../../../features/auth/domain/repository";
import { LoginModel } from "../../../../features/login";
import { RegisterModel } from "../../../../features/register";

export const EXAMPLE_APP_AUTH_DISABLED_TITLE = "Login disabled";
export const EXAMPLE_APP_AUTH_DISABLED_MESSAGE =
  "Firebase login is disabled for example-app right now. Update the frontend and backend config to enable it.";

function disabledResult<T>(): Result<T> {
  return { ok: false, error: EXAMPLE_APP_AUTH_DISABLED_MESSAGE };
}

export function notifyExampleAppAuthDisabled(action: "login" | "register" | "reset_password") {
  console.warn(`[example-app][auth] ${action} blocked: ${EXAMPLE_APP_AUTH_DISABLED_MESSAGE}`);
  Alert.alert(EXAMPLE_APP_AUTH_DISABLED_TITLE, EXAMPLE_APP_AUTH_DISABLED_MESSAGE);
}

export class ExampleAppDisabledLoginModel implements LoginModel {
  async signInWithEmailAndPassword(): Promise<Result<{ userId: string }>> {
    return disabledResult();
  }

  async signOut(): Promise<Result<void>> {
    return { ok: true, data: undefined };
  }

  async checkAuthState(): Promise<Result<AuthState>> {
    return { ok: true, data: { isAuthenticated: false, onboardingComplete: false } };
  }
}

export class ExampleAppDisabledRegisterModel implements RegisterModel {
  async registerWithEmailAndPassword(): Promise<Result<{ userId: string }>> {
    return disabledResult();
  }
}
