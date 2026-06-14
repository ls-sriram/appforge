import React from "react";
import { SharedEntityViewData } from "../domain/model";
import { AudioSharedEntityRenderer } from "./AudioSharedEntityRenderer";
import { GenericSharedEntityRenderer } from "./GenericSharedEntityRenderer";

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
