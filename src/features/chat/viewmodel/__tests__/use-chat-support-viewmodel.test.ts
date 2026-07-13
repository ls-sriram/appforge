import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useChatSupportViewModel } from "../../chat.viewmodel";
import { CHAT_MESSAGE_MAX_CHARS, type ChatStreamEvent } from "../../chat.model";
import type { ChatRepository, ChatStreamSubscription } from "../../chat.repository";

function createRepository(events: ChatStreamEvent[] = []): ChatRepository {
  return {
    listThreads: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    listTags: jest.fn().mockResolvedValue({ ok: true, data: [] }),
    createThread: jest.fn().mockResolvedValue({
      ok: true,
      data: {
        id: "thread-1",
        title: "Support conversation",
        tags: [],
        unreadCount: 0,
        updatedAt: "2026-07-12T00:00:00.000Z",
      },
    }),
    getThread: jest.fn().mockResolvedValue({
      ok: true,
      data: {
        thread: {
          id: "thread-1",
          title: "Support conversation",
          tags: [],
          unreadCount: 0,
          updatedAt: "2026-07-12T00:00:00.000Z",
        },
        messages: [],
      },
    }),
    sendMessage: jest.fn((_, onEvent: (event: ChatStreamEvent) => void): ChatStreamSubscription => {
      for (const event of events) onEvent(event);
      return {
        cancel: jest.fn(),
        done: Promise.resolve({ ok: true, data: undefined }),
      };
    }),
    cancelRun: jest.fn().mockResolvedValue({ ok: true, data: undefined }),
    retryMessage: jest.fn(),
    appendLocalMessage: jest.fn(),
  };
}

describe("chat/viewmodel/useChatSupportViewModel", () => {
  it("clamps the draft to the chat message maximum", async () => {
    const repository = createRepository();
    const { result } = renderHook(() => useChatSupportViewModel({ repository }));

    await act(async () => {
      result.current.actions.setDraft("a".repeat(CHAT_MESSAGE_MAX_CHARS + 100));
    });

    expect(result.current.state.draft.length).toBe(CHAT_MESSAGE_MAX_CHARS);
  });

  it("turns stream deltas into assistant message text", async () => {
    const repository = createRepository([
      {
        type: "thread",
        thread: {
          id: "thread-1",
          title: "Support conversation",
          tags: [],
          unreadCount: 0,
          updatedAt: "2026-07-12T00:00:00.000Z",
        },
      },
      { type: "run", threadId: "thread-1", runId: "run-1", status: "streaming" },
      { type: "delta", threadId: "thread-1", messageId: "assistant-1", text: "Hello" },
      { type: "delta", threadId: "thread-1", messageId: "assistant-1", text: " there" },
      { type: "done", threadId: "thread-1", runId: "run-1" },
    ]);
    const { result } = renderHook(() => useChatSupportViewModel({ repository }));

    await act(async () => {
      result.current.actions.setDraft("Need help");
    });

    await act(async () => {
      await result.current.actions.sendMessage();
    });

    await waitFor(() => {
      expect(result.current.state.runStatus).toBe("completed");
    });
    const assistant = result.current.state.messages.find((message) => message.id === "assistant-1");
    expect(assistant?.parts).toEqual([{ kind: "text", text: "Hello there" }]);
  });
});
