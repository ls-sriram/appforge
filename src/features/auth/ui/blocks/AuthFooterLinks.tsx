import React from "react";
import { TouchableOpacity } from "react-native";
import { Row, Body, Label } from "../../../../ui/primitives";

interface AuthFooterLinksProps {
  prompt: string;
  linkLabel: string;
  onPress: () => void;
}

export function AuthFooterLinks({ prompt, linkLabel, onPress }: AuthFooterLinksProps) {
  return (
    <Row centered between="xs">
      <Body size="sm" dim>{prompt}</Body>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Label primary bold>{linkLabel}</Label>
      </TouchableOpacity>
    </Row>
  );
}
