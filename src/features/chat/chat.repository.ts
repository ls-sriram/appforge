import type { Result } from "../../platform/core/types";
import type {
  ChatMessageModel,
  ChatSendMessageInput,
  ChatStreamEvent,
  ChatTagModel,
  ChatThreadDetailModel,
  ChatThreadSummaryModel,
} from "./chat.model";

export interface ChatStreamSubscription {
  cancel: () => void;
  done: Promise<Result<void>>;
}

export interface ChatRepository {
  listThreads(tagIds?: string[]): Promise<Result<ChatThreadSummaryModel[]>>;
  listTags(): Promise<Result<ChatTagModel[]>>;
  createThread(title?: string, tagIds?: string[]): Promise<Result<ChatThreadSummaryModel>>;
  getThread(threadId: string): Promise<Result<ChatThreadDetailModel>>;
  sendMessage(input: ChatSendMessageInput, onEvent: (event: ChatStreamEvent) => void): ChatStreamSubscription;
  cancelRun(threadId: string, runId: string): Promise<Result<void>>;
  retryMessage(threadId: string, messageId: string, onEvent: (event: ChatStreamEvent) => void): ChatStreamSubscription;
  appendLocalMessage(message: ChatMessageModel): void;
}
