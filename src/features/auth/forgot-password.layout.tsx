import React from "react";
import { YStack } from "../../platform/ui/index";
import { AuthCard } from "./ui/blocks/AuthCard";
import { AuthBrandBlock } from "./ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "./ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "./ui/blocks/AuthSubmitBlock";
import { AuthBackBlock } from "./ui/blocks/AuthBackBlock";
import { ui } from "../../platform/ui/viz";
import { app } from "../../config/app";

export function ForgotPasswordLayout() {
  return (
    ui("forgotpassword-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <YStack gap="$3">
        <AuthCard>
          <YStack gap="$4">
            <AuthBrandBlock subtitle={app.copy.auth.forgotPasswordSubtitle} />
            <AuthFieldBlock
              icon="mail"
              placeholder="Email"
              value=""
              onChangeText={() => {}}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <AuthSubmitBlock
              label={app.copy.auth.forgotPasswordSubmitLabel}
              loading={false}
              onPress={() => {}}
            />
          </YStack>
        </AuthCard>
        <AuthBackBlock label={app.copy.auth.forgotPasswordBackLabel} onPress={() => {}} />
      </YStack>
    </YStack>)
  );
}
