import React from "react";
import { ViewProps } from "../../../platform/core/types";
import { YStack } from "../../../platform/ui/index";
import { CenteredPageLayout } from "../../../platform/ui/layouts/index";
import { AuthCard } from "../../auth/ui/blocks/AuthCard";
import { AuthBrandBlock } from "../../auth/ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "../../auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../../auth/ui/blocks/AuthSubmitBlock";
import { AuthFooterLinks } from "../../auth/ui/blocks/AuthFooterLinks";
import { AuthTermsBlock } from "../../auth/ui/blocks/AuthTermsBlock";
import { RegisterAction, RegisterViewData } from "../RegisterController";
import { app } from "../../../config/app";

type Props = ViewProps<RegisterViewData, RegisterAction>;
type RegisterSurfaceProps = Props & {
  submitDisabled?: boolean;
};

export function RegisterSurface({ data, dispatch, submitDisabled }: RegisterSurfaceProps) {
  const canSubmit =
    data.fullName.trim().length >= 2 &&
    data.email.trim().length > 0 &&
    data.password.length >= 6;

  return (
    <CenteredPageLayout>
      <AuthCard>
        <YStack gap="$4">
          <AuthBrandBlock subtitle={app.copy.auth.registerSubtitle} />
          <AuthFieldBlock
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
            label="Create an account →"
            loading={data.loading}
            disabled={data.loading || !canSubmit || submitDisabled === true}
            generalError={data.generalError}
            onPress={() => dispatch({ type: "submit" })}
            testID="register-submit-button"
          />
          <AuthTermsBlock />
          <AuthFooterLinks
            prompt="Already have an account?"
            linkLabel="Log in"
            onPress={() => dispatch({ type: "go_to_login" })}
          />
        </YStack>
      </AuthCard>
    </CenteredPageLayout>
  );
}
