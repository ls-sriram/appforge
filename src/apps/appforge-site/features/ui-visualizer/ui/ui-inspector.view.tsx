import React from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
import { Body, View, XStack, YStack } from "@ui";
import {
  ALIGN_OPTIONS,
  BG_COLOR_OPTIONS,
  BORDER_COLOR_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  FONT_FAMILY_OPTIONS,
  ICON_NAME_OPTIONS,
  ICON_SIZE_OPTIONS,
  JUSTIFY_OPTIONS,
  OPACITY_OPTIONS,
  RADIUS_OPTIONS,
  SPACE_OPTIONS,
  TEXT_ALIGN_OPTIONS,
  TEXT_COLOR_OPTIONS,
  TEXT_SIZE_OPTIONS,
  TEXT_WEIGHT_OPTIONS,
  type OptionItem,
} from "../domain/ui-prop-options";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";
import { ColorPickerField, type ColorPreset } from "./ui-color-picker.view";

function toColorPresets(options: OptionItem[]): ColorPreset[] {
  return options
    .filter((o) => o.value !== undefined && o.color)
    .map((o) => ({ label: o.label, value: o.value as string, hex: o.color! }));
}
import type { UiComponentType, UiDocument, UiNode, UiNodeProps } from "../domain/ui-document.types";

// ── Value picker ──────────────────────────────────────────────────────────────

