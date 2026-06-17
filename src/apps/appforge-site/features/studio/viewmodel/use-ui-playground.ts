/**
 * ViewModel — owns the UI Playground's composed block tree.
 *
 * Pure local UI-composition state (no fetch, no usecase): the tree only
 * ever holds token values drawn from the closed option lists below, so
 * there is no way to express a node the design system doesn't support.
 */
import React from "react";
import type { FrameVariant, PaintVariant, DirectionVariant, SpaceToken, AlignToken, JustifyToken } from "../../../../../ui/primitives/Block";
import type { TextTone, TextVariant } from "../../../../../ui/primitives/Text";

export const FRAME_OPTIONS: FrameVariant[] = ["fill", "shrink", "center", "expand", "fluid"];
export const PAINT_OPTIONS: PaintVariant[] = [
  "none", "page", "wash", "panel", "panel-muted", "panel-strong", "panel-subtle", "panel-inverse", "selected", "neutral", "danger",
];
export const DIRECTION_OPTIONS: DirectionVariant[] = ["vertical", "horizontal"];
export const SPACE_OPTIONS: SpaceToken[] = ["none", "xxs", "xs", "sm", "md", "lg", "xl", "2xl", "3xl"];
export const ALIGN_OPTIONS: AlignToken[] = ["stretch", "center", "start", "end"];
export const JUSTIFY_OPTIONS: JustifyToken[] = ["start", "center", "end", "space-between", "space-around"];
export const TEXT_VARIANT_OPTIONS: TextVariant[] = ["h3", "body", "bodySm", "caption", "mono"];
export const TONE_OPTIONS: TextTone[] = ["primary", "secondary", "muted", "accent", "success", "danger"];

export type PlaygroundLeafKind = "text" | "button" | "tag";
export type PlaygroundNodeKind = "block" | PlaygroundLeafKind;

export interface BlockTokenProps {
  frame?: FrameVariant;
  paint?: PaintVariant;
  direction?: DirectionVariant;
  space?: SpaceToken;
  align?: AlignToken;
  justify?: JustifyToken;
  pad?: SpaceToken;
  padH?: SpaceToken;
  padV?: SpaceToken;
  wrap?: boolean;
}

export type LeafFrame = "fluid" | "shrink";
export const LEAF_FRAME_OPTIONS: LeafFrame[] = ["fluid", "shrink"];

export interface PlaygroundNode {
  id: string;
  kind: PlaygroundNodeKind;
  label: string;
  blockProps: BlockTokenProps;
  textVariant: TextVariant;
  tone: TextTone;
  leafFrame?: LeafFrame;
  children: PlaygroundNode[];
}

let nextId = 1;
function makeId() {
  return `node-${nextId++}`;
}

function makeNode(kind: PlaygroundNodeKind): PlaygroundNode {
  return {
    id: makeId(),
    kind,
    label: kind === "text" ? "New text" : kind === "button" ? "Click me" : kind === "tag" ? "Tag" : "",
    blockProps: kind === "block" ? { direction: "vertical", space: "sm", pad: "md", paint: "panel" } : {},
    textVariant: "body",
    tone: "secondary",
    children: [],
  };
}

function makeRoot(): PlaygroundNode {
  return {
    id: makeId(),
    kind: "block",
    label: "",
    blockProps: { direction: "vertical", space: "md", pad: "lg", paint: "panel" },
    textVariant: "body",
    tone: "secondary",
    children: [],
  };
}

function mapTree(node: PlaygroundNode, id: string, fn: (n: PlaygroundNode) => PlaygroundNode): PlaygroundNode {
  if (node.id === id) return fn(node);
  return { ...node, children: node.children.map((c) => mapTree(c, id, fn)) };
}

function removeFromTree(node: PlaygroundNode, id: string): PlaygroundNode {
  return { ...node, children: node.children.filter((c) => c.id !== id).map((c) => removeFromTree(c, id)) };
}

function findNode(node: PlaygroundNode, id: string): PlaygroundNode | undefined {
  if (node.id === id) return node;
  for (const c of node.children) {
    const found = findNode(c, id);
    if (found) return found;
  }
  return undefined;
}

export interface UiPlaygroundState {
  root: PlaygroundNode;
  selectedId: string;
  selected: PlaygroundNode | undefined;
  selectNode: (id: string) => void;
  addChild: (parentId: string, kind: PlaygroundNodeKind) => void;
  removeNode: (id: string) => void;
  setBlockProp: <K extends keyof BlockTokenProps>(id: string, key: K, value: BlockTokenProps[K]) => void;
  setTextVariant: (id: string, variant: TextVariant) => void;
  setTone: (id: string, tone: TextTone) => void;
  setLabel: (id: string, label: string) => void;
  setLeafFrame: (id: string, frame: LeafFrame | undefined) => void;
  reset: () => void;
}

export function useUiPlayground(): UiPlaygroundState {
  const [root, setRoot] = React.useState<PlaygroundNode>(() => makeRoot());
  const [selectedId, setSelectedId] = React.useState<string>(root.id);

  const selected = React.useMemo(() => findNode(root, selectedId), [root, selectedId]);

  const addChild = React.useCallback((parentId: string, kind: PlaygroundNodeKind) => {
    const child = makeNode(kind);
    setRoot((r) => mapTree(r, parentId, (n) => ({ ...n, children: [...n.children, child] })));
    setSelectedId(child.id);
  }, []);

  const removeNode = React.useCallback((id: string) => {
    setRoot((r) => removeFromTree(r, id));
    setSelectedId((cur) => (cur === id ? root.id : cur));
  }, [root.id]);

  const setBlockProp = React.useCallback(<K extends keyof BlockTokenProps>(id: string, key: K, value: BlockTokenProps[K]) => {
    setRoot((r) => mapTree(r, id, (n) => ({ ...n, blockProps: { ...n.blockProps, [key]: value } })));
  }, []);

  const setTextVariant = React.useCallback((id: string, variant: TextVariant) => {
    setRoot((r) => mapTree(r, id, (n) => ({ ...n, textVariant: variant })));
  }, []);

  const setTone = React.useCallback((id: string, tone: TextTone) => {
    setRoot((r) => mapTree(r, id, (n) => ({ ...n, tone })));
  }, []);

  const setLabel = React.useCallback((id: string, label: string) => {
    setRoot((r) => mapTree(r, id, (n) => ({ ...n, label })));
  }, []);

  const setLeafFrame = React.useCallback((id: string, leafFrame: LeafFrame | undefined) => {
    setRoot((r) => mapTree(r, id, (n) => ({ ...n, leafFrame })));
  }, []);

  const reset = React.useCallback(() => {
    const fresh = makeRoot();
    setRoot(fresh);
    setSelectedId(fresh.id);
  }, []);

  return { root, selectedId, selected, selectNode: setSelectedId, addChild, removeNode, setBlockProp, setTextVariant, setTone, setLabel, setLeafFrame, reset };
}
