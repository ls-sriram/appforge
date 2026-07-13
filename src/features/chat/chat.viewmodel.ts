import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  cancelChatRun,
  createChatThread,
  listChatTags,
  listChatThreads,
  loadChatThread,
  sendChatMessage,
} from "./chat-actions.usecase";
import type {
  ChatMessageModel,
  ChatRunStatus,
  ChatStreamEvent,
  ChatSupportActions,
  ChatSupportState,
  ChatThreadSummaryModel,
} from "./chat.model";
import { CHAT_MESSAGE_MAX_CHARS } from "./chat.model";
import type { ChatRepository, ChatStreamSubscription } from "./chat.repository";

interface UseChatSupportViewModelParams {
  repository?: ChatRepository;
  initialThreadId?: string;
  initialTagIds?: string[];
}

export function useChatSupportViewModel(params: UseChatSupportViewModelParams = {}) {
  const repository = params.repository;
  const streamRef = useRef<ChatStreamSubscription | undefined>(undefined);
  const [state, setState] = useState<ChatSupportState>({
    threads: [],
    selectedThreadId: params.initialThreadId,
    messages: [],
    availableTags: [],
    selectedTagIds: params.initialTagIds ?? [],
    draft: "",
    loadingThreads: true,
    loadingMessages: false,
    runStatus: "idle",
  });

  const refreshThreads = useCallback(async () => {
    setState((current) => ({ ...current, loadingThreads: true, error: undefined }));
    const [threadsResult, tagsResult] = await Promise.all([
      listChatThreads(state.selectedTagIds, repository),
      listChatTags(repository),
    ]);

    setState((current) => ({
      ...current,
      loadingThreads: false,
      threads: threadsResult.ok ? threadsResult.data : current.threads,
      availableTags: tagsResult.ok ? tagsResult.data : current.availableTags,
      error: !threadsResult.ok
        ? threadsResult.error
        : !tagsResult.ok
          ? tagsResult.error
          : undefined,
    }));
  }, [repository, state.selectedTagIds]);

  const selectThread = useCallback(async (threadId: string) => {
    const id = threadId.trim();
    if (!id) return;
    setState((current) => ({ ...current, selectedThreadId: id, loadingMessages: true, error: undefined }));
    const result = await loadChatThread(id, repository);
    setState((current) => ({
      ...current,
      loadingMessages: false,
      selectedThreadId: id,
      messages: result.ok ? result.data.messages : current.messages,
      error: result.ok ? undefined : result.error,
    }));
  }, [repository]);

  const createThread = useCallback(async (title?: string, tagIds?: string[]) => {
    setState((current) => ({ ...current, loadingThreads: true, error: undefined }));
    const result = await createChatThread(title, tagIds ?? state.selectedTagIds, repository);
    if (!result.ok) {
      setState((current) => ({ ...current, loadingThreads: false, error: result.error }));
      return;
    }
    setState((current) => ({
      ...current,
      loadingThreads: false,
      threads: upsertThread(current.threads, result.data),
      selectedThreadId: result.data.id,
      messages: [],
    }));
  }, [repository, state.selectedTagIds]);

  const setDraft = useCallback((value: string) => {
    setState((current) => ({
      ...current,
      draft: value.slice(0, CHAT_MESSAGE_MAX_CHARS),
    }));
  }, []);

  const toggleTag = useCallback((tagId: string) => {
    setState((current) => {
      const selected = current.selectedTagIds.includes(tagId)
        ? current.selectedTagIds.filter((id) => id !== tagId)
        : [...current.selectedTagIds, tagId];
      return { ...current, selectedTagIds: selected };
    });
  }, []);

  const applyEvent = useCallback((event: ChatStreamEvent) => {
    setState((current) => reduceStreamEvent(current, event));
  }, []);

  const sendMessageAction = useCallback(async () => {
    const content = state.draft.trim();
    if (!content || state.runStatus === "streaming") return;

    const now = new Date().toISOString();
    const threadId = state.selectedThreadId ?? `local-${Date.now()}`;
    const localMessage: ChatMessageModel = {
      id: `local-user-${Date.now()}`,
      threadId,
      role: "user",
      parts: [{ kind: "text", text: content }],
      createdAt: now,
      status: "completed",
    };
    repository?.appendLocalMessage(localMessage);

    setState((current) => ({
      ...current,
      selectedThreadId: threadId,
      draft: "",
      runStatus: "streaming",
      messages: [...current.messages, localMessage],
      error: undefined,
    }));

    const subscription = sendChatMessage(
      {
        threadId: state.selectedThreadId,
        content,
        tagIds: state.selectedTagIds,
      },
      applyEvent,
      repository,
    );
    streamRef.current = subscription;
    const result = await subscription.done;
    streamRef.current = undefined;
    setState((current) => ({
      ...current,
      runStatus: result.ok ? runTerminalStatus(current.runStatus) : "error",
      error: result.ok ? current.error : result.error,
    }));
    await refreshThreads();
  }, [applyEvent, refreshThreads, repository, state.draft, state.runStatus, state.selectedTagIds, state.selectedThreadId]);

  const cancelRunAction = useCallback(async () => {
    streamRef.current?.cancel();
    if (state.selectedThreadId && state.activeRunId) {
      await cancelChatRun(state.selectedThreadId, state.activeRunId, repository);
    }
    setState((current) => ({ ...current, runStatus: "cancelled", activeRunId: undefined }));
  }, [repository, state.activeRunId, state.selectedThreadId]);

  useEffect(() => {
    void refreshThreads();
    return () => streamRef.current?.cancel();
  }, [refreshThreads]);

  useEffect(() => {
    if (params.initialThreadId) void selectThread(params.initialThreadId);
  }, [params.initialThreadId, selectThread]);

  const actions = useMemo<ChatSupportActions>(() => ({
    refreshThreads,
    selectThread,
    createThread,
    setDraft,
    toggleTag,
    sendMessage: sendMessageAction,
    cancelRun: cancelRunAction,
  }), [cancelRunAction, createThread, refreshThreads, selectThread, sendMessageAction, setDraft, toggleTag]);

  return { state, actions };
}

