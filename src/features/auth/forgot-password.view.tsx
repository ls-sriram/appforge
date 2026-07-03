import React from "react";
import { Button, CenteredPageScaffold, noopUi, type UiStamp, useUI, YStack } from "../../platform/ui/index";
import { ViewProps } from "../../platform/core/types";
import { AuthFieldBlock } from "./auth-field.block";
import { AuthFormBlock } from "./auth-form.block";
import { AuthSubmitBlock } from "./auth-submit.block";
import { createAuthStyles } from "./auth.styles";
import { ForgotPasswordAction, ForgotPasswordViewData } from "./forgot-password.viewmodel";
import { app } from "../../config/app";

type Props = ViewProps<ForgotPasswordViewData, ForgotPasswordAction>;

type ForgotPasswordViewProps = Props & {
  ui?: UiStamp;
};

export function ForgotPasswordView({ ui = noopUi, data, dispatch }: ForgotPasswordViewProps) {
  const { theme, contracts } = useUI();
  const styles = createAuthStyles(theme);
  return (
    <CenteredPageScaffold
      content={(
        <YStack {...ui("root", "Forgot password screen")} gap="$3">
          <AuthFormBlock
            ui={ui.scope("form")}
            style={styles.form}
            subtitle={app.copy.auth.forgotPasswordSubtitle}
          >
            <YStack {...ui("fields", "Forgot password fields")} gap="$4">
              <AuthFieldBlock
                ui={ui.scope("email-field")}
                style={styles.field}
                icon="mail"
                placeholder="Email"
                value={data.email}
                onChangeText={(value) => dispatch({ type: "email_changed", value })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                returnKeyType="done"
                onSubmitEditing={() => dispatch({ type: "submit" })}
                error={data.emailError}
              />
              <AuthSubmitBlock
                ui={ui.scope("submit")}
                style={styles.submit}
                label={app.copy.auth.forgotPasswordSubmitLabel}
                loading={data.loading}
                generalError={data.generalError}
                onPress={() => dispatch({ type: "submit" })}
              />
            </YStack>
          </AuthFormBlock>
          <Button
            {...ui("back", "Back to login button")}
            contract={contracts.button!["secondary"]}
            onPress={() => dispatch({ type: "go_to_login" })}
          >
            {app.copy.auth.forgotPasswordBackLabel}
          </Button>
        </YStack>
      )}
      ui={ui.scope("page")}
    />
  );
}
