import React, { useState } from "react";
import { useRouter, type Href } from "expo-router";
import { Block, Button } from "../../../../ui/primitives";
import { CenteredPageLayout } from "../../../../ui/layouts";
import { AuthCard } from "../../../../features/auth/ui/blocks/AuthCard";
import { AuthBrandBlock } from "../../../../features/auth/ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "../../../../features/auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../../../../features/auth/ui/blocks/AuthSubmitBlock";
import { app } from "../../../../config/app";
import {
  EXAMPLE_APP_AUTH_DISABLED_MESSAGE,
  notifyExampleAppAuthDisabled,
} from "./example-app-disabled-auth";

type Props = {
  loginHref: Href;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function ExampleAppForgotPasswordRouteScreen({ loginHref }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Email is required.");
      return;
    }
    if (!isValidEmail(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setError(EXAMPLE_APP_AUTH_DISABLED_MESSAGE);
    notifyExampleAppAuthDisabled("reset_password");
  };

  return (
    <CenteredPageLayout>
      <Block space="sm">
        <AuthCard>
          <Block space="md">
            <AuthBrandBlock subtitle={app.copy.auth.forgotPasswordSubtitle} />
            <AuthFieldBlock
              icon="mail"
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />
            <AuthSubmitBlock
              label="Send reset link"
              loading={false}
              generalError={error}
              onPress={handleSubmit}
            />
          </Block>
        </AuthCard>
        <Button label="Back to sign in" variant="secondary" onPress={() => router.replace(loginHref)} fullWidth />
      </Block>
    </CenteredPageLayout>
  );
}
