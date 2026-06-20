import React from "react";
import { Body, Button, Heading, Input, View, YStack } from "../../platform/ui/index";
import { ui } from "../../platform/ui/viz";

export function RegisterLayout() {
  return (
    ui("register-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      {ui("register-1", <View bg="$surface" borderColor="$borderSubtle" borderWidth={1} br="$3" p="$5" w={340}>
        {ui("register-2", <YStack gap="$4">
          {ui("register-3", <Heading ta="center">Create Account</Heading>)}
          {ui("register-4", <Input placeholder="Full Name" />)}
          {ui("register-5", <Input placeholder="Email" />)}
          {ui("register-6", <Input placeholder="Password" />)}
          {ui("register-7", <Button bg="$primary">
            <Body color="$textInverse" fontFamily="$bold">Create an account →</Body>
          </Button>)}
          {ui("register-8", <Body ta="center" fontSize="$1" color="$textMuted">Already have an account? Log in</Body>)}
        </YStack>)}
      </View>)}
    </YStack>)
  );
}
