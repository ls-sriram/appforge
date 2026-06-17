import React, { useState } from "react";
import { useRouter, type Href } from "expo-router";
import { Body, Button, YStack } from "../../../../ui";
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
      <YStack gap="$3">
        <AuthCard>
          <YStack gap="$4">
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
          </YStack>
        </AuthCard>
        <Button onPress={() => router.replace(loginHref)} bg="$surfaceAlt" borderWidth={1} borderColor="$border">
          <Body>Back to sign in</Body>
        </Button>
      </YStack>
    </CenteredPageLayout>
  );
}
