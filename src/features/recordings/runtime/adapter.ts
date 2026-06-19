import { Result } from "@core/types";

export interface RuntimeRecordingResult {
  audioBase64: string;
  contentType: string;
  durationSeconds?: number;
}

export interface RecordingRuntimeAdapter {
  prepare?(): Promise<Result<void>>;
  start(): Promise<Result<void>>;
  stop(): Promise<Result<RuntimeRecordingResult>>;
  reset?(): Promise<void> | void;
  shutdown?(): Promise<void> | void;
}
