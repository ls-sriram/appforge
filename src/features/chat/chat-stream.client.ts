import type { Result } from "../../platform/core/types";
import type { ChatStreamEvent } from "./chat.model";

export interface ChatStreamRequest {
  url: string;
  method: "POST";
  headers?: Record<string, string>;
  body?: unknown;
  onEvent: (event: ChatStreamEvent) => void;
}

export interface ChatStreamSubscription {
  cancel: () => void;
  done: Promise<Result<void>>;
}

export interface ChatStreamClient {
  stream(request: ChatStreamRequest): ChatStreamSubscription;
}

class XhrChatStreamClient implements ChatStreamClient {
  stream(request: ChatStreamRequest): ChatStreamSubscription {
    const xhr = new XMLHttpRequest();
    let seenLength = 0;
    let buffer = "";
    let settled = false;

    const done = new Promise<Result<void>>((resolve) => {
      const finish = (result: Result<void>) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      xhr.onreadystatechange = () => {
        if (xhr.readyState < XMLHttpRequest.LOADING) return;
        const nextChunk = xhr.responseText.slice(seenLength);
        seenLength = xhr.responseText.length;
        if (nextChunk) {
          buffer = parseStreamChunk(`${buffer}${nextChunk}`, request.onEvent);
        }
      };

      xhr.onload = () => {
        if (buffer.trim()) {
          buffer = parseStreamChunk(`${buffer}\n`, request.onEvent);
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          finish({ ok: true, data: undefined });
          return;
        }
        finish({ ok: false, error: readError(xhr.responseText) || `HTTP ${xhr.status}` });
      };

      xhr.onerror = () => finish({ ok: false, error: "Network error. Check your connection." });
      xhr.onabort = () => finish({ ok: false, error: "Request cancelled." });

      xhr.open(request.method, request.url);
      xhr.withCredentials = true;
      for (const [key, value] of Object.entries(request.headers ?? {})) {
        xhr.setRequestHeader(key, value);
      }
      xhr.send(request.body === undefined ? undefined : JSON.stringify(request.body));
    });

    return {
      cancel: () => xhr.abort(),
      done,
    };
  }
}

export const chatStreamClient: ChatStreamClient = new XhrChatStreamClient();

function parseStreamChunk(chunk: string, onEvent: (event: ChatStreamEvent) => void): string {
  const lines = chunk.split(/\r?\n/);
  const remainder = lines.pop() ?? "";

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line === "data: [DONE]") continue;
    const data = line.startsWith("data:") ? line.slice(5).trim() : line;
    if (!data) continue;

    try {
      onEvent(JSON.parse(data) as ChatStreamEvent);
    } catch {
      onEvent({ type: "error", error: "Backend sent an invalid chat stream event." });
    }
  }

  return remainder;
}

function readError(text: string): string | undefined {
  try {
    const json = JSON.parse(text);
    return json.error || json.message;
  } catch {
    return text.trim() || undefined;
  }
}
