import { BUILD_APP_ID } from "../../generated/build-app-config";
import { api } from "../../platform/api/client";
import type { Result } from "../../platform/core/types";
import type {
  ChatMessageModel,
  ChatMessagePart,
  ChatSendMessageInput,
  ChatStreamEvent,
  ChatTagModel,
  ChatThreadDetailModel,
  ChatThreadSummaryModel,
} from "./chat.model";
import type { ChatRepository, ChatStreamSubscription } from "./chat.repository";
import { chatStreamClient, type ChatStreamClient } from "./chat-stream.client";

interface ThreadListPayload {
  threads: ChatThreadPayload[];
}

interface TagListPayload {
  tags: ChatTagPayload[];
}

interface ThreadDetailPayload {
  thread: ChatThreadPayload;
  messages: ChatMessagePayload[];
}

interface ChatTagPayload {
  id: string;
  label: string;
  color?: string;
}

interface ChatThreadPayload {
  id: string;
  title?: string;
  tags?: ChatTagPayload[];
  lastMessagePreview?: string;
  unreadCount?: number;
  updatedAt?: string;
}

interface ChatMessagePayload {
  id: string;
  threadId: string;
  role: ChatMessageModel["role"];
  parts?: ChatMessagePart[];
  content?: string;
  createdAt?: string;
  status?: ChatMessageModel["status"];
}

const CHAT_PATH = "/chat";

export class BackendChatRepository implements ChatRepository {
  private readonly streamClient: ChatStreamClient;
  private localMessages: ChatMessageModel[] = [];

  constructor(streamClient: ChatStreamClient = chatStreamClient) {
    this.streamClient = streamClient;
  }

  async listThreads(tagIds: string[] = []): Promise<Result<ChatThreadSummaryModel[]>> {
    const query = tagIds.length > 0 ? `?tags=${encodeURIComponent(tagIds.join(","))}` : "";
    const result = await api.get<ThreadListPayload>(`${CHAT_PATH}/threads${query}`);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.threads.map(mapThread) };
  }

  async listTags(): Promise<Result<ChatTagModel[]>> {
    const result = await api.get<TagListPayload>(`${CHAT_PATH}/tags`);
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: result.data.tags.map(mapTag) };
  }

  async createThread(title?: string, tagIds: string[] = []): Promise<Result<ChatThreadSummaryModel>> {
    const result = await api.post<ChatThreadPayload>(`${CHAT_PATH}/threads`, {
      title,
      tagIds,
    });
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: mapThread(result.data) };
  }

  async getThread(threadId: string): Promise<Result<ChatThreadDetailModel>> {
    const id = threadId.trim();
    if (!id) return { ok: false, error: "Thread id is required." };
    const result = await api.get<ThreadDetailPayload>(`${CHAT_PATH}/threads/${encodeURIComponent(id)}`);
    if (!result.ok) return { ok: false, error: result.error };
    const remoteMessages = result.data.messages.map(mapMessage);
    const localMessages = this.localMessages.filter((message) => message.threadId === id);
    return {
      ok: true,
      data: {
        thread: mapThread(result.data.thread),
        messages: mergeMessages(remoteMessages, localMessages),
      },
    };
  }

  sendMessage(input: ChatSendMessageInput, onEvent: (event: ChatStreamEvent) => void): ChatStreamSubscription {
    const path = input.threadId
      ? `${CHAT_PATH}/threads/${encodeURIComponent(input.threadId)}/runs`
      : `${CHAT_PATH}/runs`;

    return this.streamClient.stream({
      url: api.buildUrl(path),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": BUILD_APP_ID,
      },
      body: {
        message: input.content,
        tagIds: input.tagIds ?? [],
        metadata: input.metadata,
      },
      onEvent,
    });
  }

  async cancelRun(threadId: string, runId: string): Promise<Result<void>> {
    const cleanThreadId = threadId.trim();
    const cleanRunId = runId.trim();
    if (!cleanThreadId || !cleanRunId) return { ok: false, error: "Thread id and run id are required." };
    const result = await api.post<void>(
      `${CHAT_PATH}/threads/${encodeURIComponent(cleanThreadId)}/runs/${encodeURIComponent(cleanRunId)}/cancel`,
    );
    if (!result.ok) return { ok: false, error: result.error };
    return { ok: true, data: undefined };
  }

  retryMessage(threadId: string, messageId: string, onEvent: (event: ChatStreamEvent) => void): ChatStreamSubscription {
    return this.streamClient.stream({
      url: api.buildUrl(
        `${CHAT_PATH}/threads/${encodeURIComponent(threadId)}/messages/${encodeURIComponent(messageId)}/retry`,
      ),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": BUILD_APP_ID,
      },
      body: {},
      onEvent,
    });
  }

  appendLocalMessage(message: ChatMessageModel): void {
    this.localMessages = mergeMessages(this.localMessages, [message]);
  }
}

function mapTag(payload: ChatTagPayload): ChatTagModel {
  return {
    id: payload.id,
    label: payload.label,
    color: payload.color,
  };
}

function mapThread(payload: ChatThreadPayload): ChatThreadSummaryModel {
  return {
    id: payload.id,
    title: payload.title?.trim() || "Support conversation",
    tags: (payload.tags ?? []).map(mapTag),
    lastMessagePreview: payload.lastMessagePreview,
    unreadCount: payload.unreadCount ?? 0,
    updatedAt: payload.updatedAt ?? new Date().toISOString(),
  };
}

function mapMessage(payload: ChatMessagePayload): ChatMessageModel {
  return {
    id: payload.id,
    threadId: payload.threadId,
    role: payload.role,
    parts: payload.parts ?? [{ kind: "text", text: payload.content ?? "" }],
    createdAt: payload.createdAt ?? new Date().toISOString(),
    status: payload.status,
  };
}

function mergeMessages(current: ChatMessageModel[], incoming: ChatMessageModel[]): ChatMessageModel[] {
  const byId = new Map<string, ChatMessageModel>();
  for (const message of current) byId.set(message.id, message);
  for (const message of incoming) byId.set(message.id, message);
  return Array.from(byId.values()).sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));
}
