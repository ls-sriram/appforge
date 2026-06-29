import React from "react";
import type { TextInput } from "react-native";
import { ViewProps } from "../../../../platform/core/types";
import { Button, CenteredPageScaffold, noopUi, type UiStamp, useThemeTokens, YStack } from "../../../../platform/ui/index";
import { AuthFieldBlock } from "../../../auth/ui/blocks/AuthFieldBlock";
import { AuthFormBlock } from "../../../auth/ui/blocks/AuthFormBlock";
import { AuthSubmitBlock } from "../../../auth/ui/blocks/AuthSubmitBlock";
import { createAuthStyles } from "../../../auth/ui/contracts/authStyles";
import { LoginAction, LoginViewData } from "../../LoginController";
import { app } from "../../../../config/app";

type Props = ViewProps<LoginViewData, LoginAction>;

type LoginViewProps = Props & {
  ui?: UiStamp;
};

export function LoginView({ ui = noopUi, data, dispatch }: LoginViewProps) {
  const theme = useThemeTokens();
  const styles = createAuthStyles(theme);
  const passwordRef = React.useRef<TextInput | undefined>(undefined);

  return (
    <CenteredPageScaffold
      content={(
        <AuthFormBlock
          ui={ui.scope("form")}
          style={styles.form}
          subtitle={app.copy.auth.loginSubtitle}
          showTerms
          footer={{
            prompt: "Don't have an account yet?",
            linkLabel: "Sign Up",
            onPress: () => dispatch({ type: "go_to_register" }),
          }}
        >
          <YStack {...ui("fields", "Login fields")} gap="$4">
            <AuthFieldBlock
              ui={ui.scope("email-field")}
              style={styles.field}
              icon="mail"
              placeholder="Email"
              value={data.email}
              onChangeText={(value) => dispatch({ type: "email_changed", value })}
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
              testID="email-input"
            />
            <AuthFieldBlock
              ui={ui.scope("password-field")}
              style={styles.field}
              inputRef={passwordRef}
              icon="key"
              placeholder="Password"
              value={data.password}
              onChangeText={(value) => dispatch({ type: "password_changed", value })}
              secureTextEntry
              autoComplete="current-password"
              returnKeyType="done"
              onSubmitEditing={() => dispatch({ type: "submit" })}
              testID="password-input"
            />
            <Button
              {...ui("forgot-link", "Forgot password link")}
              variant="ghost"
              onPress={() => dispatch({ type: "go_to_forgot_password" })}
            >
              Forgot Password?
            </Button>
            <AuthSubmitBlock
              ui={ui.scope("submit")}
              style={styles.submit}
              label="Login →"
              loading={data.loading}
              generalError={data.generalError}
              onPress={() => dispatch({ type: "submit" })}
              testID="submit-button"
            />
          </YStack>
        </AuthFormBlock>
      )}
      ui={ui.scope("page")}
    />
  );
}
