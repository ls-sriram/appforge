import React from "react";
import { Block, Icon, Text } from "../../../../ui/primitives"
import { Panel } from "../../../../ui/panels";
import { app } from "../../../../config/app";

interface AuthBrandBlockProps {
  subtitle: string;
}

export function AuthBrandBlock({ subtitle }: AuthBrandBlockProps) {
  return (
    <Block align="center" space="sm">
      <Block direction="horizontal" align="center" space="sm">
        <Panel pad="none">
          <Block pad="sm">
            <Icon name="zap" size="md" />
          </Block>
        </Panel>
        <Text variant="h2">{app.name}</Text>
      </Block>
      <Text variant="bodySm">{subtitle}</Text>
    </Block>
  );
}
