import React from "react";
import { Body } from "../../../platform/ui/index";
import { SharedEntityViewData } from "../domain/model";

interface Props {
  data: SharedEntityViewData;
}

export function GenericSharedEntityRenderer({ data }: Props) {
  return (
    <>
      {data.share.entity.subtitle ? <Body fontSize="$2">{data.share.entity.subtitle}</Body> : null}
      {data.share.entity.content ? <Body>{data.share.entity.content}</Body> : null}
      {data.share.entity.assetUrl ? <Body fontSize="$2" color="$textMuted">{data.share.entity.assetUrl}</Body> : null}
    </>
  );
}
