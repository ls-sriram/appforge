import React from "react";
import { Body, Button, Heading, Icon, View, XStack, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";

export interface LoginLayoutProps {
  appName: string;
  subtitle: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  forgotPasswordLabel: string;
  submitLabel: string;
  legalText: string;
  registerPrompt: string;
  email: string;
  password: string;
  loading: boolean;
  generalError: string;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

export function LoginLayout({
  appName = "Example App",
  subtitle = "Enter info to jump back into the app.",
  emailPlaceholder = "Email",
  passwordPlaceholder = "Password",
  forgotPasswordLabel = "Forgot Password?",
  submitLabel = "Login →",
  legalText = "By signing in you agree to our Terms of Service and Privacy Policy.",
  registerPrompt = "Don't have an account yet? Sign Up",
  loading, generalError, onSubmit, onForgotPassword, onRegister,
}: LoginLayoutProps) {
  return (
    // IDs match the generated UiDocument nodes in ui-documents.example-app.ts
    // so canvas click (data-uiid) and layer panel (doc.nodes[id]) stay in sync.
    ui("login-0",
    <YStack f={1} bg="$bg" ai="center" jc="center" p="$4">
      {ui("login-1",
      <YStack w="100%" maxWidth={400} gap="$4" bg="$surface" br="$4" p="$5"
              borderColor="$borderSubtle" borderWidth={1}>
        {ui("login-2",
        <YStack gap="$3" ai="center">
          {ui("login-3",
          <XStack ai="center" gap="$3">
            {ui("login-4", <Icon name="zap" size="md" />)}
            {ui("login-5", <Heading weight="bold">{appName}</Heading>)}
          </XStack>
          )}
          {ui("login-6", <Body tone="muted" ta="center">{subtitle}</Body>)}
        </YStack>
        )}
        {ui("login-7",
        <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
          {ui("login-8",
          <XStack ai="center" gap="$3">
            {ui("login-9", <Icon name="mail" size="lg" />)}
            {ui("login-10", <Body tone="muted" f={1}>{emailPlaceholder}</Body>)}
          </XStack>
          )}
        </View>
        )}
        {ui("login-11",
        <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
          {ui("login-12",
          <XStack ai="center" gap="$3">
            {ui("login-13", <Icon name="key" size="lg" />)}
            {ui("login-14", <Body tone="muted" f={1}>{passwordPlaceholder}</Body>)}
            {ui("login-15", <Icon name="eye" size="lg" />)}
          </XStack>
          )}
        </View>
        )}
        {ui("login-16",
          <Body tone="accent" size="sm" onPress={onForgotPassword}>{forgotPasswordLabel}</Body>
        )}
        {generalError ? (
          <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
            <Body tone="danger" size="sm">{generalError}</Body>
          </View>
        ) : null}
        {ui("login-18",
          <Button label={submitLabel} loading={loading} onPress={onSubmit} />
        )}
        {ui("login-19", <Body size="xs" tone="muted" ta="center">{legalText}</Body>)}
        {ui("login-20", <Body size="sm" tone="muted" onPress={onRegister}>{registerPrompt}</Body>)}
      </YStack>
      )}
    </YStack>
    )
  );
}
