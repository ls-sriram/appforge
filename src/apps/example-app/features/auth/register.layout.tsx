import React from "react";
import { Body, Button, Heading, Icon, View, XStack, YStack } from "../../../../ui";
import { ui } from "../../../../ui/viz";

export interface RegisterLayoutProps {
  appName: string;
  subtitle: string;
  fullNamePlaceholder: string;
  emailPlaceholder: string;
  passwordPlaceholder: string;
  submitLabel: string;
  legalText: string;
  loginPrompt: string;
  fullName: string;
  email: string;
  password: string;
  loading: boolean;
  generalError: string;
  onFullNameChange: (v: string) => void;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: () => void;
  onLogin: () => void;
}

export function RegisterLayout({
  appName = "Example App",
  subtitle = "Sign up to get started.",
  fullNamePlaceholder = "Full Name",
  emailPlaceholder = "Email",
  passwordPlaceholder = "Password",
  submitLabel = "Create an account →",
  legalText = "By creating an account you agree to our Terms of Service and Privacy Policy.",
  loginPrompt = "Already have an account? Log in",
  loading, generalError, onSubmit, onLogin,
}: RegisterLayoutProps) {
  return (
    ui("register-0",
    <YStack f={1} bg="$bg" ai="center" jc="center" p="$4">
      {ui("register-1",
      <YStack w="100%" maxWidth={400} gap="$4" bg="$surface" br="$4" p="$5"
              borderColor="$borderSubtle" borderWidth={1}>
        {ui("register-2",
        <YStack gap="$3" ai="center">
          {ui("register-3",
          <XStack ai="center" gap="$3">
            {ui("register-4", <Icon name="zap" size="md" />)}
            {ui("register-5", <Heading weight="bold">{appName}</Heading>)}
          </XStack>
          )}
          {ui("register-6", <Body tone="muted" ta="center">{subtitle}</Body>)}
        </YStack>
        )}
        {ui("register-7",
        <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
          {ui("register-8",
          <XStack ai="center" gap="$3">
            {ui("register-9", <Icon name="user" size="lg" />)}
            {ui("register-10", <Body tone="muted" f={1}>{fullNamePlaceholder}</Body>)}
          </XStack>
          )}
        </View>
        )}
        {ui("register-11",
        <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
          {ui("register-12",
          <XStack ai="center" gap="$3">
            {ui("register-13", <Icon name="mail" size="lg" />)}
            {ui("register-14", <Body tone="muted" f={1}>{emailPlaceholder}</Body>)}
          </XStack>
          )}
        </View>
        )}
        {ui("register-15",
        <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
          {ui("register-16",
          <XStack ai="center" gap="$3">
            {ui("register-17", <Icon name="key" size="lg" />)}
            {ui("register-18", <Body tone="muted" f={1}>{passwordPlaceholder}</Body>)}
            {ui("register-19", <Icon name="eye" size="lg" />)}
          </XStack>
          )}
        </View>
        )}
        {generalError ? (
          <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
            <Body tone="danger" size="sm">{generalError}</Body>
          </View>
        ) : null}
        {ui("register-21", <Button label={submitLabel} loading={loading} onPress={onSubmit} />)}
        {ui("register-22", <Body size="xs" tone="muted" ta="center">{legalText}</Body>)}
        {ui("register-23", <Body size="sm" tone="muted" onPress={onLogin}>{loginPrompt}</Body>)}
      </YStack>
      )}
    </YStack>
    )
  );
}