function ValuePicker({
  value,
  options,
  onSelect,
  placeholder,
}: {
  value: string | number | undefined;
  options: OptionItem[];
  onSelect: (v: string | number | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => String(o.value) === String(value ?? ""));
  const displayLabel =
    current?.label ?? (value !== undefined ? String(value) : (placeholder ?? "—"));

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <XStack ai="center" gap={3} jc="flex-end">
          {current?.color && (
            <View w={10} h={10} br="$1" bg={current.color} borderColor="$borderSubtle" borderWidth={1} flexShrink={0} />
          )}
          <Body fontSize="$1" color="$textPrimary" ta="right" numberOfLines={1}>
            {displayLabel}
          </Body>
          <Body fontSize={8} color="$textSecondary">▾</Body>
        </XStack>
      </Pressable>
      {open && (
        <View
          style={{ position: "absolute", top: 22, right: 0, zIndex: 200, minWidth: 140 }}
          bg="$surfaceStrong" borderColor="$border" borderWidth={1} overflow="hidden"
        >
          <ScrollView style={{ maxHeight: 200 }}>
            {options.map((opt) => {
              const selected = String(opt.value ?? "") === String(value ?? "");
              return (
                <Pressable
                  key={String(opt.value ?? "none")}
                  onPress={() => { onSelect(opt.value); setOpen(false); }}
                >
                  <XStack ai="center" gap="$2" px="$2" py="$2" bg={selected ? "$errorMuted" : "transparent"}>
                    {opt.color && (
                      <View w={10} h={10} br="$1" bg={opt.color} borderColor="$borderSubtle" borderWidth={1} flexShrink={0} />
                    )}
                    <Body fontSize="$1" color={selected ? "$textPrimary" : "$textSecondary"}>
                      {opt.label}
                    </Body>
                  </XStack>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

// ── Inline inputs ─────────────────────────────────────────────────────────────

function InlineTextInput({
  value,
  placeholder,
  onChange,
}: {
  value: string | undefined;
  placeholder?: string;
  onChange: (v: string | undefined) => void;
}) {
  return (
    <View f={1} h={24} px="$2" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} jc="center">
      <TextInput
        value={value ?? ""}
        onChangeText={(t) => onChange(t || undefined)}
        placeholder={placeholder ?? "—"}
        placeholderTextColor={DARK_THEME_RESOLVED.textMuted}
        style={{ color: DARK_THEME_RESOLVED.textPrimary, fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
      />
    </View>
  );
}

function InlineNumberInput({
  value,
  placeholder,
  onChange,
  unit,
}: {
  value: number | undefined;
  placeholder?: string;
  onChange: (v: number | undefined) => void;
  unit?: string;
}) {
  return (
    <XStack f={1} ai="center" jc="flex-end" gap={2}>
      <TextInput
        value={value !== undefined ? String(value) : ""}
        onChangeText={(t) => { const n = parseFloat(t); onChange(isNaN(n) ? undefined : n); }}
        placeholder={placeholder ?? "—"}
        keyboardType="numeric"
        placeholderTextColor={DARK_THEME_RESOLVED.textMuted}
        style={{ color: DARK_THEME_RESOLVED.textPrimary, fontSize: 11, fontFamily: "System", padding: 0, margin: 0, textAlign: "right", minWidth: 24 }}
      />
      {unit && <Body fontSize={10} color="$textMuted">{unit}</Body>}
    </XStack>
  );
}

// ── Row primitives ────────────────────────────────────────────────────────────

function Row({ children, noBorder }: { children: React.ReactNode; noBorder?: boolean }) {
  return (
    <XStack minHeight={32} borderBottomColor={noBorder ? "transparent" : "$borderSubtle"} borderBottomWidth={1}>
      {children}
    </XStack>
  );
}

function Cell({
  label,
  children,
  divider,
  labelWidth = 64,
}: {
  label: string;
  children: React.ReactNode;
  divider?: boolean;
  labelWidth?: number;
}) {
  return (
    <XStack
      f={1} ai="center" px="$3" gap="$2"
      borderRightColor={divider ? "$borderSubtle" : "transparent"}
      borderRightWidth={divider ? 1 : 0}
    >
      <Body fontSize="$1" color="$textSecondary" style={{ width: labelWidth, flexShrink: 0 }}>
        {label}
      </Body>
      <View f={1} ai="flex-end">{children}</View>
    </XStack>
  );
}

function FullRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Row>
      <Cell label={label} labelWidth={80}>{children}</Cell>
    </Row>
  );
}

function DualRow({
  left,
  right,
  noBorder,
}: {
  left: { label: string; control: React.ReactNode };
  right: { label: string; control: React.ReactNode };
  noBorder?: boolean;
}) {
  return (
    <Row noBorder={noBorder}>
      <Cell label={left.label} divider>{left.control}</Cell>
      <Cell label={right.label}>{right.control}</Cell>
    </Row>
  );
}

function ExpandRow({
  label,
  summary,
  children,
}: {
  label: string;
  summary: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <YStack>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <XStack
          minHeight={32} ai="center" px="$3" gap="$2"
          borderBottomColor="$borderSubtle" borderBottomWidth={open ? 0 : 1}
        >
          <Body fontSize="$1" color="$textSecondary" f={1}>{label}</Body>
          <Body fontSize="$1" color="$textPrimary">{summary}</Body>
          <Body fontSize={9} color="$textMuted" ml="$1">{open ? "∧" : "∨"}</Body>
        </XStack>
      </Pressable>
      {open && (
        <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
          {children}
        </YStack>
      )}
    </YStack>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <XStack px="$3" pt="$3" pb="$1" borderTopColor="$borderSubtle" borderTopWidth={1}>
      <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>
        {label}
      </Body>
    </XStack>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function val(node: UiNode, key: keyof UiNodeProps): string | number | undefined {
  return node.props[key] as string | number | undefined;
}

function spaceSummary(
  all: string | number | undefined,
  t: string | number | undefined,
  r: string | number | undefined,
  b: string | number | undefined,
  l: string | number | undefined,
): string {
  if (all !== undefined) return String(all);
  if (t || r || b || l) return "Mixed";
  return "0";
}

// ── Add-child picker ──────────────────────────────────────────────────────────

const ADD_OPTIONS: Array<{ type: UiComponentType; label: string; group: string }> = [
  { type: "YStack",  label: "Stack (col)",  group: "Layout" },
  { type: "XStack",  label: "Stack (row)",  group: "Layout" },
  { type: "Heading", label: "Heading",      group: "Text" },
  { type: "Body",    label: "Body",         group: "Text" },
  { type: "Label",   label: "Label",        group: "Text" },
  { type: "Button",  label: "Button",       group: "Action" },
  { type: "Icon",    label: "Icon",         group: "Primitive" },
  { type: "Badge",   label: "Badge",        group: "Primitive" },
  { type: "Avatar",  label: "Avatar",       group: "Primitive" },
  { type: "Input",   label: "Input",        group: "Primitive" },
];

function AddPicker({
  onAdd,
  onClose,
}: {
  onAdd: (type: UiComponentType) => void;
  onClose: () => void;
}) {
  return (
    <View
      style={{ position: "absolute", top: 36, right: 0, zIndex: 500, width: 192 }}
      bg="$surfaceStrong" borderColor="$border" borderWidth={1} overflow="hidden"
    >
      <ScrollView style={{ maxHeight: 260 }}>
        {ADD_OPTIONS.map((opt) => (
          <Pressable key={opt.type} onPress={() => { onAdd(opt.type); onClose(); }}>
            {({ pressed }: { pressed: boolean }) => (
              <XStack ai="center" gap="$2" px="$3" py="$2" bg={pressed ? "$errorMuted" : "transparent"}>
                <Body fontSize={10} color="$textMuted" style={{ width: 52, flexShrink: 0 }}>{opt.group}</Body>
                <Body fontSize="$1" color="$textPrimary">{opt.label}</Body>
              </XStack>
            )}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

// ── Layer tree ────────────────────────────────────────────────────────────────

// Type → { glyph, category color token }
const NODE_CAT: Record<string, { glyph: string; col: string }> = {
  YStack:         { glyph: "≡", col: "$textSecondary" },
  XStack:         { glyph: "⋯", col: "$textSecondary" },
  View:           { glyph: "□", col: "$textSecondary" },
  Body:           { glyph: "¶", col: "$accent" },
  Heading:        { glyph: "H", col: "$accent" },
  Display:        { glyph: "D", col: "$accent" },
  Label:          { glyph: "L", col: "$accent" },
  Button:         { glyph: "▷", col: "$primary" },
  Input:          { glyph: "▭", col: "$primary" },
  TextArea:       { glyph: "▬", col: "$primary" },
  SelectableChip: { glyph: "◉", col: "$primary" },
  Icon:           { glyph: "✦", col: "$success" },
  Avatar:         { glyph: "⬤", col: "$success" },
  Badge:          { glyph: "●", col: "$success" },
  Tag:            { glyph: "◈", col: "$success" },
  ProgressBar:    { glyph: "━", col: "$success" },
};

function nodeSubtitle(node: UiNode): string | undefined {
  const raw = node.props.text ?? node.props.label ?? node.props.initials ?? node.props.icon ?? node.props.placeholder;
  if (!raw) return undefined;
  const s = String(raw);
  return s.length > 15 ? s.slice(0, 14) + "…" : s;
}

function getAncestorIds(document: UiDocument, targetId: string | undefined): Set<string> {
  const set = new Set<string>();
  if (!targetId) return set;
  let cur = document.nodes[targetId]?.parentId;
  while (cur) {
    set.add(cur);
    cur = document.nodes[cur]?.parentId;
  }
  return set;
}

function LayerNode({
  document,
  nodeId,
  depth,
  selectedNodeId,
  onSelectNode,
  ancestorIds,
}: {
  document: UiDocument;
  nodeId: string;
  depth: number;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  ancestorIds: Set<string>;
}) {
  const node = document.nodes[nodeId];
  if (!node) return null;

  const isSelected = selectedNodeId === nodeId;
  const isAncestor = ancestorIds.has(nodeId);
  const isRoot = nodeId === document.rootId;
  const hasChildren = node.children.length > 0;

  // Collapsed by default; auto-expand when this node is (or becomes) an ancestor of the selected node
  const [expanded, setExpanded] = React.useState(() => isRoot || isAncestor);
  const prevAncestor = React.useRef(isAncestor);
  React.useEffect(() => {
    if (isAncestor && !prevAncestor.current) setExpanded(true);
    prevAncestor.current = isAncestor;
  }, [isAncestor]);

  const cat = NODE_CAT[node.type] ?? { glyph: "□", col: "$textMuted" };
  const subtitle = nodeSubtitle(node);
  const indentPx = depth * 12 + 6;

  return (
    <>
      <Pressable onPress={() => onSelectNode(nodeId)}>
        {({ pressed }: { pressed: boolean }) => (
          <XStack
            ai="center" h={26}
            pl={indentPx as any}
            bg={isSelected ? "$primaryMuted" : pressed ? "$surfaceStrong" : "transparent"}
            borderLeftColor={isSelected ? "$primary" : "transparent"}
            borderLeftWidth={2}
          >
            {/* Expand/collapse — inner Pressable; RN touch responders make it exclusive */}
            {hasChildren ? (
              <Pressable
                onPress={() => setExpanded((v) => !v)}
                // @ts-ignore
                style={{ width: 18, height: 26, alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <Body fontSize={8} color={isAncestor ? "$primary" : "$textMuted"} opacity={isAncestor ? 0.7 : 0.5}>
                  {expanded ? "▾" : "▸"}
                </Body>
              </Pressable>
            ) : (
              <View w={18} />
            )}

            {/* Category glyph */}
            <Body
              fontSize={9}
              color={isSelected ? "$primary" : (cat.col as any)}
              w={14}
              ta="center"
              opacity={isSelected ? 1 : 0.75}
            >
              {cat.glyph}
            </Body>

            {/* Type name */}
            <Body
              fontSize={10}
              color={isSelected ? "$primary" : isAncestor ? "$textPrimary" : "$textSecondary"}
              fontFamily={isSelected ? "$bold" : "$reg"}
              ml="$1"
              f={1}
              numberOfLines={1}
            >
              {node.type}
              {isRoot && <Body fontSize={9} color="$textMuted" opacity={0.4}> root</Body>}
            </Body>

            {/* Content subtitle */}
            {subtitle && (
              <Body fontSize={9} color="$textMuted" numberOfLines={1} pr="$2" style={{ maxWidth: 72, opacity: 0.6 }}>
                {subtitle}
              </Body>
            )}
          </XStack>
        )}
      </Pressable>

      {expanded && hasChildren && node.children.map((childId) => (
        <LayerNode
          key={childId}
          document={document}
          nodeId={childId}
          depth={depth + 1}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          ancestorIds={ancestorIds}
        />
      ))}
    </>
  );
}

// ── Main inspector ────────────────────────────────────────────────────────────

export function UiInspectorView({
  node,
  document,
  selectedNodeId,
  onSelectNode,
  onUpdateProp,
  onRemove,
  onAddChild,
  onSaveBlock,
}: {
  node?: UiNode;
  document: UiDocument;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  onUpdateProp: (key: keyof UiNodeProps, value: string | number | boolean | undefined) => void;
  onRemove: () => void;
  onAddChild?: (type: UiComponentType) => void;
  onSaveBlock?: (name: string) => void;
}) {
  const [showAdd, setShowAdd] = React.useState(false);
  const [savingBlock, setSavingBlock] = React.useState(false);
  const [blockName, setBlockName] = React.useState("");

  const set =
    (key: keyof UiNodeProps) =>
    (v: string | number | boolean | undefined) =>
      onUpdateProp(key, v);

  const isRoot = selectedNodeId === document.rootId;
  const isContainer = node && ["XStack", "YStack"].includes(node.type);

  const contentKey: keyof UiNodeProps | null = (() => {
    if (!node) return null;
    if (["Display", "Heading", "Body", "Label", "Button", "Badge", "SelectableChip"].includes(node.type)) return "text";
    if (node.type === "Tag") return "label";
    if (node.type === "Avatar") return "initials";
    if (node.type === "Input" || node.type === "TextArea") return "placeholder";
    return null;
  })();

  const hasContent = contentKey !== null || node?.type === "Icon" || node?.type === "ProgressBar";

  const padSummary = node
    ? spaceSummary(val(node, "p"), val(node, "pt"), val(node, "pr"), val(node, "pb"), val(node, "pl"))
    : "0";
  const marginSummary = node
    ? spaceSummary(val(node, "m"), val(node, "mt"), val(node, "mr"), val(node, "mb"), val(node, "ml"))
    : "0";
  const borderSummary = node && val(node, "borderWidth") ? `${val(node, "borderWidth")}px` : "0";

  // Ancestors of selected node — used by LayerNode to auto-expand and highlight the path
  const ancestorIds = React.useMemo(
    () => getAncestorIds(document, selectedNodeId),
    [document, selectedNodeId],
  );

  return (
    <YStack f={1} style={{ position: "relative" }}>
      {/* ── Header ── */}
      <XStack px="$3" h={36} ai="center" gap="$2" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
        <Body fontSize="$2" color="$textPrimary" fontFamily="$bold" f={1}>
          {node ? node.type : "Design"}
        </Body>
        {node && !isRoot && onSaveBlock && (
          <Pressable onPress={() => { setSavingBlock((v) => !v); setBlockName(""); }} style={{ padding: 4 }}>
            <Body fontSize="$1" color={savingBlock ? "$primary" : "$textMuted"}>⬡</Body>
          </Pressable>
        )}
        {node && onAddChild && (
          <Pressable onPress={() => setShowAdd((v) => !v)} style={{ padding: 4 }}>
            <Body fontSize="$3" color={showAdd ? "$primary" : "$textSecondary"} fontFamily="$bold">+</Body>
          </Pressable>
        )}
        {node && !isRoot && (
          <Pressable onPress={onRemove} style={{ padding: 4 }}>
            <Body fontSize="$2" color="$textMuted">✕</Body>
          </Pressable>
        )}
      </XStack>

      {/* ── Save-as-block inline input ── */}
      {savingBlock && (
        <XStack px="$3" py="$2" gap="$2" ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
          <View f={1} h={24} px="$2" bg="$surfaceStrong" borderColor="$primary" borderWidth={1} jc="center">
            <TextInput
              value={blockName}
              onChangeText={setBlockName}
              placeholder="Block name…"
              autoFocus
              placeholderTextColor={DARK_THEME_RESOLVED.textMuted}
              style={{ color: DARK_THEME_RESOLVED.textPrimary, fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
              onSubmitEditing={() => {
                if (blockName.trim()) { onSaveBlock?.(blockName.trim()); setSavingBlock(false); setBlockName(""); }
              }}
            />
          </View>
          <Pressable onPress={() => { if (blockName.trim()) { onSaveBlock?.(blockName.trim()); setSavingBlock(false); setBlockName(""); } }}>
            <Body fontSize="$1" color="$primary">Save</Body>
          </Pressable>
          <Pressable onPress={() => { setSavingBlock(false); setBlockName(""); }}>
            <Body fontSize="$1" color="$textMuted">✕</Body>
          </Pressable>
        </XStack>
      )}

      {/* ── Add picker dropdown ── */}
      {showAdd && onAddChild && (
        <AddPicker onAdd={onAddChild} onClose={() => setShowAdd(false)} />
      )}

      <ScrollView style={{ flex: 1 }}>

        {/* ── Layers — always at top, collapsed by default ── */}
        <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
          <XStack px="$3" h={28} ai="center">
            <Body fontSize={9} color="$textSecondary" tt="uppercase" letterSpacing={1.5}>Layers</Body>
          </XStack>
          <LayerNode
            document={document}
            nodeId={document.rootId}
            depth={0}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            ancestorIds={ancestorIds}
          />
          <View h={4} />
        </YStack>

        {/* ── Properties for selected node ── */}
        {node ? (
          <>
            {/* Content */}
            {hasContent && (
              <>
                <SectionLabel label="Content" />
                {contentKey && (
                  <FullRow
                    label={
                      contentKey === "placeholder" ? "Placeholder"
                      : contentKey === "initials"   ? "Initials"
                      : "Text"
                    }
                  >
                    <InlineTextInput
                      value={val(node, contentKey) as string}
                      placeholder={contentKey === "placeholder" ? "Hint…" : "—"}
                      onChange={set(contentKey) as (v: string | undefined) => void}
                    />
                  </FullRow>
                )}
                {node.type === "Icon" && (
                  <DualRow
                    left={{ label: "Icon", control: <ValuePicker value={val(node, "icon")} options={ICON_NAME_OPTIONS} onSelect={set("icon")} /> }}
                    right={{ label: "Size", control: <ValuePicker value={val(node, "size")} options={ICON_SIZE_OPTIONS} onSelect={set("size")} /> }}
                  />
                )}
                {node.type === "ProgressBar" && (
                  <DualRow
                    left={{ label: "Value", control: <InlineNumberInput value={val(node, "value") as number | undefined} placeholder="0" onChange={set("value") as (v: number | undefined) => void} /> }}
                    right={{ label: "Total", control: <InlineNumberInput value={val(node, "total") as number | undefined} placeholder="100" onChange={set("total") as (v: number | undefined) => void} /> }}
                  />
                )}
              </>
            )}

            {/* Typography */}
            <SectionLabel label="Typography" />
            <FullRow label="Font">
              <ValuePicker value={val(node, "fontFamily")} options={FONT_FAMILY_OPTIONS} onSelect={set("fontFamily")} placeholder="—" />
            </FullRow>
            <DualRow
              left={{ label: "Size",   control: <ValuePicker value={val(node, "size")} options={TEXT_SIZE_OPTIONS} onSelect={set("size")} /> }}
              right={{ label: "Weight", control: <ValuePicker value={val(node, "weight")} options={TEXT_WEIGHT_OPTIONS} onSelect={set("weight")} /> }}
            />
            <DualRow
              left={{ label: "Color",  control: <ColorPickerField value={val(node, "color") as string | undefined} onChange={set("color") as (v: string) => void} presets={toColorPresets(TEXT_COLOR_OPTIONS)} compact /> }}
              right={{ label: "Align",  control: <ValuePicker value={val(node, "ta")} options={TEXT_ALIGN_OPTIONS} onSelect={set("ta")} /> }}
            />
            <FullRow label="Tracking">
              <InlineNumberInput
                value={val(node, "letterSpacing") as number | undefined}
                placeholder="0"
                onChange={set("letterSpacing") as (v: number | undefined) => void}
                unit="px"
              />
            </FullRow>

            {/* Size */}
            <SectionLabel label="Size" />
            <DualRow
              left={{ label: "Width",  control: <InlineNumberInput value={val(node, "w") as number | undefined} placeholder="auto" onChange={set("w") as (v: number | undefined) => void} /> }}
              right={{ label: "Height", control: <InlineNumberInput value={val(node, "h") as number | undefined} placeholder="auto" onChange={set("h") as (v: number | undefined) => void} /> }}
            />

            {/* Layout — containers only */}
            {isContainer && (
              <>
                <SectionLabel label="Layout" />
                <DualRow
                  left={{ label: "Gap", control: <ValuePicker value={val(node, "gap")} options={SPACE_OPTIONS} onSelect={set("gap")} placeholder="—" /> }}
                  right={{ label: "Direction", control: <Body fontSize="$1" color="$textPrimary">{node.type === "XStack" ? "row" : "col"}</Body> }}
                />
                <DualRow
                  left={{ label: "Justify", control: <ValuePicker value={val(node, "jc")} options={JUSTIFY_OPTIONS} onSelect={set("jc")} /> }}
                  right={{ label: "Align",   control: <ValuePicker value={val(node, "ai")} options={ALIGN_OPTIONS} onSelect={set("ai")} /> }}
                />
              </>
            )}

            {/* Box */}
            <SectionLabel label="Box" />
            <DualRow
              left={{ label: "Fill",    control: <ColorPickerField value={val(node, "bg") as string | undefined} onChange={set("bg") as (v: string) => void} presets={toColorPresets(BG_COLOR_OPTIONS)} compact /> }}
              right={{ label: "Opacity", control: <ValuePicker value={val(node, "opacity")} options={OPACITY_OPTIONS} onSelect={set("opacity")} placeholder="100%" /> }}
            />
            <ExpandRow label="Padding" summary={padSummary}>
              <DualRow
                left={{ label: "Top",    control: <ValuePicker value={val(node, "pt")} options={SPACE_OPTIONS} onSelect={set("pt")} placeholder="0" /> }}
                right={{ label: "Right", control: <ValuePicker value={val(node, "pr")} options={SPACE_OPTIONS} onSelect={set("pr")} placeholder="0" /> }}
              />
              <DualRow
                noBorder
                left={{ label: "Bottom", control: <ValuePicker value={val(node, "pb")} options={SPACE_OPTIONS} onSelect={set("pb")} placeholder="0" /> }}
                right={{ label: "Left",  control: <ValuePicker value={val(node, "pl")} options={SPACE_OPTIONS} onSelect={set("pl")} placeholder="0" /> }}
              />
            </ExpandRow>
            <ExpandRow label="Margin" summary={marginSummary}>
              <DualRow
                left={{ label: "Top",    control: <ValuePicker value={val(node, "mt")} options={SPACE_OPTIONS} onSelect={set("mt")} placeholder="0" /> }}
                right={{ label: "Right", control: <ValuePicker value={val(node, "mr")} options={SPACE_OPTIONS} onSelect={set("mr")} placeholder="0" /> }}
              />
              <DualRow
                noBorder
                left={{ label: "Bottom", control: <ValuePicker value={val(node, "mb")} options={SPACE_OPTIONS} onSelect={set("mb")} placeholder="0" /> }}
                right={{ label: "Left",  control: <ValuePicker value={val(node, "ml")} options={SPACE_OPTIONS} onSelect={set("ml")} placeholder="0" /> }}
              />
            </ExpandRow>
            <ExpandRow label="Border" summary={borderSummary}>
              <DualRow
                noBorder
                left={{ label: "Width", control: <ValuePicker value={val(node, "borderWidth")} options={BORDER_WIDTH_OPTIONS} onSelect={set("borderWidth")} placeholder="0" /> }}
                right={{ label: "Color", control: <ColorPickerField value={val(node, "borderColor") as string | undefined} onChange={set("borderColor") as (v: string) => void} presets={toColorPresets(BORDER_COLOR_OPTIONS)} compact /> }}
              />
            </ExpandRow>
            <FullRow label="Border Radius">
              <ValuePicker value={val(node, "br")} options={RADIUS_OPTIONS} onSelect={set("br")} placeholder="None" />
            </FullRow>
          </>
        ) : (
          <YStack px="$3" py="$4">
            <Body fontSize="$1" color="$textMuted">Select a layer to edit its properties.</Body>
          </YStack>
        )}
      </ScrollView>
    </YStack>
  );
}
