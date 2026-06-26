import React from "react";
import { Body, Button, CenteredPageScaffold, noopUi, type UiStamp, YStack } from "../../platform/ui/index";
import { ViewProps } from "../../platform/core/types";
import { AuthFieldBlock } from "./ui/blocks/AuthFieldBlock";
import { AuthFormBlock } from "./ui/blocks/AuthFormBlock";
import { AuthSubmitBlock } from "./ui/blocks/AuthSubmitBlock";
import { ForgotPasswordAction, ForgotPasswordViewData } from "./ForgotPasswordController";
import { app } from "../../config/app";

type Props = ViewProps<ForgotPasswordViewData, ForgotPasswordAction>;

type ForgotPasswordSurfaceProps = Props & {
  ui?: UiStamp;
};

export function ForgotPasswordSurface({ ui = noopUi, data, dispatch }: ForgotPasswordSurfaceProps) {
  return (
    <CenteredPageScaffold
      content={(
        <YStack {...ui("root")} gap="$3">
          <AuthFormBlock
            ui={ui.scope("form")}
            subtitle={app.copy.auth.forgotPasswordSubtitle}
          >
            <YStack {...ui("fields")} gap="$4">
              <AuthFieldBlock
                ui={ui.scope("email-field")}
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
                label={app.copy.auth.forgotPasswordSubmitLabel}
                loading={data.loading}
                generalError={data.generalError}
                onPress={() => dispatch({ type: "submit" })}
              />
            </YStack>
          </AuthFormBlock>
          <Button
            {...ui("back")}
            variant="secondary"
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
