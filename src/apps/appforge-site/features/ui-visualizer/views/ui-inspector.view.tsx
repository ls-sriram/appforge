import React from "react";
import { Pressable, ScrollView, TextInput } from "react-native";
import { Body, Button, View, XStack, YStack } from "../../../../../ui";
import {
  ALIGN_OPTIONS,
  BG_COLOR_OPTIONS,
  BORDER_COLOR_OPTIONS,
  BORDER_WIDTH_OPTIONS,
  BUTTON_SIZE_OPTIONS,
  BUTTON_VARIANT_OPTIONS,
  ICON_NAME_OPTIONS,
  ICON_SIZE_OPTIONS,
  JUSTIFY_OPTIONS,
  OPACITY_OPTIONS,
  RADIUS_OPTIONS,
  SPACE_OPTIONS,
  TEXT_COLOR_OPTIONS,
  TEXT_SIZE_OPTIONS,
  TEXT_TONE_OPTIONS,
  TEXT_TRANSFORM_OPTIONS,
  TEXT_WEIGHT_OPTIONS,
  TONE_OPTIONS,
  type OptionItem,
} from "../domain/ui-prop-options";
import { DARK_THEME_RESOLVED } from "../domain/ui-theme-palette";
import type { UiDocument, UiNode, UiNodeProps } from "../domain/ui-document.types";

// ── Value picker ──────────────────────────────────────────────────────────────

