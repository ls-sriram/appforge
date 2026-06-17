import React from "react";
import { Col, Button } from "../../../../../ui/primitives";

interface WelcomeActionsBlockProps {
  onSignIn: () => void;
  onCreateAccount: () => void;
}

export function WelcomeActionsBlock({ onSignIn, onCreateAccount }: WelcomeActionsBlockProps) {
  return (
    <Col between="sm" inset="md" padV="md">
      <Button label="Sign In" onPress={onSignIn} />
      <Button label="Create Account" variant="secondary" onPress={onCreateAccount} />
    </Col>
  );
}
