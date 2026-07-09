/**
 * Visualizer-only wrappers around UI primitives.
 *
 * Selection is indicated via data-viz-selected CSS attribute (injected by
 * UiCanvasView) rather than a style prop. This leaves Tamagui's prop pipeline
 * completely unaffected — no shorthand expansion leaks to DOM elements, and
 * we don't need to maintain a shorthand-to-CSS translation table.
 *
 * __uiid is stamped once per JSX call site at compile time, so a component
 * rendered more than once (e.g. a Block used 3x on a screen) has every
 * runtime instance sharing the same __uiid. Two different ids come out of
 * that:
 *   - rawId: the explicit __uiid prop as authored — stays the key for prop
 *     overrides, since a Design-tab edit changes the source call site and
 *     should apply to every instance rendered from it.
 *   - instanceId: rawId plus a React useId() suffix, unique per mounted
 *     instance — used for the node-snapshot registry, data-uiid, selection,
 *     and highlighting, so the Layers panel and canvas can tell instances
 *     apart.
 *
 * Each wrapper:
 *   1. Reads an explicit __uiid (rawId) from props when provided.
 *   2. Reads an explicit __uilabel from props when provided.
 *   3. Looks up propOverrides[rawId] from VisualizerContext.
 *   4. Merges overrides into the component's props (inspector → live update).
 *   5. Passes data-viz-selected and onClick, keyed by instanceId — CSS
 *      handles the outline.
 */
import React from "react";
import { useVisualizerContext } from "../visualizer-context";
import { clearNodeSnapshot, setNodeSnapshot } from "./node-snapshots";
import {
  Body as RealBody,
  Heading as RealHeading,
  Label as RealLabel,
  Display as RealDisplay,
  Button as RealButton,
  YStack as RealYStack,
  XStack as RealXStack,
  Tag as RealTag,
  Icon as RealIcon,
  Avatar as RealAvatar,
  Badge as RealBadge,
  Input as RealInput,
  ProgressBar as RealProgressBar,
  SelectableChip as RealSelectableChip,
  SizingToolbar as RealSizingToolbar,
  TabbedPanel as RealTabbedPanel,
  DockPanel as RealDockPanel,
  DockSplitter as RealDockSplitter,
  Tabs as RealTabs,
  TextArea as RealTextArea,
  BodySchema,
  HeadingSchema,
  LabelSchema,
  DisplaySchema,
  ButtonSchema,
  YStackSchema,
  XStackSchema,
  TagSchema,
  IconSchema,
  AvatarSchema,
  BadgeSchema,
  InputSchema,
  ProgressBarSchema,
  SelectableChipSchema,
  SizingToolbarSchema,
  TabbedPanelSchema,
  DockPanelSchema,
  DockSplitterSchema,
  TabsSchema,
  TextAreaSchema,
} from "../index";

// Curated (YStack/XStack/Body/Heading/Label/Display) or full (everything
// else) schema for each wrapped export — re-exported under the same name
// the wrapper itself uses, so a schema always sits beside its component in
// this module's export table.
export {
  BodySchema,
  HeadingSchema,
  LabelSchema,
  DisplaySchema,
  ButtonSchema,
  YStackSchema,
  XStackSchema,
  TagSchema,
  IconSchema,
  AvatarSchema,
  BadgeSchema,
  InputSchema,
  ProgressBarSchema,
  SelectableChipSchema,
  SizingToolbarSchema,
  TabbedPanelSchema,
  DockPanelSchema,
  DockSplitterSchema,
  TabsSchema,
  TextAreaSchema,
};

type AnyProps = Record<string, unknown>;

const SNAPSHOT_KEYS = [
  "bg", "color", "borderColor", "borderWidth", "br",
  "p", "px", "py", "pt", "pb", "pl", "pr",
  "m", "mt", "mb", "ml", "mr",
  "gap", "ai", "jc", "f", "flexWrap", "flexShrink",
  "w", "h", "maxWidth", "minWidth", "maxHeight", "minHeight",
  "fontFamily", "fontSize", "ta", "tt", "letterSpacing", "opacity",
  "tone", "size", "weight", "variant", "placeholder", "selected",
  "initials", "value", "total", "icon", "label", "disabled", "options",
] as const;

function snapshotProps(
  type: string,
  props: AnyProps,
  textProp?: "children" | "label",
): Record<string, unknown> {
  const next: Record<string, unknown> = {};

  for (const key of SNAPSHOT_KEYS) {
    if (props[key] !== undefined) next[key] = props[key];
  }

  if (type === "Icon" && props.name !== undefined) {
    next.icon = props.name;
  }

  if (textProp === "label" && typeof props.label === "string") {
    next.text = props.label;
  }

  if (textProp === "children" && typeof props.children === "string") {
    next.text = props.children;
  }

  return next;
}

