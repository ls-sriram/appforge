import React from "react";
import { Body, Button, Heading, Icon, View, XStack, YStack } from "@ui";
import { ui } from "@ui/viz";

export interface ForgotPasswordLayoutProps {
  appName: string;
  subtitle: string;
  emailPlaceholder: string;
  submitLabel: string;
  backLabel: string;
  email: string;
  error: string;
  onEmailChange: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function ForgotPasswordLayout({
  appName = "Example App",
  subtitle = "We will send you a reset link.",
  emailPlaceholder = "Email",
  submitLabel = "Send reset link",
  backLabel = "Back to sign in",
  error, onSubmit, onBack,
}: ForgotPasswordLayoutProps) {
  return (
    ui("forgotpassword-0",
    <YStack f={1} bg="$bg" ai="center" jc="center" p="$4">
      {ui("forgotpassword-1",
      <YStack w="100%" maxWidth={400} gap="$4">
        {ui("forgotpassword-2",
        <YStack gap="$4" bg="$surface" br="$4" p="$5" borderColor="$borderSubtle" borderWidth={1}>
          {ui("forgotpassword-3",
          <YStack gap="$3" ai="center">
            {ui("forgotpassword-4",
            <XStack ai="center" gap="$3">
              {ui("forgotpassword-5", <Icon name="zap" size="md" />)}
              {ui("forgotpassword-6", <Heading weight="bold">{appName}</Heading>)}
            </XStack>
            )}
            {ui("forgotpassword-7", <Body tone="muted" ta="center">{subtitle}</Body>)}
          </YStack>
          )}
          {ui("forgotpassword-8",
          <View bg="$surfaceStrong" br="$3" borderColor="$border" borderWidth={1} px="$5" py="$3">
            {ui("forgotpassword-9",
            <XStack ai="center" gap="$3">
              {ui("forgotpassword-10", <Icon name="mail" size="lg" />)}
              {ui("forgotpassword-11", <Body tone="muted" f={1}>{emailPlaceholder}</Body>)}
            </XStack>
            )}
          </View>
          )}
          {error ? (
            <View bg="$errorMuted" borderColor="$error" borderWidth={1} br="$2" p="$3">
              <Body tone="danger" size="sm">{error}</Body>
            </View>
          ) : null}
          {ui("forgotpassword-13", <Button label={submitLabel} onPress={onSubmit} />)}
        </YStack>
        )}
        {ui("forgotpassword-14", <Button variant="secondary" label={backLabel} onPress={onBack} />)}
      </YStack>
      )}
    </YStack>
    )
  );
}
