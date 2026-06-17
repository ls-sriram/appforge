/**
 * View — UI Playground.
 *
 * Single-column tabbed layout: Live Preview (always visible) + tabs for
 * Tree / Props / Tokens / Source. Every control is a closed enum so
 * architecturally invalid edits are impossible by construction.
 */
import React from "react";
import { View, Pressable } from "react-native";
import { Block, Col, Row, Card, Body, Label, Button, Tag, SelectableChip, Input, Text } from "../../../../ui/primitives";
import { ThemeProvider } from "../../../../theme/ThemeProvider";
import {
  useUiPlayground,
  FRAME_OPTIONS,
  PAINT_OPTIONS,
  DIRECTION_OPTIONS,
  SPACE_OPTIONS,
  ALIGN_OPTIONS,
  JUSTIFY_OPTIONS,
  TEXT_VARIANT_OPTIONS,
  TONE_OPTIONS,
  LEAF_FRAME_OPTIONS,
  type PlaygroundNode,
  type PlaygroundNodeKind,
  type BlockTokenProps,
} from "./viewmodel/use-ui-playground";
import {
  useTokenPreview,
  BRAND_SWATCHES,
  BG_PRESETS,
  RADIUS_SCALE_OPTIONS,
  type TokenPreviewState,
} from "./viewmodel/use-token-preview";
import { playgroundToSource } from "./lib/serialize-playground";

type PlaygroundTab = "tree" | "props" | "tokens" | "source";

// ── RenderNode ────────────────────────────────────────────────────

function RenderNode({ node }: { node: PlaygroundNode }) {
  if (node.kind === "text") return <Text variant={node.textVariant} tone={node.tone} frame={node.leafFrame}>{node.label}</Text>;
  if (node.kind === "button") return <Button label={node.label} variant="secondary" onPress={() => {}} fullWidth={false} />;
  if (node.kind === "tag") return <Tag label={node.label} tone="info" />;
  return (
    <Block {...node.blockProps}>
      {node.children.length === 0
        ? <Label dim>Empty block</Label>
        : node.children.map((c) => <RenderNode key={c.id} node={c} />)}
    </Block>
  );
}

// ── Color swatch ──────────────────────────────────────────────────

function ColorSwatch({ color, selected, onPress }: { color: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <View style={{
        width: 28, height: 28,
        borderRadius: 6,
        backgroundColor: color,
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? "#A78BFA" : "rgba(255,255,255,0.15)",
      }} />
    </Pressable>
  );
}

// ── Token enum row (chips) ────────────────────────────────────────

function TokenRow<T extends string>({ label, value, options, onSelect }: {
  label: string;
  value: T | undefined;
  options: readonly T[];
  onSelect: (v: T) => void;
}) {
  return (
    <Col between="xxs">
      <Label dim>{label}</Label>
      <Row between="xs" flexWrap="wrap">
        {options.map((opt) => (
          <SelectableChip key={opt} label={opt} selected={value === opt} onPress={() => onSelect(opt)} />
        ))}
      </Row>
    </Col>
  );
}

function ToggleRow({ label, value, onToggle }: { label: string; value: boolean | undefined; onToggle: (v: boolean) => void }) {
  return (
    <Col between="xxs">
      <Label dim>{label}</Label>
      <Row between="xs">
        <SelectableChip label="off" selected={!value} onPress={() => onToggle(false)} />
        <SelectableChip label="on"  selected={!!value} onPress={() => onToggle(true)} />
      </Row>
    </Col>
  );
}

// ── Tree tab ──────────────────────────────────────────────────────

