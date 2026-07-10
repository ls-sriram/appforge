import type { Transcript, TranscriptResult, TranscriptState } from "./transcription.model";
import type { TranscriptionContentResolver, TranscriptionHandler } from "./transcription.provider";

const IDLE_STATE: TranscriptState = { status: "idle" };

export class TranscriptionService {
  private readonly states = new Map<string, TranscriptState>();
  private readonly requests = new Map<string, Promise<TranscriptResult<Transcript>>>();
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly resolver: TranscriptionContentResolver,
    private readonly handler: TranscriptionHandler,
  ) {}

  getState(recordingId: string): TranscriptState {
    return this.states.get(recordingId) ?? IDLE_STATE;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  request(recordingId: string): Promise<TranscriptResult<Transcript>> {
    const id = recordingId.trim();
    if (!id) {
      return Promise.resolve({
        ok: false,
        error: { code: "recording_unavailable", message: "Recording id is required.", recoverable: false },
      });
    }

    const cached = this.states.get(id);
    if (cached?.status === "ready" && cached.transcript) {
      return Promise.resolve({ ok: true, data: cached.transcript });
    }

    const pending = this.requests.get(id);
    if (pending) return pending;

    this.setState(id, { status: "loading" });
    const request = this.performRequest(id).finally(() => this.requests.delete(id));
    this.requests.set(id, request);
    return request;
  }

  clear(recordingId: string): void {
    this.states.delete(recordingId);
    this.emit();
  }

  private async performRequest(recordingId: string): Promise<TranscriptResult<Transcript>> {
    try {
      const content = await this.resolver.resolve(recordingId);
      if (!content.ok) {
        this.setState(recordingId, { status: "error", error: content.error });
        return content;
      }

      const result = await this.handler.transcribe(content.data);
      if (!result.ok) {
        this.setState(recordingId, { status: "error", error: result.error });
        return result;
      }

      const transcript = { ...result.data, recordingId };
      this.setState(recordingId, { status: "ready", transcript });
      return { ok: true, data: transcript };
    } catch (cause) {
      const error = {
        code: "request_failed" as const,
        message: cause instanceof Error ? cause.message : "Transcription failed.",
        recoverable: true,
      };
      this.setState(recordingId, { status: "error", error });
      return { ok: false, error };
    }
  }

  private setState(recordingId: string, state: TranscriptState): void {
    this.states.set(recordingId, state);
    this.emit();
  }

  private emit(): void {
    this.listeners.forEach((listener) => listener());
  }
}

