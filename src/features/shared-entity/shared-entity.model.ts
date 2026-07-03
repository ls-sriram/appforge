import { PublicShareModel } from "../sharing/index";

export type SharedEntityKind = "audio" | "text" | "checklist" | "video" | "image" | "generic";

export interface SharedEntityCapabilities {
  canStreamContent: boolean;
  canRenderText: boolean;
  canRenderAsset: boolean;
}

export interface SharedEntityViewData {
  entityType: string;
  kind: SharedEntityKind;
  capabilities: SharedEntityCapabilities;
  share: PublicShareModel;
  contentUrl?: string;
}
