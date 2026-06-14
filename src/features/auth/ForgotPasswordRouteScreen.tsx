import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter, type Href } from "expo-router";
import { Block, Button } from "../../ui/primitives"
import { CenteredPageLayout } from "../../ui/layouts";
import { AuthCard } from "./ui/blocks/AuthCard";
import { AuthBrandBlock } from "./ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "./ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "./ui/blocks/AuthSubmitBlock";
import { app } from "../../config/app";
import { BackendAuthRepository } from "./data/backend-auth.repository";
import { sendPasswordResetLink } from "./usecases/send-password-reset-link";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type Props = {
  loginHref: Href;
};

export function ForgotPasswordRouteScreen({ loginHref }: Props) {
  const router = useRouter();
  const repository = new BackendAuthRepository();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) { setError("Email is required."); return; }
    if (!isValidEmail(normalizedEmail)) { setError("Enter a valid email address."); return; }

    setLoading(true);
    setError("");
    const result = await sendPasswordResetLink(repository, normalizedEmail);
    setLoading(false);
    if (!result.ok) { setError(result.error); return; }

    Alert.alert(
      app.copy.auth.forgotPasswordSuccessTitle,
      app.copy.auth.forgotPasswordSuccessMessage,
      [{ text: "OK", onPress: () => router.replace(loginHref) }],
    );
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
              loading={loading}
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