function OutlineRow({ node, depth, selectedId, onSelect, onAddChild, onRemove }: {
  node: PlaygroundNode; depth: number; selectedId: string;
  onSelect: (id: string) => void;
  onAddChild: (parentId: string, kind: PlaygroundNodeKind) => void;
  onRemove: (id: string) => void;
}) {
  const isSelected = node.id === selectedId;
  return (
    <Col between="xxs">
      <Row spread centered between="sm">
        <Body size="sm" primary={isSelected} dim={!isSelected} bold={isSelected}>
          {"  ".repeat(depth)}{node.kind === "block" ? "▢ Block" : `· ${node.kind}`}
        </Body>
        <Row between="xs">
          <Button label="Select" size="sm" variant="ghost" onPress={() => onSelect(node.id)} fullWidth={false} />
          {depth > 0 ? <Button label="✕" size="sm" variant="ghost" onPress={() => onRemove(node.id)} fullWidth={false} /> : null}
        </Row>
      </Row>
      {node.kind === "block" ? (
        <Row between="xs" flexWrap="wrap">
          <Button label="+ Text"   size="sm" variant="secondary" onPress={() => onAddChild(node.id, "text")}   fullWidth={false} />
          <Button label="+ Button" size="sm" variant="secondary" onPress={() => onAddChild(node.id, "button")} fullWidth={false} />
          <Button label="+ Tag"    size="sm" variant="secondary" onPress={() => onAddChild(node.id, "tag")}    fullWidth={false} />
          <Button label="+ Block"  size="sm" variant="secondary" onPress={() => onAddChild(node.id, "block")}  fullWidth={false} />
        </Row>
      ) : null}
      {node.children.map((c) => (
        <OutlineRow key={c.id} node={c} depth={depth + 1} selectedId={selectedId} onSelect={onSelect} onAddChild={onAddChild} onRemove={onRemove} />
      ))}
    </Col>
  );
}

// ── Props tab ─────────────────────────────────────────────────────

function PropsPanel({ pg }: { pg: ReturnType<typeof useUiPlayground> }) {
  const sel = pg.selected;
  if (!sel) return <Body size="sm" dim>Select a node in the Tree tab.</Body>;

  if (sel.kind === "block") {
    return (
      <Col between="sm">
        <TokenRow<NonNullable<BlockTokenProps["paint"]>>     label="paint"     value={sel.blockProps.paint}     options={PAINT_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "paint", v)} />
        <TokenRow<NonNullable<BlockTokenProps["direction"]>> label="direction" value={sel.blockProps.direction} options={DIRECTION_OPTIONS} onSelect={(v) => pg.setBlockProp(sel.id, "direction", v)} />
        <ToggleRow label="wrap" value={sel.blockProps.wrap} onToggle={(v) => pg.setBlockProp(sel.id, "wrap", v)} />
        <TokenRow<NonNullable<BlockTokenProps["align"]>>     label="align"     value={sel.blockProps.align}     options={ALIGN_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "align", v)} />
        <TokenRow<NonNullable<BlockTokenProps["justify"]>>   label="justify"   value={sel.blockProps.justify}   options={JUSTIFY_OPTIONS}   onSelect={(v) => pg.setBlockProp(sel.id, "justify", v)} />
        <TokenRow<NonNullable<BlockTokenProps["space"]>>     label="space"     value={sel.blockProps.space}     options={SPACE_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "space", v)} />
        <TokenRow<NonNullable<BlockTokenProps["frame"]>>     label="frame"     value={sel.blockProps.frame}     options={FRAME_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "frame", v)} />
        <TokenRow<NonNullable<BlockTokenProps["pad"]>>       label="pad"       value={sel.blockProps.pad}       options={SPACE_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "pad", v)} />
        <TokenRow<NonNullable<BlockTokenProps["padH"]>>      label="padH"      value={sel.blockProps.padH}      options={SPACE_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "padH", v)} />
        <TokenRow<NonNullable<BlockTokenProps["padV"]>>      label="padV"      value={sel.blockProps.padV}      options={SPACE_OPTIONS}     onSelect={(v) => pg.setBlockProp(sel.id, "padV", v)} />
      </Col>
    );
  }

  return (
    <Col between="sm">
      <Col between="xxs">
        <Label dim>label</Label>
        <Input value={sel.label} onChangeText={(v: string) => pg.setLabel(sel.id, v)} placeholder="Label" />
      </Col>
      {sel.kind === "text" ? (
        <>
          <TokenRow label="variant" value={sel.textVariant} options={TEXT_VARIANT_OPTIONS} onSelect={(v) => pg.setTextVariant(sel.id, v)} />
          <TokenRow label="frame"   value={sel.leafFrame}   options={LEAF_FRAME_OPTIONS}   onSelect={(v) => pg.setLeafFrame(sel.id, v)} />
        </>
      ) : null}
      <TokenRow label="tone" value={sel.tone} options={TONE_OPTIONS} onSelect={(v) => pg.setTone(sel.id, v)} />
    </Col>
  );
}

// ── Tokens tab ────────────────────────────────────────────────────

