export type ChatRole = "user" | "assistant" | "system" | "tool";

export type ChatRunStatus = "idle" | "streaming" | "completed" | "cancelled" | "error";

export type ChatMessagePartKind = "text" | "tool-call" | "tool-result" | "attachment";

export interface ChatTagModel {
  id: string;
  label: string;
  color?: string;
}

export interface ChatThreadSummaryModel {
  id: string;
  title: string;
  tags: ChatTagModel[];
  lastMessagePreview?: string;
  unreadCount: number;
  updatedAt: string;
}

export interface ChatToolCallPart {
  kind: "tool-call";
  toolCallId: string;
  name: string;
  input?: unknown;
  status?: "pending" | "running" | "completed" | "error";
}

export interface ChatToolResultPart {
  kind: "tool-result";
  toolCallId: string;
  name?: string;
  output?: unknown;
  status?: "completed" | "error";
}

export interface ChatAttachmentPart {
  kind: "attachment";
  id: string;
  name: string;
  contentType?: string;
  url?: string;
}

export interface ChatTextPart {
  kind: "text";
  text: string;
}

export type ChatMessagePart =
  | ChatTextPart
  | ChatToolCallPart
  | ChatToolResultPart
  | ChatAttachmentPart;

export interface ChatMessageModel {
  id: string;
  threadId: string;
  role: ChatRole;
  parts: ChatMessagePart[];
  createdAt: string;
  status?: ChatRunStatus;
}

export interface ChatThreadDetailModel {
  thread: ChatThreadSummaryModel;
  messages: ChatMessageModel[];
}

export interface ChatSendMessageInput {
  threadId?: string;
  content: string;
  tagIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface ChatSendMessageResult {
  threadId: string;
  runId?: string;
  messages: ChatMessageModel[];
}

export type ChatStreamEvent =
  | { type: "thread"; thread: ChatThreadSummaryModel }
  | { type: "run"; threadId: string; runId: string; status?: ChatRunStatus }
  | { type: "message"; message: ChatMessageModel }
  | { type: "delta"; messageId: string; threadId: string; text: string }
  | { type: "tool-call"; messageId: string; threadId: string; part: ChatToolCallPart }
  | { type: "tool-result"; messageId: string; threadId: string; part: ChatToolResultPart }
  | { type: "done"; threadId: string; runId?: string }
  | { type: "error"; error: string };

export interface ChatSupportState {
  threads: ChatThreadSummaryModel[];
  selectedThreadId?: string;
  messages: ChatMessageModel[];
  availableTags: ChatTagModel[];
  selectedTagIds: string[];
  draft: string;
  loadingThreads: boolean;
  loadingMessages: boolean;
  runStatus: ChatRunStatus;
  activeRunId?: string;
  error?: string;
}

export interface ChatSupportActions {
  refreshThreads: () => Promise<void>;
  selectThread: (threadId: string) => Promise<void>;
  createThread: (title?: string, tagIds?: string[]) => Promise<void>;
  setDraft: (value: string) => void;
  toggleTag: (tagId: string) => void;
  sendMessage: () => Promise<void>;
  cancelRun: () => Promise<void>;
}

export const CHAT_MESSAGE_MAX_CHARS = 12000;
