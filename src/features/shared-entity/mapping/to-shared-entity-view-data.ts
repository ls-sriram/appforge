import { PublicShareModel } from "../../sharing";
import { SharedEntityViewData } from "../domain/model";

export function toSharedEntityViewData(
  share: PublicShareModel,
  contentUrl: string,
): SharedEntityViewData {
  const entityType = share.share.entityType;
  const normalizedType = entityType.trim().toLowerCase();
  let kind: SharedEntityViewData["kind"];
  let capabilities: SharedEntityViewData["capabilities"];

  switch (normalizedType) {
    case "recording":
      kind = "audio";
      capabilities = {
        canStreamContent: true,
        canRenderText: false,
        canRenderAsset: false,
      };
      break;
    case "checklist":
      kind = "checklist";
      capabilities = {
        canStreamContent: false,
        canRenderText: true,
        canRenderAsset: false,
      };
      break;
    case "note":
    case "document":
      kind = "text";
      capabilities = {
        canStreamContent: false,
        canRenderText: true,
        canRenderAsset: false,
      };
      break;
    case "video":
      kind = "video";
      capabilities = {
        canStreamContent: true,
        canRenderText: false,
        canRenderAsset: true,
      };
      break;
    case "image":
      kind = "image";
      capabilities = {
        canStreamContent: false,
        canRenderText: false,
        canRenderAsset: true,
      };
      break;
    default:
      kind = "generic";
      capabilities = {
        canStreamContent: false,
        canRenderText: true,
        canRenderAsset: true,
      };
      break;
  }

  return {
    entityType,
    kind,
    capabilities,
    share,
    contentUrl: capabilities.canStreamContent ? contentUrl : undefined,
  };
}
