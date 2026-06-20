import React from "react";
import { Body, Button, Heading, Icon, Input, View, XStack, YStack } from "../../platform/ui/index";
import { ui } from "../../platform/ui/viz";

export function LoginLayout() {
  return (
    ui("login-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      {ui("login-1", <View bg="$surface" borderWidth={1} borderColor="$borderSubtle" br="$4" p="$5" w={340}>
        {ui("login-2", <YStack gap="$4">
          {ui("login-3", <YStack gap="$3" ai="center">
            {ui("login-4", <XStack ai="center" gap="$3">
              {ui("login-5", <Icon name="zap" />)}
              {ui("login-6", <Heading fontFamily="$bold">My App</Heading>)}
            </XStack>)}
            {ui("login-7", <Body color="$textMuted" ta="center">Sign in to your account</Body>)}
          </YStack>)}
          {ui("login-8", <Input placeholder="Email" />)}
          {ui("login-9", <Input placeholder="Password" />)}
          {ui("login-10", <Body color="$primary">Forgot Password?</Body>)}
          {ui("login-11", <Button bg="$textPrimary">
            <Body color="$textInverse" fontFamily="$bold">Login →</Body>
          </Button>)}
          {ui("login-12", <Body ta="center" fontSize="$1" color="$textMuted">Don't have an account yet? Sign Up</Body>)}
        </YStack>)}
      </View>)}
    </YStack>)
  );
}
