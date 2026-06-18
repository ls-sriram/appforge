import React, { useState } from "react";
import { useRouter, type Href } from "expo-router";
import { SafeAreaView } from "../../../../ui";
import { app } from "../../../../config/app";
import { EXAMPLE_APP_AUTH_DISABLED_MESSAGE, notifyExampleAppAuthDisabled } from "./example-app-disabled-auth";
import { ForgotPasswordLayout } from "./forgot-password.layout";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

type Props = { loginHref: Href };

export function ExampleAppForgotPasswordRouteScreen({ loginHref }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail) { setError("Email is required."); return; }
    if (!isValidEmail(normalizedEmail)) { setError("Enter a valid email address."); return; }
    setError(EXAMPLE_APP_AUTH_DISABLED_MESSAGE);
    notifyExampleAppAuthDisabled("reset_password");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ForgotPasswordLayout
        appName={app.name}
        subtitle={app.copy.auth.forgotPasswordSubtitle}
        emailPlaceholder={app.copy.auth.forgotPasswordEmailPlaceholder}
        submitLabel={app.copy.auth.forgotPasswordSubmitLabel}
        backLabel={app.copy.auth.forgotPasswordBackLabel}
        email={email}
        error={error}
        onEmailChange={setEmail}
        onSubmit={handleSubmit}
        onBack={() => router.replace(loginHref)}
      />
    </SafeAreaView>
  );
}
