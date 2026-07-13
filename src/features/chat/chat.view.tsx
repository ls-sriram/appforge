import React from "react";
import { XStack, YStack } from "../../platform/ui/index";
import { ChatComposerBlock } from "./chat-composer.block";
import { ChatMessageListBlock } from "./chat-message-list.block";
import type { ChatSupportActions, ChatSupportState } from "./chat.model";
import { ChatThreadListBlock } from "./chat-thread-list.block";

interface ChatSupportViewProps {
  state: ChatSupportState;
  actions: ChatSupportActions;
  layout?: "split" | "stacked";
}

export function ChatSupportView({ state, actions, layout = "split" }: ChatSupportViewProps) {
  const content = (
    <>
      <ChatThreadListBlock
        threads={state.threads}
        availableTags={state.availableTags}
        selectedThreadId={state.selectedThreadId}
        selectedTagIds={state.selectedTagIds}
        loading={state.loadingThreads}
        onSelectThread={(threadId) => void actions.selectThread(threadId)}
        onCreateThread={() => void actions.createThread()}
        onToggleTag={actions.toggleTag}
        onRefresh={() => void actions.refreshThreads()}
      />
      <YStack f={1} gap="$4">
        <ChatMessageListBlock
          messages={state.messages}
          loading={state.loadingMessages}
          runStatus={state.runStatus}
        />
        <ChatComposerBlock
          value={state.draft}
          runStatus={state.runStatus}
          error={state.error}
          onChange={actions.setDraft}
          onSend={() => void actions.sendMessage()}
          onCancel={() => void actions.cancelRun()}
        />
      </YStack>
    </>
  );

  if (layout === "stacked") {
    return <YStack gap="$4">{content}</YStack>;
  }

  return (
    <XStack gap="$5" alignItems="stretch" flexWrap="wrap">
      {content}
    </XStack>
  );
}
