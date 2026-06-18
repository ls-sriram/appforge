import React from "react";
import {
  Body,
  Button,
  Heading,
  Icon,
  Label,
  Tag,
  View,
  XStack,
  YStack,
} from "../../../../../ui";
import type { UiDocument, UiNode } from "../domain/ui-document.types";

// Selection is indicated via data-viz-selected CSS attribute (injected by
// UiCanvasView) rather than a style prop. This leaves Tamagui's prop pipeline
// completely unaffected — no shorthand expansion leaks onto DOM elements.
function tagTone(tone: UiNode["props"]["tone"]) {
  if (
    tone === "muted" ||
    tone === "secondary" ||
    tone === "accent" ||
    tone === "action" ||
    tone === "success" ||
    tone === "warning" ||
    tone === "danger" ||
    tone === "info"
  ) {
    return tone;
  }
  return "muted";
}

// Returns the non-style interaction props: a data attribute for CSS-based
// selection outline and a click handler. key is NOT included — pass it
// directly as key={node.id} on each JSX element.
function interactionProps(
  node: UiNode,
  selectedNodeId: string | undefined,
  onSelect: ((id: string) => void) | undefined,
) {
  return {
    // @ts-ignore — web-only data attribute, passed through to DOM by Tamagui
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

  // Layout props — safe on all node types including containers.
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

  // Text props — only applied to text components; ta/tt leak to DOM on containers.
  const textProps = {
    ...layoutProps,
    fontFamily: node.props.fontFamily,
    fontSize: node.props.fontSize,
    ta: node.props.ta as never,
    tt: node.props.tt as never,
    letterSpacing: node.props.letterSpacing,
  };

  if (node.type === "YStack") {
    return <YStack key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</YStack>;
  }
  if (node.type === "XStack") {
    return <XStack key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</XStack>;
  }
  if (node.type === "View") {
    return <View key={node.id} {...layoutProps}>{renderChildren(document, node, selectedNodeId, onSelect)}</View>;
  }
  if (node.type === "Heading") {
    return <Heading key={node.id} {...textProps}>{node.props.text ?? "Heading"}</Heading>;
  }
  if (node.type === "Body") {
    return <Body key={node.id} {...textProps}>{node.props.text ?? "Body"}</Body>;
  }
  if (node.type === "Label") {
    return <Label key={node.id} {...textProps}>{node.props.text ?? "Label"}</Label>;
  }
  if (node.type === "Button") {
    // Use YStack instead of our Button (which wraps Pressable) because Pressable
    // doesn't forward onClick reliably on web — events bubble past it. YStack
    // renders to a div and stopPropagation works correctly.
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
    return <Tag key={node.id} {...ip} label={node.props.label ?? "Badge"} tone={tagTone(node.props.tone)} />;
  }
  if (node.type === "Icon") {
    const ICON_TONES = new Set(["muted","secondary","accent","action","success","warning","danger","info","inverse","brand"]);
    const ICON_SIZES = new Set(["2xs","xs","sm","md","lg","xl","2xl","3xl","4xl","5xl"]);
    const iconTone = ICON_TONES.has(node.props.tone ?? "") ? node.props.tone as import("../../../../../ui").IconTone : undefined;
    const iconSize = ICON_SIZES.has(node.props.size ?? "") ? node.props.size as import("../../../../../ui").IconSize : "md";
    return <Icon key={node.id} {...ip} name={node.props.icon ?? "flask"} tone={iconTone} size={iconSize} />;
  }
  return null;
}