function TokensPanel({ tp }: { tp: TokenPreviewState }) {
  return (
    <Col between="lg">
      <Col between="sm">
        <Label dim upper>BACKGROUND</Label>
        <Row between="sm" flexWrap="wrap">
          {BG_PRESETS.map((p) => (
            <Col key={p.value} between="xxs" centered>
              <ColorSwatch color={p.value} selected={tp.options.bg === p.value} onPress={() => tp.setBg(p.value)} />
              <Label dim>{p.label}</Label>
            </Col>
          ))}
        </Row>
      </Col>

      {BRAND_SWATCHES.map((swatch) => (
        <Col key={swatch.key} between="xxs">
          <Label dim upper>{swatch.label.toUpperCase()}</Label>
          <Row between="sm" flexWrap="wrap">
            {swatch.values.map((hex) => (
              <ColorSwatch key={hex} color={hex} selected={tp.options[swatch.key] === hex} onPress={() => tp.setBrandColor(swatch.key, hex)} />
            ))}
          </Row>
        </Col>
      ))}

      <Col between="xxs">
        <Label dim upper>RADIUS SCALE</Label>
        <Row between="xs" flexWrap="wrap">
          {RADIUS_SCALE_OPTIONS.map((v) => (
            <SelectableChip key={v} label={String(v)} selected={tp.options.radiusScale === v} onPress={() => tp.setRadiusScale(v)} />
          ))}
        </Row>
      </Col>

      <ToggleRow label="DARK MODE" value={tp.options.dark} onToggle={tp.setDark} />

      <Button label="Reset tokens" size="sm" variant="ghost" onPress={tp.reset} fullWidth={false} />
    </Col>
  );
}

// ── Source tab ────────────────────────────────────────────────────

function SourcePanel({ root }: { root: PlaygroundNode }) {
  const source = React.useMemo(() => playgroundToSource(root), [root]);
  return (
    <Card variant="subtle" pad="md">
      <Label dim>{source}</Label>
    </Card>
  );
}

// ── Canvas header — live palette swatch ──────────────────────────

function PaletteBar({ tp }: { tp: TokenPreviewState }) {
  const colors = [tp.options.primary, tp.options.success, tp.options.warning, tp.options.error, tp.options.info];
  return (
    <Row spread centered>
      <Row between="xs">
        {colors.map((c) => (
          <View key={c} style={{ width: 12, height: 12, borderRadius: 99, backgroundColor: c }} />
        ))}
      </Row>
      <Label dim>preview — scoped theme</Label>
    </Row>
  );
}

// ── Main export ───────────────────────────────────────────────────

export function UiPlaygroundSection() {
  const pg = useUiPlayground();
  const tp = useTokenPreview();
  const [tab, setTab] = React.useState<PlaygroundTab>("tree");

  const TAB_LABELS: { id: PlaygroundTab; label: string }[] = [
    { id: "tree",   label: "Tree" },
    { id: "props",  label: "Props" },
    { id: "tokens", label: "Tokens" },
    { id: "source", label: "Source" },
  ];

  return (
    <Col between="lg" expand>

      {/* Live preview */}
      <Col between="xs">
        <PaletteBar tp={tp} />
        <ThemeProvider value={tp.previewTheme}>
          <View style={{ backgroundColor: tp.options.bg, borderRadius: 12, padding: 20, minHeight: 120 }}>
            <RenderNode node={pg.root} />
          </View>
        </ThemeProvider>
      </Col>

      {/* Tab bar */}
      <Row spread centered>
        <Row between="xs">
          {TAB_LABELS.map(({ id, label }) => (
            <SelectableChip key={id} label={label} selected={tab === id} onPress={() => setTab(id)} />
          ))}
        </Row>
        <Button label="Reset" size="sm" variant="ghost" onPress={() => { pg.reset(); tp.reset(); }} fullWidth={false} />
      </Row>

      {/* Tab content */}
      <Card pad="md">
        {tab === "tree"   && <OutlineRow node={pg.root} depth={0} selectedId={pg.selectedId} onSelect={pg.selectNode} onAddChild={pg.addChild} onRemove={pg.removeNode} />}
        {tab === "props"  && <PropsPanel pg={pg} />}
        {tab === "tokens" && <TokensPanel tp={tp} />}
        {tab === "source" && <SourcePanel root={pg.root} />}
      </Card>

    </Col>
  );
}
