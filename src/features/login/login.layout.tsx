import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";

export function LoginLayout() {
  return (
    <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        <YStack gap="$4">
          <Heading ta="center">Sign In</Heading>
          <Input placeholder="Email" />
          <Input placeholder="Password" />
          <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Login →</Body>
          </Button>
          <Body ta="center" fontSize="$1" color="$textMuted">Don't have an account? Sign Up</Body>
        </YStack>
      </View>
    </YStack>
  );
}
