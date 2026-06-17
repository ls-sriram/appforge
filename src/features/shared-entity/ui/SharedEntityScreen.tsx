import React from "react";
import { Body, Heading, YStack } from "../../../ui";
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
      <YStack f={1} ai="center" jc="center" p="$4">
        <Body fontSize="$2" color="$textMuted">Loading shared item...</Body>
      </YStack>
    );
  }

  if (vm.state.error || !vm.state.data) {
    return (
      <YStack f={1} ai="center" jc="center" gap="$2" p="$4">
        <Heading>Share unavailable</Heading>
        <Body fontSize="$2" color="$textMuted">{vm.state.error ?? "The link may be expired or revoked."}</Body>
      </YStack>
    );
  }

  const data = vm.state.data;
  const expiresLabel = data.share.share.expiresAt ? dateOwner.format(data.share.share.expiresAt) : "No expiry";

  return (
    <YStack bg="$bg" f={1}>
      <YStack p="$4" gap="$2">
        <Heading>{data.share.entity.title || "Shared Item"}</Heading>
        <Body fontSize="$2" color="$textMuted">{`Type: ${data.share.share.entityType}`}</Body>
        <Body fontSize="$2" color="$textMuted">{`Expires: ${expiresLabel}`}</Body>
        <SharedEntityRenderer data={data} />
      </YStack>
    </YStack>
  );
}
