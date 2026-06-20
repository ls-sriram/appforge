import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";
import { ui } from "../../platform/ui/viz";

export function LoginLayout() {
  return (
    ui("login-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      {ui("login-1", <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        {ui("login-2", <YStack gap="$4">
          {ui("login-3", <Heading ta="center">Sign In</Heading>)}
          {ui("login-4", <Input placeholder="Email" />)}
          {ui("login-5", <Input placeholder="Password" />)}
          {ui("login-6", <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Login →</Body>
          </Button>)}
          {ui("login-7", <Body ta="center" fontSize="$1" color="$textMuted">Don't have an account? Sign Up</Body>)}
        </YStack>)}
      </View>)}
    </YStack>)
  );
}
