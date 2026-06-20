import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";

export function RegisterLayout() {
  return (
    <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        <YStack gap="$4">
          <Heading ta="center">Create Account</Heading>
          <Input placeholder="Full Name" />
          <Input placeholder="Email" />
          <Input placeholder="Password" />
          <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Create an account →</Body>
          </Button>
          <Body ta="center" fontSize="$1" color="$textMuted">Already have an account? Log in</Body>
        </YStack>
      </View>
    </YStack>
  );
}
