import React from "react";
import { YStack } from "../../platform/ui/index";
import { CenteredPageLayout } from "../../platform/ui/layouts/index";
import { ViewProps } from "../../platform/core/types";
import { AuthCard } from "./ui/blocks/AuthCard";
import { AuthBrandBlock } from "./ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "./ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "./ui/blocks/AuthSubmitBlock";
import { AuthBackBlock } from "./ui/blocks/AuthBackBlock";
import { ForgotPasswordAction, ForgotPasswordViewData } from "./ForgotPasswordController";
import { app } from "../../config/app";

type Props = ViewProps<ForgotPasswordViewData, ForgotPasswordAction>;

export function ForgotPasswordSurface({ data, dispatch }: Props) {
  return (
    <CenteredPageLayout>
      <YStack gap="$3">
        <AuthCard>
          <YStack gap="$4">
            <AuthBrandBlock subtitle={app.copy.auth.forgotPasswordSubtitle} />
            <AuthFieldBlock
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
              label={app.copy.auth.forgotPasswordSubmitLabel}
              loading={data.loading}
              generalError={data.generalError}
              onPress={() => dispatch({ type: "submit" })}
            />
          </YStack>
        </AuthCard>
        <AuthBackBlock
          label={app.copy.auth.forgotPasswordBackLabel}
          onPress={() => dispatch({ type: "go_to_login" })}
        />
      </YStack>
    </CenteredPageLayout>
  );
}
