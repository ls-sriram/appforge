import React from "react";
import { Body, Heading, Icon, Label, noopUi, XStack, YStack } from "../../platform/ui/index";
import { app } from "../../config/app";
import type { AuthFormBlockProps } from "./auth-form.contract";
export type { AuthFormBlockProps };
export { AuthFormBlockSchema } from "./auth-form.contract";

export function AuthFormBlock({
  ui = noopUi,
  subtitle,
  children,
  showTerms = false,
  footer,
  style,
}: AuthFormBlockProps) {
  return (
    <YStack
      {...ui("card", "Auth form card")}
      bg={style.card.backgroundColor}
      borderWidth={style.card.borderWidth}
      borderColor={style.card.borderColor}
      br={style.card.borderRadius}
      p={style.card.padding}
    >
      <YStack {...ui("content", "Auth form content")} gap={style.layout.contentGap}>
        <YStack {...ui("brand", "Auth form brand")} gap={style.layout.brandGap} ai="center">
          <XStack {...ui("brand-row", "Auth form brand row")} ai="center" gap={style.layout.brandRowGap}>
            <Icon {...ui("brand-icon", "Auth form brand icon")} color={style.brandIcon.color} name="zap" size={style.brandIcon.size} />
            <Heading {...ui("brand-title", "Auth form brand title")} fontWeight={style.brandTitle.fontWeight}>{app.name}</Heading>
          </XStack>
          <Body {...ui("subtitle", "Auth form subtitle")} color={style.subtitle.color} textAlign="center">{subtitle}</Body>
        </YStack>

        {children}

        {showTerms ? (
          <Label {...ui("terms", "Auth form terms")} color={style.terms.color} textAlign="center">
            By continuing, you agree to our Terms of Use and Privacy Policy.
          </Label>
        ) : null}

        {footer ? (
          <XStack {...ui("footer", "Auth form footer")} ai="center" gap={style.layout.footerGap} jc="center">
            <Body {...ui("footer-prompt", "Auth form footer prompt")} fontSize={style.footerPrompt.fontSize} color={style.footerPrompt.color}>{footer.prompt}</Body>
            <YStack {...ui("footer-link-wrap", "Auth form footer link wrapper")} onPress={footer.onPress} pressStyle={{ opacity: 0.7 }}>
              <Label {...ui("footer-link", "Auth form footer link")} color={style.footerLink.color} fontWeight={style.footerLink.fontWeight}>{footer.linkLabel}</Label>
            </YStack>
          </XStack>
        ) : null}
      </YStack>
    </YStack>
  );
}