function ValuePicker({
  value,
  options,
  onSelect,
  minWidth = 88,
}: {
  value: string | number | undefined;
  options: OptionItem[];
  onSelect: (v: string | number | undefined) => void;
  minWidth?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => String(o.value) === String(value ?? ""));
  const displayLabel = current?.label ?? (value !== undefined ? String(value) : "—");

  return (
    <View style={{ position: "relative", minWidth }}>
      <Pressable onPress={() => setOpen((v) => !v)}>
        <XStack ai="center" gap="$1" px="$2" h={26} br="$2" bg="$surfaceStrong" borderColor={open ? "$primary" : "$borderSubtle"} borderWidth={1}>
          {current?.color && (
            <View w={10} h={10} br="$1" bg={current.color} borderColor="$borderSubtle" borderWidth={1} flexShrink={0} />
          )}
          <Body fontSize="$1" color="$textPrimary" f={1} numberOfLines={1}>{displayLabel}</Body>
          <Body fontSize={9} color="$textMuted">▾</Body>
        </XStack>
      </Pressable>
      {open && (
        <View
          style={{ position: "absolute", top: 28, left: 0, zIndex: 200, minWidth: 160 }}
          bg="$surfaceStrong" borderColor="$border" borderWidth={1} br="$2" overflow="hidden"
        >
          <ScrollView style={{ maxHeight: 220 }}>
            {options.map((opt) => {
              const selected = String(opt.value ?? "") === String(value ?? "");
              return (
                <Pressable key={String(opt.value ?? "none")} onPress={() => { onSelect(opt.value); setOpen(false); }}>
                  <XStack ai="center" gap="$2" px="$2" py="$2" bg={selected ? "$surfaceAlt" : "transparent"}>
                    {opt.color && <View w={12} h={12} br="$1" bg={opt.color} borderColor="$borderSubtle" borderWidth={1} />}
                    <Body fontSize="$1" color={selected ? "$textPrimary" : "$textSecondary"}>{opt.label}</Body>
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

// ── Inline text input ─────────────────────────────────────────────────────────

function InlineTextInput({ value, placeholder, onChange }: { value: string | undefined; placeholder?: string; onChange: (v: string | undefined) => void }) {
  return (
    <View f={1} h={26} px="$2" br="$2" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} jc="center">
      <TextInput
        value={value ?? ""}
        onChangeText={(t) => onChange(t || undefined)}
        placeholder={placeholder ?? "—"}
        placeholderTextColor="#525252"
        style={{ color: "#F2F2F2", fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
      />
    </View>
  );
}

// ── Inline number input ───────────────────────────────────────────────────────

function InlineNumberInput({ value, placeholder, onChange }: { value: number | undefined; placeholder?: string; onChange: (v: number | undefined) => void }) {
  return (
    <View f={1} h={26} px="$2" br="$2" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1} jc="center">
      <TextInput
        value={value !== undefined ? String(value) : ""}
        onChangeText={(t) => {
          const n = parseFloat(t);
          onChange(isNaN(n) ? undefined : n);
        }}
        placeholder={placeholder ?? "—"}
        keyboardType="numeric"
        placeholderTextColor="#525252"
        style={{ color: "#F2F2F2", fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
      />
    </View>
  );
}

// ── Section + row primitives ──────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack borderBottomColor="$borderSubtle" borderBottomWidth={1}>
      <Body px="$3" pt="$2" pb="$1" fontSize="$1" color="$textMuted" tt="uppercase" letterSpacing={1} opacity={0.55}>{label}</Body>
      <YStack px="$3" pb="$2" gap="$2">{children}</YStack>
    </YStack>
  );
}

function PropRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <XStack ai="center" gap="$2" minHeight={28}>
      <Body fontSize="$1" color="$textMuted" w={72} flexShrink={0}>{label}</Body>
      <View f={1}>{children}</View>
    </XStack>
  );
}

function TwoColRow({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <XStack gap="$2">
      <View f={1}>{left}</View>
      <View f={1}>{right}</View>
    </XStack>
  );
}

function SmallLabel({ children }: { children: React.ReactNode }) {
  return <Body fontSize="$1" color="$textMuted" opacity={0.55} mb="$1">{children}</Body>;
}

function val(node: UiNode, key: keyof UiNodeProps): string | number | undefined {
  return node.props[key] as string | number | undefined;
}

// ── Layer tree ────────────────────────────────────────────────────────────────

function LayerNode({
  document, nodeId, depth, selectedNodeId, onSelectNode,
}: {
  document: UiDocument; nodeId: string; depth: number; selectedNodeId?: string; onSelectNode: (id: string) => void;
}) {
  const node = document.nodes[nodeId];
  if (!node) return null;
  const selected = selectedNodeId === nodeId;
  return (
    <>
      <Pressable onPress={() => onSelectNode(nodeId)}>
        <XStack ai="center" gap="$1" h={24} pl={(depth * 10 + 10) as any} bg={selected ? "$surfaceAlt" : "transparent"} borderLeftColor={selected ? "$primary" : "transparent"} borderLeftWidth={2}>
          <Body fontSize={10} color="$textMuted" w={10}>{node.children.length > 0 ? "▾" : " "}</Body>
          <Body fontSize="$1" color={selected ? "$primary" : "$textMuted"}>{node.type}</Body>
          {nodeId === document.rootId && <Body fontSize={9} color="$textMuted" opacity={0.4} ml="$1">root</Body>}
        </XStack>
      </Pressable>
      {node.children.map((childId) => (
        <LayerNode key={childId} document={document} nodeId={childId} depth={depth + 1} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
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
  onSaveBlock,
}: {
  node?: UiNode;
  document: UiDocument;
  selectedNodeId?: string;
  onSelectNode: (id: string) => void;
  onUpdateProp: (
    key: keyof UiNodeProps,
    value: string | number | boolean | undefined,
  ) => void;
  onRemove: () => void;
  onSaveBlock?: (name: string) => void;
}) {
  const [savingBlock, setSavingBlock] = React.useState(false);
  const [blockName, setBlockName] = React.useState("");

  const set = (key: keyof UiNodeProps) => (
    v: string | number | boolean | undefined,
  ) => onUpdateProp(key, v);
  const isRoot = selectedNodeId === document.rootId;

  return (
    <YStack f={1}>
      {/* Selection header */}
      {node && (
        <>
          <XStack px="$3" py="$2" ai="center" gap="$2" borderBottomColor="$borderSubtle" borderBottomWidth={savingBlock ? 0 : 1}>
            <View px="$2" py="$1" br="$2" bg="$surfaceStrong" borderColor="$borderSubtle" borderWidth={1}>
              <Body fontSize="$1" color="$textMuted">{node.type}</Body>
            </View>
            <Body fontSize="$1" color="$textMuted" f={1} numberOfLines={1}>{node.id}</Body>
            {!isRoot && onSaveBlock && (
              <Pressable onPress={() => { setSavingBlock((v) => !v); setBlockName(""); }}>
                <Body fontSize="$1" color="$textMuted" opacity={0.6}>⬡</Body>
              </Pressable>
            )}
            <Pressable onPress={onRemove}>
              <Body fontSize="$1" color="$error">✕</Body>
            </Pressable>
          </XStack>

          {savingBlock && (
            <XStack px="$3" py="$2" gap="$2" ai="center" borderBottomColor="$borderSubtle" borderBottomWidth={1}>
              <View f={1} h={26} px="$2" br="$2" bg="$surfaceStrong" borderColor="$primary" borderWidth={1} jc="center">
                <TextInput
                  value={blockName}
                  onChangeText={setBlockName}
                  placeholder="Block name…"
                  autoFocus
                  placeholderTextColor="#525252"
                  style={{ color: "#F2F2F2", fontSize: 11, fontFamily: "System", padding: 0, margin: 0 }}
                  onSubmitEditing={() => {
                    if (blockName.trim()) { onSaveBlock?.(blockName.trim()); setSavingBlock(false); setBlockName(""); }
                  }}
                />
              </View>
              <Pressable onPress={() => {
                if (blockName.trim()) { onSaveBlock?.(blockName.trim()); setSavingBlock(false); setBlockName(""); }
              }}>
                <Body fontSize="$1" color="$primary">Save</Body>
              </Pressable>
              <Pressable onPress={() => { setSavingBlock(false); setBlockName(""); }}>
                <Body fontSize="$1" color="$textMuted">Cancel</Body>
              </Pressable>
            </XStack>
          )}
        </>
      )}

      <ScrollView style={{ flex: 1 }}>
        {node ? (
          <>
            {/* ── Text atoms ── */}
            {(node.type === "Display" || node.type === "Heading" || node.type === "Body" || node.type === "Label") && (
              <Section label="Typography">
                <PropRow label="Content">
                  <InlineTextInput value={val(node, "text") as string} placeholder="Enter text…" onChange={set("text")} />
                </PropRow>
                <TwoColRow
                  left={<YStack gap="$1"><SmallLabel>Tone</SmallLabel><ValuePicker value={val(node, "tone")} options={TEXT_TONE_OPTIONS} onSelect={set("tone")} /></YStack>}
                  right={node.type !== "Display" ? <YStack gap="$1"><SmallLabel>Size</SmallLabel><ValuePicker value={val(node, "size")} options={TEXT_SIZE_OPTIONS} onSelect={set("size")} /></YStack> : <View />}
                />
                {(node.type === "Heading" || node.type === "Body") && (
                  <TwoColRow
                    left={<YStack gap="$1"><SmallLabel>Weight</SmallLabel><ValuePicker value={val(node, "weight")} options={TEXT_WEIGHT_OPTIONS} onSelect={set("weight")} /></YStack>}
                    right={<View />}
                  />
                )}
                {node.type === "Label" && (
                  <PropRow label="Transform">
                    <ValuePicker value={val(node, "tt")} options={TEXT_TRANSFORM_OPTIONS} onSelect={set("tt")} />
                  </PropRow>
                )}
              </Section>
            )}

            {/* ── Button ── */}
            {node.type === "Button" && (
              <Section label="Button">
                <PropRow label="Label">
                  <InlineTextInput value={val(node, "text") as string} placeholder="Button text" onChange={set("text")} />
                </PropRow>
                <PropRow label="Background">
                  <ValuePicker value={val(node, "bg")} options={BG_COLOR_OPTIONS} onSelect={set("bg")} />
                </PropRow>
                <PropRow label="Opacity">
                  <ValuePicker value={val(node, "opacity")} options={OPACITY_OPTIONS} onSelect={set("opacity")} />
                </PropRow>
              </Section>
            )}

            {/* ── Tag ── */}
            {node.type === "Tag" && (
              <Section label="Tag">
                <PropRow label="Label">
                  <InlineTextInput value={(val(node, "label") ?? val(node, "text")) as string} placeholder="Badge text" onChange={set("label")} />
                </PropRow>
                <PropRow label="Tone">
                  <ValuePicker value={val(node, "tone")} options={TONE_OPTIONS} onSelect={set("tone")} />
                </PropRow>
              </Section>
            )}

            {/* ── Icon ── */}
            {node.type === "Icon" && (
              <Section label="Icon">
                <TwoColRow
                  left={<YStack gap="$1"><SmallLabel>Icon</SmallLabel><ValuePicker value={val(node, "icon")} options={ICON_NAME_OPTIONS} onSelect={set("icon")} /></YStack>}
                  right={<YStack gap="$1"><SmallLabel>Size</SmallLabel><ValuePicker value={val(node, "size")} options={ICON_SIZE_OPTIONS} onSelect={set("size")} /></YStack>}
                />
                <PropRow label="Tone"><ValuePicker value={val(node, "tone")} options={TONE_OPTIONS} onSelect={set("tone")} /></PropRow>
              </Section>
            )}

            {/* ── Avatar ── */}
            {node.type === "Avatar" && (
              <Section label="Avatar">
                <PropRow label="Initials">
                  <InlineTextInput value={val(node, "initials") as string} placeholder="AB" onChange={set("initials")} />
                </PropRow>
              </Section>
            )}

            {/* ── Badge ── */}
            {node.type === "Badge" && (
              <Section label="Badge">
                <PropRow label="Label">
                  <InlineTextInput value={(val(node, "text") ?? val(node, "label")) as string} placeholder="Badge" onChange={set("text")} />
                </PropRow>
                <PropRow label="Tone">
                  <ValuePicker value={val(node, "tone")} options={[
                    { label: "Muted",   value: "muted" },
                    { label: "Info",    value: "info" },
                    { label: "Success", value: "success" },
                    { label: "Warning", value: "warning" },
                    { label: "Danger",  value: "danger" },
                  ]} onSelect={set("tone")} />
                </PropRow>
              </Section>
            )}

            {/* ── Input / TextArea ── */}
            {(node.type === "Input" || node.type === "TextArea") && (
              <Section label={node.type}>
                <PropRow label="Placeholder">
                  <InlineTextInput value={val(node, "placeholder") as string} placeholder="Enter text…" onChange={set("placeholder")} />
                </PropRow>
              </Section>
            )}

            {/* ── SelectableChip ── */}
            {node.type === "SelectableChip" && (
              <Section label="Chip">
                <PropRow label="Label">
                  <InlineTextInput value={(val(node, "text") ?? val(node, "label")) as string} placeholder="Option" onChange={set("text")} />
                </PropRow>
                <TwoColRow
                  left={<YStack gap="$1"><SmallLabel>Selected</SmallLabel>
                    <Pressable onPress={() => onUpdateProp("selected", node.props.selected ? undefined : true)}>
                      <XStack ai="center" gap="$2" px="$2" h={26} br="$2" bg="$surfaceStrong" borderColor={node.props.selected ? "$primary" : "$borderSubtle"} borderWidth={1}>
                        <Body fontSize="$1" color={node.props.selected ? "$primary" : "$textMuted"}>{node.props.selected ? "Yes" : "No"}</Body>
                      </XStack>
                    </Pressable>
                  </YStack>}
                  right={<YStack gap="$1"><SmallLabel>Size</SmallLabel><ValuePicker value={val(node, "size")} options={[{ label: "sm", value: "sm" }, { label: "md", value: "md" }]} onSelect={set("size")} /></YStack>}
                />
              </Section>
            )}

            {/* ── ProgressBar ── */}
            {node.type === "ProgressBar" && (
              <Section label="Progress">
                <PropRow label="Value">
                  <InlineNumberInput value={val(node, "value") as number} placeholder="0–100" onChange={set("value")} />
                </PropRow>
                <PropRow label="Tone">
                  <ValuePicker value={val(node, "tone")} options={[
                    { label: "Primary", value: "primary" },
                    { label: "Success", value: "success" },
                    { label: "Warning", value: "warning" },
                    { label: "Danger",  value: "danger" },
                  ]} onSelect={set("tone")} />
                </PropRow>
              </Section>
            )}

            {/* ── Container surface + layout ── */}
            {(node.type === "View" || node.type === "YStack" || node.type === "XStack") && (
              <>
                <Section label="Surface">
                  <PropRow label="Background"><ValuePicker value={val(node, "bg")} options={BG_COLOR_OPTIONS} onSelect={set("bg")} /></PropRow>
                  <TwoColRow
                    left={<YStack gap="$1"><SmallLabel>Border</SmallLabel><ValuePicker value={val(node, "borderColor")} options={BORDER_COLOR_OPTIONS} onSelect={set("borderColor")} /></YStack>}
                    right={<YStack gap="$1"><SmallLabel>Width</SmallLabel><ValuePicker value={val(node, "borderWidth")} options={BORDER_WIDTH_OPTIONS} onSelect={set("borderWidth")} /></YStack>}
                  />
                  <PropRow label="Radius"><ValuePicker value={val(node, "br")} options={RADIUS_OPTIONS} onSelect={set("br")} /></PropRow>
                </Section>
                <Section label="Layout">
                  <TwoColRow
                    left={<YStack gap="$1"><SmallLabel>Gap</SmallLabel><ValuePicker value={val(node, "gap")} options={SPACE_OPTIONS} onSelect={set("gap")} /></YStack>}
                    right={<YStack gap="$1"><SmallLabel>Align</SmallLabel><ValuePicker value={val(node, "ai")} options={ALIGN_OPTIONS} onSelect={set("ai")} /></YStack>}
                  />
                  <PropRow label="Justify"><ValuePicker value={val(node, "jc")} options={JUSTIFY_OPTIONS} onSelect={set("jc")} /></PropRow>
                </Section>
                <Section label="Spacing">
                  <TwoColRow
                    left={<YStack gap="$1"><SmallLabel>Pad X</SmallLabel><ValuePicker value={val(node, "px")} options={SPACE_OPTIONS} onSelect={set("px")} /></YStack>}
                    right={<YStack gap="$1"><SmallLabel>Pad Y</SmallLabel><ValuePicker value={val(node, "py")} options={SPACE_OPTIONS} onSelect={set("py")} /></YStack>}
                  />
                  <PropRow label="Padding"><ValuePicker value={val(node, "p")} options={SPACE_OPTIONS} onSelect={set("p")} /></PropRow>
                </Section>
              </>
            )}
          </>
        ) : (
          <YStack px="$3" py="$3">
            <Body fontSize="$2" color="$textMuted">Select a node to edit its properties.</Body>
          </YStack>
        )}

        {/* ── Layers ── */}
        <YStack borderTopColor="$borderSubtle" borderTopWidth={node ? 1 : 0} mt={node ? "$2" : 0}>
          <Body px="$3" pt="$2" pb="$1" fontSize="$1" color="$textMuted" tt="uppercase" letterSpacing={1} opacity={0.55}>Layers</Body>
          <LayerNode
            document={document}
            nodeId={document.rootId}
            depth={0}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
          />
        </YStack>
      </ScrollView>
    </YStack>
  );
}
