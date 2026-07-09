import type { ThemeDefinition } from "../../platform/ui/theme/index";
import { defaultAuthFieldStyle, type AuthFieldStyle } from "./auth-field.styles";
import { defaultAuthFormStyle, type AuthFormStyle } from "./auth-form.styles";
import { defaultAuthSubmitStyle, type AuthSubmitStyle } from "./auth-submit.styles";
import { defaultAuthWelcomeStyle, type AuthWelcomeStyle } from "./auth-welcome.styles";

export interface AuthUiStyles {
  field: AuthFieldStyle;
  form: AuthFormStyle;
  submit: AuthSubmitStyle;
  welcome: AuthWelcomeStyle;
}

export function createAuthStyles(theme: ThemeDefinition): AuthUiStyles {
  return {
    field: defaultAuthFieldStyle(theme),
    form: defaultAuthFormStyle(theme),
    submit: defaultAuthSubmitStyle(theme),
    welcome: defaultAuthWelcomeStyle(theme),
  };
}
