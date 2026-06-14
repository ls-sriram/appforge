import React from "react";
import { Block, Button } from "../../../../../ui/primitives"
import { Panel } from "../../../../../ui/panels";

interface WelcomeActionsBlockProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function WelcomeActionsBlock({ onSignIn, onCreateAccount }: WelcomeActionsBlockProps) {
  return (
    <Panel>
      <Block space="sm">
        <Button label="Sign In" onPress={onSignIn} />
        <Button label="Create Account" variant="secondary" onPress={onCreateAccount} />
      </Block>
    </Panel>
  );
}
