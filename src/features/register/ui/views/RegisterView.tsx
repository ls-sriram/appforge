import React from "react";
import { ViewProps } from "../../../../platform/core/types";
import { CenteredPageScaffold, noopUi, type UiStamp, useThemeTokens, YStack } from "../../../../platform/ui/index";
import { AuthFieldBlock } from "../../../auth/ui/blocks/AuthFieldBlock";
import { AuthFormBlock } from "../../../auth/ui/blocks/AuthFormBlock";
import { AuthSubmitBlock } from "../../../auth/ui/blocks/AuthSubmitBlock";
import { createAuthStyles } from "../../../auth/ui/contracts/authStyles";
import { RegisterAction, RegisterViewData } from "../../RegisterController";
import { app } from "../../../../config/app";

type Props = ViewProps<RegisterViewData, RegisterAction>;
type RegisterViewProps = Props & {
  submitDisabled?: boolean;
  ui?: UiStamp;
};

export function RegisterView({ ui = noopUi, data, dispatch, submitDisabled }: RegisterViewProps) {
  const theme = useThemeTokens();
  const styles = createAuthStyles(theme);
  const canSubmit =
    data.fullName.trim().length >= 2 &&
    data.email.trim().length > 0 &&
    data.password.length >= 6;

  return (
    <CenteredPageScaffold
      content={(
        <AuthFormBlock
          ui={ui.scope("form")}
          style={styles.form}
          subtitle={app.copy.auth.registerSubtitle}
          showTerms
          footer={{
            prompt: "Already have an account?",
            linkLabel: "Log in",
            onPress: () => dispatch({ type: "go_to_login" }),
          }}
        >
          <YStack {...ui("fields", "Register fields")} gap="$4">
            <AuthFieldBlock
              ui={ui.scope("name-field")}
              style={styles.field}
              icon="user"
              placeholder="Full Name"
              value={data.fullName}
              onChangeText={(value) => dispatch({ type: "full_name_changed", value })}
              autoCapitalize="words"
              autoComplete="name"
              error={data.fullNameError}
              testID="register-name-input"
            />
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
              error={data.emailError}
              testID="register-email-input"
            />
            <AuthFieldBlock
              ui={ui.scope("password-field")}
              style={styles.field}
              icon="key"
              placeholder="Password"
              value={data.password}
              onChangeText={(value) => dispatch({ type: "password_changed", value })}
              secureTextEntry
              autoComplete="new-password"
              error={data.passwordError}
              testID="register-password-input"
            />
            <AuthSubmitBlock
              ui={ui.scope("submit")}
              style={styles.submit}
              label="Create an account →"
              loading={data.loading}
              disabled={data.loading || !canSubmit || submitDisabled === true}
              generalError={data.generalError}
              onPress={() => dispatch({ type: "submit" })}
              testID="register-submit-button"
            />
          </YStack>
        </AuthFormBlock>
      )}
      ui={ui.scope("page")}
    />
  );
}
