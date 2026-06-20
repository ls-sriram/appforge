import React from "react";
import { YStack } from "../../platform/ui/index";
import { AuthCard } from "../auth/ui/blocks/AuthCard";
import { AuthBrandBlock } from "../auth/ui/blocks/AuthBrandBlock";
import { AuthFieldBlock } from "../auth/ui/blocks/AuthFieldBlock";
import { AuthSubmitBlock } from "../auth/ui/blocks/AuthSubmitBlock";
import { AuthTermsBlock } from "../auth/ui/blocks/AuthTermsBlock";
import { AuthFooterLinks } from "../auth/ui/blocks/AuthFooterLinks";
import { ui } from "../../platform/ui/viz";
import { app } from "../../config/app";

export function RegisterLayout() {
  return (
    ui("register-0", <YStack bg="$bg" f={1} jc="center" ai="center" p="$4">
      <AuthCard>
        <YStack gap="$4">
          <AuthBrandBlock subtitle={app.copy.auth.registerSubtitle} />
          <AuthFieldBlock
            icon="user"
            placeholder={app.copy.auth.registerFullNamePlaceholder}
            value=""
            onChangeText={() => {}}
            autoCapitalize="words"
          />
          <AuthFieldBlock
            icon="mail"
            placeholder={app.copy.auth.registerEmailPlaceholder}
            value=""
            onChangeText={() => {}}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <AuthFieldBlock
            icon="key"
            placeholder={app.copy.auth.registerPasswordPlaceholder}
            value=""
            onChangeText={() => {}}
            secureTextEntry
          />
          <AuthSubmitBlock
            label="Create an account →"
            loading={false}
            onPress={() => {}}
          />
          <AuthTermsBlock />
          <AuthFooterLinks
            prompt="Already have an account?"
            linkLabel="Log in"
            onPress={() => {}}
          />
        </YStack>
      </AuthCard>
    </YStack>)
  );
}
