import React from "react";
import { Block, Text } from "../../../ui/primitives"
import { dateOwner } from "../../../core/dates";
import { SharedEntityRenderer } from "../renderers/SharedEntityRenderer";
import { useSharedEntityViewModel } from "../viewmodel/use-shared-entity-viewmodel";

interface Props {
  token?: string;
}

export function SharedEntityScreen({ token }: Props) {
  const vm = useSharedEntityViewModel(token);

  if (vm.state.loading) {
    return (
      <Block frame="center">
        <Text variant="caption">Loading shared item...</Text>
      </Block>
    );
  }

  if (vm.state.error || !vm.state.data) {
    return (
      <Block frame="center">
        <Text variant="h3">Share unavailable</Text>
        <Text variant="caption">{vm.state.error ?? "The link may be expired or revoked."}</Text>
      </Block>
    );
  }

  const data = vm.state.data;
  const expiresLabel = data.share.share.expiresAt ? dateOwner.format(data.share.share.expiresAt) : "No expiry";

  return (
    <Block paint="page">
      <Block pad="md">
        <Block>
          <Text variant="h2">{data.share.entity.title || "Shared Item"}</Text>
          <Text variant="caption">{`Type: ${data.share.share.entityType}`}</Text>
          <Text variant="caption">{`Expires: ${expiresLabel}`}</Text>
          <SharedEntityRenderer data={data} />
        </Block>
      </Block>
    </Block>
  );
}
