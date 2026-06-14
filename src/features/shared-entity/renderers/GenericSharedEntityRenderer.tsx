import React from "react";
import { Text } from "../../../ui/primitives";
import { SharedEntityViewData } from "../domain/model";

interface Props {
  data: SharedEntityViewData;
}

export function GenericSharedEntityRenderer({ data }: Props) {
  return (
    <>
      {data.share.entity.subtitle ? <Text variant="bodySm">{data.share.entity.subtitle}</Text> : null}
      {data.share.entity.content ? <Text variant="body">{data.share.entity.content}</Text> : null}
      {data.share.entity.assetUrl ? <Text variant="caption">{data.share.entity.assetUrl}</Text> : null}
    </>
  );
}
