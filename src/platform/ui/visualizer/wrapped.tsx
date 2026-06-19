/**
 * Visualizer-only wrappers around UI primitives.
 *
 * Selection is indicated via data-viz-selected CSS attribute (injected by
 * UiCanvasView) rather than a style prop. This leaves Tamagui's prop pipeline
 * completely unaffected — no shorthand expansion leaks to DOM elements, and
 * we don't need to maintain a shorthand-to-CSS translation table.
 *
 * Each wrapper:
 *   1. Reads __uiid from props (stamped by ui() in layout files).
 *   2. Looks up propOverrides[__uiid] from VisualizerContext.
 *   3. Merges overrides into the component's props (inspector → live update).
 *   4. Passes data-viz-selected and onClick — CSS handles the outline.
 */
import React from "react";
import { useVisualizerContext } from "../visualizer-context";
import {
  Body as RealBody,
  Heading as RealHeading,
  Label as RealLabel,
  Display as RealDisplay,
  Button as RealButton,
  View as RealView,
  YStack as RealYStack,
  XStack as RealXStack,
  Tag as RealTag,
  Icon as RealIcon,
  Avatar as RealAvatar,
  Badge as RealBadge,
  Input as RealInput,
  ProgressBar as RealProgressBar,
  SelectableChip as RealSelectableChip,
  TextArea as RealTextArea,
} from "../index";

type AnyProps = Record<string, unknown>;

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
  function VisualizerWrapped({ __uiid, ...rest }: P & { __uiid?: string }) {
    const ctx = useVisualizerContext();

    if (!ctx.active) {
      return <RealComp {...(rest as P)} />;
    }

    const rawOverrides = __uiid ? (ctx.propOverrides[__uiid] ?? {}) : {};
    const overrides = applyTextOverride(rawOverrides, textProp);
    const merged = { ...rest, ...overrides } as P;

    // data-viz-selected drives the CSS outline injected by UiCanvasView.
    // data-uiid is kept on the DOM for useLiveNodeSelection fallback.
    // Spread as an object because hyphenated JSX attributes can't be inlined.
    const vizProps: AnyProps = {
      "data-viz-selected": (__uiid !== undefined && __uiid === ctx.selectedNodeId) ? "true" : undefined,
      "data-uiid": __uiid,
      ...(__uiid ? { onClick: (e: React.MouseEvent) => { e.stopPropagation(); ctx.onSelect(__uiid); } } : {}),
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
  function VisualizerWrapped({ __uiid, ...rest }: P & { __uiid?: string }) {
    const ctx = useVisualizerContext();

    if (!ctx.active) {
      return <RealComp {...(rest as P)} />;
    }

    const rawOverrides = __uiid ? (ctx.propOverrides[__uiid] ?? {}) : {};
    const overrides = applyTextOverride(rawOverrides, textProp);
    const merged = { ...rest, ...overrides } as P;
    const isSelected = __uiid !== undefined && __uiid === ctx.selectedNodeId;
    const handleClick = __uiid
      ? (e: React.MouseEvent) => { e.stopPropagation(); ctx.onSelect(__uiid); }
      : undefined;

    return (
      // @ts-ignore — div is web-only; this barrel only runs on web
      <div
        data-uiid={__uiid}
        data-viz-selected={isSelected ? "true" : undefined}
        onClick={handleClick}
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
export const View    = makeWrapped(RealView,    "View");
export const YStack  = makeWrapped(RealYStack,  "YStack");
export const XStack  = makeWrapped(RealXStack,  "XStack");
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
export const TextArea = makeWrappedInBox(RealTextArea, "TextArea");
