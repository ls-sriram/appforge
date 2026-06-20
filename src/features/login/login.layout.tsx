import React from "react";
import { YStack } from "../../platform/ui/index";
import { AuthCard } from "../auth/ui/blocks/AuthCard";
import { AuthBrandBlock } from "../auth/ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "../auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../auth/ui/blocks/AuthSubmitBlock";
import { AuthFooterLinks } from "../auth/ui/blocks/AuthFooterLinks";
import { ui } from "../../platform/ui/viz";
import { app } from "../../config/app";

export function LoginLayout() {
  return (
    ui("login-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <AuthCard>
        <YStack gap="$4">
          <AuthBrandBlock subtitle={app.copy.auth.loginSubtitle} />
          <AuthFieldBlock
            icon="mail"
            placeholder={app.copy.auth.loginEmailPlaceholder}
            value=""
            onChangeText={() => {}}
          />
          <AuthFieldBlock
            icon="key"
            placeholder={app.copy.auth.loginPasswordPlaceholder}
            value=""
            onChangeText={() => {}}
            secureTextEntry
          />
          <AuthSubmitBlock
            label={app.copy.auth.loginSubmitLabel}
            loading={false}
            onPress={() => {}}
          />
          <AuthFooterLinks
            prompt="Don't have an account yet?"
            linkLabel="Sign Up"
            onPress={() => {}}
          />
        </YStack>
      </AuthCard>
    </YStack>)
  );
}
