// ── Composition primitive ─────────────────────────────────────────
export { Block } from "./Block";
export type { BlockProps, FrameVariant, PaintVariant, SafeAreaEdge, SpaceToken, DirectionVariant, AlignToken, JustifyToken } from "./Block";

// ── Leaf primitives (no layout responsibility) ────────────────────
export { Text, getVariantStyle } from "./Text";
export type { TextTone, TextVariant, TextWeight } from "./Text";
export { MetaText, ActionText } from "./TextRoles";
export { Button } from "./Button";
export { Input } from "./Input";
export { TextArea } from "./TextArea";
export type { TextAreaSize } from "./TextArea";
export { Icon } from "./Icon";
export type { IconName, IconSize, IconTone } from "./Icon";
export { Avatar } from "./Avatar";
export { Badge } from "./Badge";
export type { BadgeVariant, BadgeSize } from "./Badge";
export { Tag } from "./Tag";
export { Chip } from "./Chip";
export type { ChipTone } from "./Chip";
export { SelectableChip } from "./SelectableChip";
export type { SelectableChipSize, SelectableChipShape, SelectableChipFrame } from "./SelectableChip";
export { Link } from "./Link";
export { Toggle } from "./Toggle";
export { ProgressBar } from "./ProgressBar";
export type { ProgressBarTone } from "./ProgressBar";
export { Skeleton } from "./Skeleton";
export { EmptyState } from "./EmptyState";
export { TapTarget } from "./TapTarget";
export type { TapTargetFeedback } from "./TapTarget";
export { LayoutGrid } from "./LayoutGrid";

// ── Scroll — ScrollView, not a Block ─────────────────────────────
export { ScrollArea } from "./Layout";