// Applies a `text` override from the inspector to the correct prop the real
// component uses for content: `children` for text primitives, `label` for
// Button. Without this, typing in the inspector's text field would store the
// value in the `text` key but the component would keep rendering its original
// `children` / `label` value.
function applyTextOverride(overrides: AnyProps, textProp: "children" | "label" | undefined): AnyProps {
  if (!textProp || !("text" in overrides)) return overrides;
  const { text, ...rest } = overrides;
  return text !== undefined ? { ...rest, [textProp]: text } : rest;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeWrapped<P extends AnyProps>(
  RealComp: React.ComponentType<any>,
  displayName: string,
  textProp?: "children" | "label",
) {
  function VisualizerWrapped({
    __uiid: explicitId,
    __uilabel: explicitLabel,
    ...rest
  }: P & { __uiid?: string; __uilabel?: string }) {
    const ctx = useVisualizerContext();
    const reactId = React.useId();

    if (!ctx.active || !explicitId) {
      return <RealComp {...(rest as P)} />;
    }

    const rawId = explicitId;
    const instanceId = `${rawId}::${reactId}`;
    const rawOverrides = ctx.propOverrides[rawId] ?? {};
    const overrides = applyTextOverride(rawOverrides, textProp);
    const merged = { ...rest, ...overrides } as P;

    React.useLayoutEffect(() => {
      setNodeSnapshot(instanceId, {
        type: displayName,
        label: explicitLabel ?? displayName,
        props: snapshotProps(displayName, merged, textProp),
      });
      return () => clearNodeSnapshot(instanceId);
    }, [instanceId, explicitLabel, merged]);

    const vizProps: AnyProps = {
      "data-viz-type": displayName,
      "data-viz-label": explicitLabel,
      "data-viz-selected": instanceId === ctx.selectedNodeId ? "true" : undefined,
      "data-uiid": instanceId,
      onClick: (e: React.MouseEvent) => { e.stopPropagation(); ctx.onSelect(instanceId); },
    };

    return <RealComp {...merged} {...(vizProps as Partial<P>)} />;
  }

  VisualizerWrapped.displayName = `Viz(${displayName})`;
  return VisualizerWrapped;
}

// For components whose root element doesn't forward data-* props (e.g. Button's
// styled(Pressable), which strips unknown attrs). Wraps in a display:contents div
// so data-uiid and click handling land on the DOM without affecting layout.
// Safe to use here: this barrel is only active for the web-only appforge-site build.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeWrappedInBox<P extends AnyProps>(
  RealComp: React.ComponentType<any>,
  displayName: string,
  textProp?: "children" | "label",
) {
  function VisualizerWrapped({
    __uiid: explicitId,
    __uilabel: explicitLabel,
    ...rest
  }: P & { __uiid?: string; __uilabel?: string }) {
    const ctx = useVisualizerContext();
    const reactId = React.useId();

    if (!ctx.active || !explicitId) {
      return <RealComp {...(rest as P)} />;
    }

    const rawId = explicitId;
    const instanceId = `${rawId}::${reactId}`;
    const rawOverrides = ctx.propOverrides[rawId] ?? {};
    const overrides = applyTextOverride(rawOverrides, textProp);
    const merged = { ...rest, ...overrides } as P;
    const isSelected = instanceId === ctx.selectedNodeId;

    React.useLayoutEffect(() => {
      setNodeSnapshot(instanceId, {
        type: displayName,
        label: explicitLabel ?? displayName,
        props: snapshotProps(displayName, merged, textProp),
      });
      return () => clearNodeSnapshot(instanceId);
    }, [instanceId, explicitLabel, merged]);

    return (
      // @ts-ignore — div is web-only; this barrel only runs on web
      <div
        data-uiid={instanceId}
        data-viz-type={displayName}
        data-viz-label={explicitLabel}
        data-viz-selected={isSelected ? "true" : undefined}
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); ctx.onSelect(instanceId); }}
        style={{ display: "contents" }}
      >
        <RealComp {...(merged as P)} />
      </div>
    );
  }

  VisualizerWrapped.displayName = `Viz(${displayName})`;
  return VisualizerWrapped;
}

export const Body    = makeWrapped(RealBody,    "Body",    "children");
export const Heading = makeWrapped(RealHeading, "Heading", "children");
export const Label   = makeWrapped(RealLabel,   "Label",   "children");
export const Display = makeWrapped(RealDisplay, "Display", "children");
export const Button  = makeWrappedInBox(RealButton, "Button", "label");
// display:contents div guarantees data-uiid is on a raw DOM element rather than
// relying on Tamagui to forward data-* props through its styled pipeline.
export const YStack  = makeWrappedInBox(RealYStack,  "YStack");
export const XStack  = makeWrappedInBox(RealXStack,  "XStack");
export const Tag     = makeWrapped(RealTag,     "Tag");
export const Icon    = makeWrappedInBox(RealIcon, "Icon");
export const Avatar  = makeWrappedInBox(RealAvatar, "Avatar");
export const Badge   = makeWrappedInBox(RealBadge, "Badge", "label");
export const Input   = makeWrappedInBox(RealInput, "Input");
export const ProgressBar = makeWrappedInBox(RealProgressBar, "ProgressBar");
export const SelectableChip = makeWrappedInBox(
  RealSelectableChip,
  "SelectableChip",
  "label",
);
export const SizingToolbar = makeWrappedInBox(RealSizingToolbar, "SizingToolbar");
export const TabbedPanel = makeWrappedInBox(RealTabbedPanel, "TabbedPanel");
export const DockPanel = makeWrappedInBox(RealDockPanel, "DockPanel");
export const DockSplitter = makeWrappedInBox(RealDockSplitter, "DockSplitter");
export const Tabs = makeWrappedInBox(RealTabs, "Tabs");
export const TextArea = makeWrappedInBox(RealTextArea, "TextArea");
