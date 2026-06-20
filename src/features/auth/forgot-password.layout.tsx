import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";

export function ForgotPasswordLayout() {
  return (
    <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        <YStack gap="$4">
          <Heading ta="center">Reset Password</Heading>
          <Body color="$textMuted">Enter your email to receive reset instructions.</Body>
          <Input placeholder="Email" />
          <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Send reset email</Body>
          </Button>
          <Body ta="center" fontSize="$1" color="$textMuted">Back to login</Body>
        </YStack>
      </View>
    </YStack>
  );
}