function reduceStreamEvent(state: ChatSupportState, event: ChatStreamEvent): ChatSupportState {
  switch (event.type) {
    case "thread":
      return {
        ...state,
        selectedThreadId: event.thread.id,
        threads: upsertThread(state.threads, event.thread),
        messages: state.messages.map((message) => message.threadId.startsWith("local-")
          ? { ...message, threadId: event.thread.id }
          : message),
      };
    case "run":
      return {
        ...state,
        selectedThreadId: event.threadId,
        activeRunId: event.runId,
        runStatus: event.status ?? state.runStatus,
      };
    case "message":
      return {
        ...state,
        selectedThreadId: event.message.threadId,
        messages: upsertMessage(state.messages, event.message),
      };
    case "delta":
      return {
        ...state,
        selectedThreadId: event.threadId,
        messages: appendAssistantDelta(state.messages, event.threadId, event.messageId, event.text),
      };
    case "tool-call":
      return {
        ...state,
        messages: appendPart(state.messages, event.threadId, event.messageId, event.part),
      };
    case "tool-result":
      return {
        ...state,
        messages: appendPart(state.messages, event.threadId, event.messageId, event.part),
      };
    case "done":
      return {
        ...state,
        selectedThreadId: event.threadId,
        runStatus: "completed",
        activeRunId: event.runId,
      };
    case "error":
      return {
        ...state,
        runStatus: "error",
        error: event.error,
      };
  }
}

function upsertThread(threads: ChatThreadSummaryModel[], thread: ChatThreadSummaryModel): ChatThreadSummaryModel[] {
  const next = [thread, ...threads.filter((item) => item.id !== thread.id)];
  return next.sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function upsertMessage(messages: ChatMessageModel[], message: ChatMessageModel): ChatMessageModel[] {
  const next = [...messages.filter((item) => item.id !== message.id), message];
  return next.sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}

function appendAssistantDelta(
  messages: ChatMessageModel[],
  threadId: string,
  messageId: string,
  text: string,
): ChatMessageModel[] {
  const existing = messages.find((message) => message.id === messageId);
  if (!existing) {
    return [
      ...messages,
      {
        id: messageId,
        threadId,
        role: "assistant",
        parts: [{ kind: "text", text }],
        createdAt: new Date().toISOString(),
        status: "streaming",
      },
    ];
  }

  return messages.map((message) => {
    if (message.id !== messageId) return message;
    const parts = [...message.parts];
    const last = parts[parts.length - 1];
    if (last?.kind === "text") {
      parts[parts.length - 1] = { ...last, text: `${last.text}${text}` };
    } else {
      parts.push({ kind: "text", text });
    }
    return { ...message, parts, status: "streaming" };
  });
}

function appendPart(
  messages: ChatMessageModel[],
  threadId: string,
  messageId: string,
  part: ChatMessageModel["parts"][number],
): ChatMessageModel[] {
  const existing = messages.find((message) => message.id === messageId);
  if (!existing) {
    return [
      ...messages,
      {
        id: messageId,
        threadId,
        role: "assistant",
        parts: [part],
        createdAt: new Date().toISOString(),
        status: "streaming",
      },
    ];
  }
  return messages.map((message) => message.id === messageId
    ? { ...message, parts: [...message.parts, part], status: "streaming" }
    : message);
}

function runTerminalStatus(current: ChatRunStatus): ChatRunStatus {
  return current === "cancelled" || current === "error" ? current : "completed";
}
