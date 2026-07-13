import React from "react";
import { Body, Button, TextArea, useUI, XStack, YStack } from "../../platform/ui/index";
import { CHAT_MESSAGE_MAX_CHARS } from "./chat.model";

interface ChatComposerBlockProps {
  value: string;
  runStatus: string;
  error?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
}

export function ChatComposerBlock({ value, runStatus, error, onChange, onSend, onCancel }: ChatComposerBlockProps) {
  const { contracts } = useUI();
  const streaming = runStatus === "streaming";
  const canSend = value.trim().length > 0 && !streaming;

  return (
    <YStack gap="$2">
      {error ? <Body fontSize="$2" color="$error">{error}</Body> : null}
      <TextArea
        contract={contracts.textArea!["default"]}
        value={value}
        onChangeText={onChange}
        placeholder="Ask for help..."
        maxLength={CHAT_MESSAGE_MAX_CHARS}
        disabled={streaming}
      />
      <XStack ai="center" jc="space-between" gap="$3">
        <Body fontSize="$2" color="$textMuted">{`${value.length}/${CHAT_MESSAGE_MAX_CHARS}`}</Body>
        <XStack gap="$2">
          {streaming ? (
            <Button contract={contracts.button!["secondary"]} onPress={onCancel}>Stop</Button>
          ) : null}
          <Button contract={contracts.button!["primary"]} onPress={onSend} disabled={!canSend}>Send</Button>
        </XStack>
      </XStack>
    </YStack>
  );
}
