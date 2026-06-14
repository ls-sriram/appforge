import React from "react";
import { Block, Badge, Text } from "../../../../../ui/primitives"
import { Panel } from "../../../../../ui/panels";
import { app } from "../../../../../config/app";

export function WelcomeHeroBlock() {
  return (
    <Panel pad="none">
      <Block pad="lg">
        <Block space="md">
          <Block space="xs">
            <Badge label={app.name} variant="default" size="sm" />
            <Text variant="h1">{app.tagline}</Text>
          </Block>
        </Block>
      </Block>
    </Panel>
  );
}
