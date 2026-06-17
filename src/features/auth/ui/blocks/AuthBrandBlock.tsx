import React from "react";
import { Body, Heading, Icon, XStack, YStack } from "../../../../ui";
import { app } from "../../../../config/app";

interface AuthBrandBlockProps {
  subtitle: string;
}

export function AuthBrandBlock({ subtitle }: AuthBrandBlockProps) {
  return (
    <YStack gap="$3" ai="center">
      <XStack ai="center" gap="$3">
        <Icon name="zap" size="md" />
        <Heading fontFamily="$bold">{app.name}</Heading>
      </XStack>
      <Body color="$textMuted" textAlign="center">{subtitle}</Body>
    </YStack>
  );
}
