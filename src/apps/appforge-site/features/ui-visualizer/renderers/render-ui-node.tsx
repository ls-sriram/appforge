import React from "react";
import { Pressable, View as RNView } from "react-native";
import {
  Avatar,
  Badge,
  Body,
  Button,
  Display,
  Heading,
  Icon,
  Input,
  Label,
  ProgressBar,
  SelectableChip,
  Tag,
  TextArea,
  View,
  XStack,
  YStack,
} from "../../../../../ui";
import type { UiDocument, UiNode } from "../domain/ui-document.types";

function tagTone(tone: UiNode["props"]["tone"]) {
  const allowed = new Set(["muted", "secondary", "accent", "action", "success", "warning", "danger", "info"]);
  return allowed.has(tone ?? "") ? tone as any : "muted";
}

function badgeTone(tone: UiNode["props"]["tone"]) {
  const allowed = new Set(["success", "warning", "danger", "info", "muted"]);
  return allowed.has(tone ?? "") ? tone as any : "muted";
}

function progressTone(tone: UiNode["props"]["tone"]) {
  const allowed = new Set(["primary", "success", "warning", "danger"]);
  return allowed.has(tone ?? "") ? tone as any : "primary";
}

function interactionProps(
  node: UiNode,
  selectedNodeId: string | undefined,
  onSelect: ((id: string) => void) | undefined,
) {
  return {
    // @ts-ignore — web-only data attribute
    "data-viz-selected": selectedNodeId === node.id ? "true" : undefined,
    "data-viz-node": "true",
    // @ts-ignore — web-only
    onClick: onSelect
      ? (e: React.MouseEvent) => { e.stopPropagation(); onSelect(node.id); }
      : undefined,
  };
}

function renderChildren(
  document: UiDocument,
  node: UiNode,
  selectedNodeId?: string,
  onSelect?: (nodeId: string) => void,
): React.ReactNode {
  return node.children.map((childId) =>
    renderUiNode(document, childId, selectedNodeId, onSelect),
  );
}

export function renderUiNode(
  document: UiDocument,
  nodeId: string,
  selectedNodeId?: string,
  onSelect?: (nodeId: string) => void,
) {
  const node = document.nodes[nodeId];
  if (!node) return <View key={nodeId} />;

  const ip = interactionProps(node, selectedNodeId, onSelect);

  const layoutProps = {
    ...ip,
    bg: node.props.bg,
    color: node.props.color,
    borderColor: node.props.borderColor,
    borderWidth: node.props.borderWidth,
    br: node.props.br,
    p: node.props.p,
    px: node.props.px,
    py: node.props.py,
    pt: node.props.pt,
    pb: node.props.pb,
    pl: node.props.pl,
    pr: node.props.pr,
    gap: node.props.gap,
    ai: node.props.ai as never,
    jc: node.props.jc as never,
    f: node.props.f,
    flexWrap: node.props.flexWrap as never,
    flexShrink: node.props.flexShrink,
    w: node.props.w as never,
    h: node.props.h as never,
    maxWidth: node.props.maxWidth as never,
    minWidth: node.props.minWidth as never,
    maxHeight: node.props.maxHeight as never,
    minHeight: node.props.minHeight as never,
    opacity: node.props.opacity,
  };

  const textProps = {
    ...layoutProps,
    fontFamily: node.props.fontFamily,
    fontSize: node.props.fontSize,
    ta: node.props.ta as never,
    tt: node.props.tt as never,
    letterSpacing: node.props.letterSpacing,
  };

  // ── Containers ────────────────────────────────────────────────────────────────

  if (node.type === "YStack") {
    return <YStack key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</YStack>;
  }
  if (node.type === "XStack") {
    return <XStack key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</XStack>;
  }
  if (node.type === "View") {
    return <View key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</View>;
  }

  // ── Typography ────────────────────────────────────────────────────────────────

  if (node.type === "Display") {
    return <Display key={node.id} {...textProps}>{node.props.text ?? "Display"}</Display>;
  }
  if (node.type === "Heading") {
    return <Heading key={node.id} {...textProps} tone={node.props.tone as any} size={node.props.size as any} weight={node.props.weight as any}>{node.props.text ?? "Heading"}</Heading>;
  }
  if (node.type === "Body") {
    return <Body key={node.id} {...textProps} tone={node.props.tone as any} size={node.props.size as any} weight={node.props.weight as any}>{node.props.text ?? "Body"}</Body>;
  }
  if (node.type === "Label") {
    return <Label key={node.id} {...textProps} tone={node.props.tone as any}>{node.props.text ?? "Label"}</Label>;
  }

  // ── Interactive (rendered inert in canvas) ────────────────────────────────────

  if (node.type === "Button") {
    // Use YStack instead of Button (Pressable) — onClick bubbles correctly on web
    return (
      <YStack
        key={node.id}
        {...ip}
        bg={node.props.bg ?? "$primary"}
        br={9999}
        ai="center"
        jc="center"
        py="$4"
        px="$5"
        minHeight={54}
        opacity={node.props.opacity}
      >
        <Body weight="bold" tone="inverse" size="md">{node.props.text ?? "Button"}</Body>
      </YStack>
    );
  }

  if (node.type === "Tag") {
    return <Tag key={node.id} {...ip} label={node.props.label ?? node.props.text ?? "Tag"} tone={tagTone(node.props.tone)} />;
  }

  if (node.type === "Icon") {
    const ICON_TONES = new Set(["muted","secondary","accent","action","success","warning","danger","info","inverse","brand"]);
    const ICON_SIZES = new Set(["2xs","xs","sm","md","lg","xl","2xl","3xl","4xl","5xl"]);
    const iconTone = ICON_TONES.has(node.props.tone ?? "") ? node.props.tone as any : undefined;
    const iconSize = ICON_SIZES.has(node.props.size ?? "") ? node.props.size as any : "md";
    return <Icon key={node.id} {...ip} name={node.props.icon ?? "flask"} tone={iconTone} size={iconSize} />;
  }

  // ── New primitives ────────────────────────────────────────────────────────────

  if (node.type === "Avatar") {
    return <Avatar key={node.id} {...(ip as any)} initials={node.props.initials ?? "?"} />;
  }

  if (node.type === "Badge") {
    return <Badge key={node.id} {...(ip as any)} label={node.props.text ?? node.props.label ?? "Badge"} tone={badgeTone(node.props.tone)} />;
  }

  if (node.type === "Input") {
    return (
      <RNView key={node.id} {...(ip as any)} pointerEvents="none">
        <Input placeholder={node.props.placeholder ?? "Enter text…"} editable={false} />
      </RNView>
    );
  }

  if (node.type === "TextArea") {
    return (
      <RNView key={node.id} {...(ip as any)} pointerEvents="none">
        <TextArea placeholder={node.props.placeholder ?? "Enter text…"} editable={false} />
      </RNView>
    );
  }

  if (node.type === "SelectableChip") {
    return (
      <RNView key={node.id} {...(ip as any)} pointerEvents="none">
        <SelectableChip
          label={node.props.text ?? node.props.label ?? "Option"}
          selected={node.props.selected ?? false}
          onPress={() => {}}
          size={node.props.size === "sm" ? "sm" : "md"}
        />
      </RNView>
    );
  }

  if (node.type === "ProgressBar") {
    return (
      <View key={node.id} {...(ip as any)} w="100%">
        <ProgressBar value={node.props.value ?? 60} tone={progressTone(node.props.tone)} />
      </View>
    );
  }

  return null;
}
