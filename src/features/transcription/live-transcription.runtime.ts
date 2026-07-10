import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";
import type { EventSubscription } from "expo-modules-core";
import type {
  LiveTranscriptEvent,
  LiveTranscriptionOptions,
  LiveTranscriptionState,
} from "./transcription.model";

interface LiveSpeechRecognitionModule {
  addListener(name: "start" | "end", listener: () => void): EventSubscription;
  addListener(name: "result", listener: (event: { isFinal: boolean; results: Array<{ transcript: string }> }) => void): EventSubscription;
  addListener(name: "error", listener: (event: { error: string }) => void): EventSubscription;
  isRecognitionAvailable(): boolean;
  requestPermissionsAsync(): Promise<{ granted: boolean }>;
  start(options: {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    contextualStrings: string[];
  }): void;
  stop(): void;
}

const DEFAULT_OPTIONS: Required<LiveTranscriptionOptions> = {
  language: "en-US",
  interimResults: true,
  continuous: false,
  contextualStrings: [],
};

export class LiveTranscriptionManager {
  private state: LiveTranscriptionState = {
    isSupported: false,
    isStarting: false,
    isRecording: false,
    transcript: "",
    error: "",
  };
  private readonly stateListeners = new Set<() => void>();
  private readonly transcriptListeners = new Set<(event: LiveTranscriptEvent) => void>();
  private readonly nativeSubscriptions: EventSubscription[] = [];
  private startGeneration = 0;

  constructor(private readonly module: LiveSpeechRecognitionModule = ExpoSpeechRecognitionModule) {
    this.state = { ...this.state, isSupported: this.readSupport() };
    this.nativeSubscriptions.push(
      this.module.addListener("start", () => {
        this.update({ isStarting: false, isRecording: true, transcript: "", error: "" });
      }),
      this.module.addListener("end", () => {
        this.update({ isStarting: false, isRecording: false });
      }),
      this.module.addListener("result", (event) => {
        const transcript = event.results[0]?.transcript?.trim() ?? "";
        if (!transcript) return;
        this.update({ transcript });
        const update = { transcript, isFinal: event.isFinal };
        this.transcriptListeners.forEach((listener) => listener(update));
      }),
      this.module.addListener("error", (event) => {
        this.update({
          isStarting: false,
          isRecording: false,
          error: liveErrorMessage(event.error),
        });
      }),
    );
  }

  getState(): LiveTranscriptionState {
    return this.state;
  }

  subscribeState(listener: () => void): () => void {
    this.stateListeners.add(listener);
    return () => this.stateListeners.delete(listener);
  }

  subscribeTranscript(listener: (event: LiveTranscriptEvent) => void): () => void {
    this.transcriptListeners.add(listener);
    return () => this.transcriptListeners.delete(listener);
  }

  start(options: LiveTranscriptionOptions = {}): void {
    if (this.state.isStarting || this.state.isRecording) return;
    if (!this.readSupport()) {
      this.update({ isSupported: false, error: "Live speech recognition is not supported on this device." });
      return;
    }

    const generation = ++this.startGeneration;
    this.update({ isSupported: true, isStarting: true, transcript: "", error: "" });
    void this.startAfterPermission(generation, options);
  }

  stop(): void {
    ++this.startGeneration;
    if (!this.state.isStarting && !this.state.isRecording) return;
    const wasRecording = this.state.isRecording;
    this.update({ isStarting: false, isRecording: false });
    if (!wasRecording) return;
    try {
      this.module.stop();
    } catch (cause) {
      this.update({ isRecording: false, error: errorMessage(cause, "Could not stop speech recognition.") });
    }
  }

  destroy(): void {
    this.stop();
    this.nativeSubscriptions.splice(0).forEach((subscription) => subscription.remove());
    this.stateListeners.clear();
    this.transcriptListeners.clear();
  }

  private async startAfterPermission(generation: number, options: LiveTranscriptionOptions): Promise<void> {
    try {
      const permission = await this.module.requestPermissionsAsync();
      if (generation !== this.startGeneration) return;
      if (!permission.granted) {
        this.update({ isStarting: false, error: "Microphone and speech-recognition permission is required." });
        return;
      }

      const resolved = { ...DEFAULT_OPTIONS, ...options };
      this.module.start({
        lang: resolved.language,
        interimResults: resolved.interimResults,
        continuous: resolved.continuous,
        contextualStrings: resolved.contextualStrings,
      });
    } catch (cause) {
      if (generation !== this.startGeneration) return;
      this.update({ isStarting: false, isRecording: false, error: errorMessage(cause, "Could not start speech recognition.") });
    }
  }

  private readSupport(): boolean {
    try {
      return this.module.isRecognitionAvailable();
    } catch {
      return false;
    }
  }

  private update(patch: Partial<LiveTranscriptionState>): void {
    this.state = { ...this.state, ...patch };
    this.stateListeners.forEach((listener) => listener());
  }
}

function liveErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
    case "service-not-allowed":
      return "Microphone and speech-recognition permission is required.";
    case "busy":
      return "Speech recognition is busy. Try again in a moment.";
    case "no-speech":
      return "No speech was detected.";
    case "speech-timeout":
      return "Speech recognition timed out.";
    case "aborted":
      return "";
    default:
      return `Speech recognition error: ${code}`;
  }
}

function errorMessage(cause: unknown, fallback: string): string {
  return cause instanceof Error ? cause.message : fallback;
}

let defaultLiveTranscriptionManager: LiveTranscriptionManager | undefined;

export function getDefaultLiveTranscriptionManager(): LiveTranscriptionManager {
  defaultLiveTranscriptionManager ??= new LiveTranscriptionManager();
  return defaultLiveTranscriptionManager;
}
