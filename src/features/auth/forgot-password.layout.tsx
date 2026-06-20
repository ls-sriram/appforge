import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";
import { ui } from "../../platform/ui/viz";

export function ForgotPasswordLayout() {
  return (
    ui("forgotpassword-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      {ui("forgotpassword-1", <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        {ui("forgotpassword-2", <YStack gap="$4">
          {ui("forgotpassword-3", <Heading ta="center">Reset Password</Heading>)}
          {ui("forgotpassword-4", <Body color="$textMuted">Enter your email to receive reset instructions.</Body>)}
          {ui("forgotpassword-5", <Input placeholder="Email" />)}
          {ui("forgotpassword-6", <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Send reset email</Body>
          </Button>)}
          {ui("forgotpassword-7", <Body ta="center" fontSize="$1" color="$textMuted">Back to login</Body>)}
        </YStack>)}
      </View>)}
    </YStack>)
  );
}
