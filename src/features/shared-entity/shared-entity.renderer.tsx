import React from "react";
import { SharedEntityViewData } from "./shared-entity.model";
import { AudioSharedEntityRenderer } from "./audio-shared-entity.renderer";
import { GenericSharedEntityRenderer } from "./generic-shared-entity.renderer";

interface Props {
  data: SharedEntityViewData;
}

export function SharedEntityRenderer({ data }: Props) {
  switch (data.kind) {
    case "audio":
      return <AudioSharedEntityRenderer data={data} />;
    case "text":
    case "checklist":
    case "video":
    case "image":
    case "generic":
    default:
      return <GenericSharedEntityRenderer data={data} />;
  }
}
