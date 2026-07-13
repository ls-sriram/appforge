import { BackendChatRepository } from "./backend-chat.datasource";
import type { ChatSendMessageInput, ChatStreamEvent } from "./chat.model";
import type { ChatRepository, ChatStreamSubscription } from "./chat.repository";

const defaultRepository = new BackendChatRepository();

export function listChatThreads(tagIds?: string[], repository: ChatRepository = defaultRepository) {
  return repository.listThreads(tagIds);
}

export function listChatTags(repository: ChatRepository = defaultRepository) {
  return repository.listTags();
}

export function createChatThread(title?: string, tagIds?: string[], repository: ChatRepository = defaultRepository) {
  return repository.createThread(title, tagIds);
}

export function loadChatThread(threadId: string, repository: ChatRepository = defaultRepository) {
  return repository.getThread(threadId);
}

export function sendChatMessage(
  input: ChatSendMessageInput,
  onEvent: (event: ChatStreamEvent) => void,
  repository: ChatRepository = defaultRepository,
): ChatStreamSubscription {
  return repository.sendMessage(input, onEvent);
}

export function cancelChatRun(threadId: string, runId: string, repository: ChatRepository = defaultRepository) {
  return repository.cancelRun(threadId, runId);
}
