import React from "react";
import { TextInput, TouchableOpacity } from "react-native";
import { ViewProps } from "../../../platform/core/types";
import { Body, YStack } from "../../../platform/ui/index";
import { CenteredPageLayout } from "../../../platform/ui/layouts/index";
import { AuthCard } from "../../auth/ui/blocks/AuthCard";
import { AuthBrandBlock } from "../../auth/ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "../../auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../../auth/ui/blocks/AuthSubmitBlock";
import { AuthFooterLinks } from "../../auth/ui/blocks/AuthFooterLinks";
import { AuthTermsBlock } from "../../auth/ui/blocks/AuthTermsBlock";
import { LoginAction, LoginViewData } from "../LoginController";
import { app } from "../../../config/app";

type Props = ViewProps<LoginViewData, LoginAction>;

export function LoginSurface({ data, dispatch }: Props) {
  const passwordRef = React.useRef<TextInput | undefined>(undefined);

  return (
    <CenteredPageLayout>
      <AuthCard>
        <YStack gap="$4">
          <AuthBrandBlock subtitle={app.copy.auth.loginSubtitle} />
          <AuthFieldBlock
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
          <TouchableOpacity onPress={() => dispatch({ type: "go_to_forgot_password" })} activeOpacity={0.7}>
            <Body color="$primary">Forgot Password?</Body>
          </TouchableOpacity>
          <AuthSubmitBlock
            label="Login →"
            loading={data.loading}
            generalError={data.generalError}
            onPress={() => dispatch({ type: "submit" })}
            testID="submit-button"
          />
          <AuthTermsBlock />
          <AuthFooterLinks
            prompt="Don't have an account yet?"
            linkLabel="Sign Up"
            onPress={() => dispatch({ type: "go_to_register" })}
          />
        </YStack>
      </AuthCard>
    </CenteredPageLayout>
  );
}
