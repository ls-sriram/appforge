import React from "react";
import { Body, Heading, ScrollView, XStack, YStack } from "../../platform/ui/index";
import type { ChatMessageModel, ChatMessagePart } from "./chat.model";

interface ChatMessageListBlockProps {
  messages: ChatMessageModel[];
  loading: boolean;
  runStatus: string;
}

export function ChatMessageListBlock({ messages, loading, runStatus }: ChatMessageListBlockProps) {
  return (
    <YStack f={1} gap="$3" minHeight={360}>
      <XStack ai="center" jc="space-between" gap="$3">
        <Heading>Conversation</Heading>
        {runStatus === "streaming" ? <Body fontSize="$2" color="$textMuted">Agent is responding</Body> : null}
      </XStack>
      <ScrollView style={{ flex: 1 }}>
        <YStack gap="$3" paddingRight="$2">
          {loading ? <Body fontSize="$2" color="$textMuted">Loading conversation...</Body> : null}
          {!loading && messages.length === 0 ? (
            <Body fontSize="$2" color="$textMuted">Start a support conversation.</Body>
          ) : null}
          {messages.map((message) => (
            <YStack
              key={message.id}
              alignSelf={message.role === "user" ? "flex-end" : "stretch"}
              maxWidth={message.role === "user" ? 560 : undefined}
              gap="$2"
              padding="$3"
              borderRadius="$sm"
              backgroundColor={message.role === "user" ? "$primary" : "$surface"}
              borderWidth={message.role === "user" ? 0 : 1}
              borderColor="$border"
            >
              <Body
                fontSize="$2"
                color={message.role === "user" ? "$textInverse" : "$textMuted"}
              >
                {roleLabel(message.role)}
              </Body>
              <YStack gap="$2">
                {message.parts.map((part, index) => (
                  <MessagePart key={`${message.id}-${index}`} part={part} role={message.role} />
                ))}
              </YStack>
            </YStack>
          ))}
        </YStack>
      </ScrollView>
    </YStack>
  );
}

function MessagePart({ part, role }: { part: ChatMessagePart; role: ChatMessageModel["role"] }) {
  if (part.kind === "text") {
    return <Body color={role === "user" ? "$textInverse" : "$textPrimary"}>{part.text}</Body>;
  }

  if (part.kind === "attachment") {
    return (
      <YStack gap="$1" padding="$2" borderRadius="$sm" backgroundColor="$surfaceMuted">
        <Body fontSize="$2">{part.name}</Body>
        <Body fontSize="$2" color="$textMuted">{part.contentType ?? "Attachment"}</Body>
      </YStack>
    );
  }

  const label = part.kind === "tool-call" ? `Tool call: ${part.name}` : `Tool result: ${part.name ?? part.toolCallId}`;
  const detail = part.kind === "tool-call" ? part.input : part.output;

  return (
    <YStack gap="$1" padding="$2" borderRadius="$sm" backgroundColor="$surfaceMuted" borderWidth={1} borderColor="$border">
      <XStack ai="center" jc="space-between" gap="$2">
        <Body fontSize="$2">{label}</Body>
        <Body fontSize="$2" color="$textMuted">{part.status ?? "pending"}</Body>
      </XStack>
      {detail !== undefined ? (
        <Body fontSize="$2" color="$textMuted" numberOfLines={4}>
          {formatDetail(detail)}
        </Body>
      ) : null}
    </YStack>
  );
}

function roleLabel(role: ChatMessageModel["role"]): string {
  if (role === "assistant") return "Support agent";
  if (role === "user") return "You";
  if (role === "tool") return "Tool";
  return "System";
}

function formatDetail(value: unknown): string {
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
