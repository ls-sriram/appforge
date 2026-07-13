import React from "react";
import { Body, Button, Heading, Tag, useUI, XStack, YStack } from "../../platform/ui/index";
import type { ChatTagModel, ChatThreadSummaryModel } from "./chat.model";

interface ChatThreadListBlockProps {
  threads: ChatThreadSummaryModel[];
  availableTags: ChatTagModel[];
  selectedThreadId?: string;
  selectedTagIds: string[];
  loading: boolean;
  onSelectThread: (threadId: string) => void;
  onCreateThread: () => void;
  onToggleTag: (tagId: string) => void;
  onRefresh: () => void;
}

export function ChatThreadListBlock({
  threads,
  availableTags,
  selectedThreadId,
  selectedTagIds,
  loading,
  onSelectThread,
  onCreateThread,
  onToggleTag,
  onRefresh,
}: ChatThreadListBlockProps) {
  const { contracts } = useUI();
  const formatter = React.useMemo(
    () => new Intl.DateTimeFormat(undefined, { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
    [],
  );

  return (
    <YStack gap="$4" minWidth={260}>
      <XStack ai="center" jc="space-between" gap="$3">
        <Heading>Support</Heading>
        <Button contract={contracts.button!["primary"]} onPress={onCreateThread}>New</Button>
      </XStack>

      {availableTags.length > 0 ? (
        <YStack gap="$2">
          <Body fontSize="$2" color="$textMuted">Tags</Body>
          <XStack gap="$2" flexWrap="wrap">
            {availableTags.map((tag) => (
              <Tag
                key={tag.id}
                contract={contracts.tag!["accent"]}
                label={tag.label}
                selected={selectedTagIds.includes(tag.id)}
                onPress={() => onToggleTag(tag.id)}
              />
            ))}
          </XStack>
        </YStack>
      ) : null}

      <XStack ai="center" jc="space-between" gap="$3">
        <Body fontSize="$2" color="$textMuted">{loading ? "Loading..." : `${threads.length} threads`}</Body>
        <Button contract={contracts.button!["ghost"]} onPress={onRefresh} disabled={loading}>Refresh</Button>
      </XStack>

      <YStack gap="$2">
        {threads.length === 0 && !loading ? (
          <Body fontSize="$2" color="$textMuted">No support threads yet.</Body>
        ) : null}
        {threads.map((thread) => {
          const updatedAt = Date.parse(thread.updatedAt);
          const updatedLabel = Number.isNaN(updatedAt) ? thread.updatedAt : formatter.format(new Date(updatedAt));
          const selected = thread.id === selectedThreadId;
          return (
            <YStack
              key={thread.id}
              gap="$1"
              padding="$3"
              borderRadius="$sm"
              borderWidth={1}
              borderColor={selected ? "$primary" : "$border"}
              backgroundColor={selected ? "$surfaceMuted" : "$surface"}
              onPress={() => onSelectThread(thread.id)}
              cursor="pointer"
            >
              <XStack ai="center" jc="space-between" gap="$2">
                <Body fontSize="$2" numberOfLines={1}>{thread.title}</Body>
                {thread.unreadCount > 0 ? <Body fontSize="$2" color="$primary">{thread.unreadCount}</Body> : null}
              </XStack>
              {thread.lastMessagePreview ? (
                <Body fontSize="$2" color="$textMuted" numberOfLines={2}>{thread.lastMessagePreview}</Body>
              ) : null}
              <XStack ai="center" jc="space-between" gap="$2">
                <Body fontSize="$2" color="$textMuted">{updatedLabel}</Body>
                {thread.tags.length > 0 ? (
                  <Body fontSize="$2" color="$textMuted" numberOfLines={1}>
                    {thread.tags.map((tag) => tag.label).join(", ")}
                  </Body>
                ) : null}
              </XStack>
            </YStack>
          );
        })}
      </YStack>
    </YStack>
  );
}
