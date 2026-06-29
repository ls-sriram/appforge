import React from "react";
import { Body, Heading, Icon, Label, noopUi, type UiStamp, XStack, YStack, useThemeTokens } from "../../../../platform/ui/index";
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
  const theme = useThemeTokens();
  return (
    <YStack {...ui("card", "Auth form card")} bg="$surface" borderWidth={1} borderColor="$borderSubtle" br="$4" p="$5">
      <YStack {...ui("content", "Auth form content")} gap="$4">
        <YStack {...ui("brand", "Auth form brand")} gap="$3" ai="center">
          <XStack {...ui("brand-row", "Auth form brand row")} ai="center" gap="$3">
            <Icon {...ui("brand-icon", "Auth form brand icon")} color={theme.palette.textPrimary} name="zap" size={16} />
            <Heading {...ui("brand-title", "Auth form brand title")} fontFamily="$bold">{app.name}</Heading>
          </XStack>
          <Body {...ui("subtitle", "Auth form subtitle")} color="$textMuted" textAlign="center">{subtitle}</Body>
        </YStack>

        {children}

        {showTerms ? (
          <Label {...ui("terms", "Auth form terms")} color="$textMuted" textAlign="center">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </Label>
        ) : null}

        {footer ? (
          <XStack {...ui("footer", "Auth form footer")} ai="center" gap="$2" jc="center">
            <Body {...ui("footer-prompt", "Auth form footer prompt")} fontSize="$2" color="$textMuted">{footer.prompt}</Body>
            <YStack {...ui("footer-link-wrap", "Auth form footer link wrapper")} onPress={footer.onPress} pressStyle={{ opacity: 0.7 }}>
              <Label {...ui("footer-link", "Auth form footer link")} color="$primary" fontFamily="$bold">{footer.linkLabel}</Label>
            </YStack>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  );
}
