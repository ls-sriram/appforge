import React from "react";
import { Body, Heading, Icon, Label, noopUi, type UiStamp, View, XStack, YStack } from "../../../../platform/ui/index";
import { app } from "../../../../config/app";

type AuthFormFooter = {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
};

export interface AuthFormBlockProps {
  ui?: UiStamp;
  subtitle: string;
  children: React.ReactNode;
  showTerms?: boolean;
  footer?: AuthFormFooter;
}

export function AuthFormBlock({
  ui = noopUi,
  subtitle,
  children,
  showTerms = false,
  footer,
}: AuthFormBlockProps) {
  return (
    <View {...ui("card")} bg="$surface" borderWidth={1} borderColor="$borderSubtle" br="$4" p="$5">
      <YStack {...ui("content")} gap="$4">
        <YStack {...ui("brand")} gap="$3" ai="center">
          <XStack {...ui("brand-row")} ai="center" gap="$3">
            <Icon {...ui("brand-icon")} name="zap" size="md" />
            <Heading {...ui("brand-title")} fontFamily="$bold">{app.name}</Heading>
          </XStack>
          <Body {...ui("subtitle")} color="$textMuted" textAlign="center">{subtitle}</Body>
        </YStack>

        {children}

        {showTerms ? (
          <Label {...ui("terms")} color="$textMuted" textAlign="center">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </Label>
        ) : null}

        {footer ? (
          <XStack {...ui("footer")} ai="center" gap="$2" jc="center">
            <Body {...ui("footer-prompt")} fontSize="$2" color="$textMuted">{footer.prompt}</Body>
            <YStack {...ui("footer-link-wrap")} onPress={footer.onPress} pressStyle={{ opacity: 0.7 }}>
              <Label {...ui("footer-link")} color="$primary" fontFamily="$bold">{footer.linkLabel}</Label>
            </YStack>
          </XStack>
        ) : null}
      </YStack>
    </View>
  );
}
