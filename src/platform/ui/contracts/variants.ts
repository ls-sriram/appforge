import type { ButtonVariant } from "../primitives/Button";
import type { BadgeVariant } from "../primitives/Badge";
import type { TagVariant } from "../primitives/Tag";
import type { InputVariant } from "../primitives/Input";
import type { AvatarVariant } from "../primitives/Avatar";
import type { ProgressBarVariant } from "../primitives/ProgressBar";
import type { ImageVariant } from "../primitives/Table";
import type { TableVariant } from "../primitives/Table";
import type { SelectableChipVariant } from "../primitives/SelectableChip";
import type { TextAreaVariant } from "../primitives/TextArea";
import type { SelectVariant } from "../primitives/Select";
import type { MultiSelectVariant } from "../primitives/MultiSelect";
import type { TabsVariant } from "../primitives/Tabs";
import type { SizingToolbarVariant } from "../primitives/SizingToolbar";
import type { TabbedPanelVariant } from "../primitives/TabbedPanel";
import type { ColorPalettePickerVariant } from "../primitives/ColorPalettePicker";

export type {
  ButtonVariant,
  BadgeVariant,
  TagVariant,
  InputVariant,
  AvatarVariant,
  ProgressBarVariant,
  ImageVariant,
  TableVariant,
  SelectableChipVariant,
  TextAreaVariant,
  SelectVariant,
  MultiSelectVariant,
  TabsVariant,
  SizingToolbarVariant,
  TabbedPanelVariant,
  ColorPalettePickerVariant,
};

export interface Variants {
  button?: Record<string, ButtonVariant>;
  badge?: Record<string, BadgeVariant>;
  tag?: Record<string, TagVariant>;
  input?: Record<string, InputVariant>;
  avatar?: Record<string, AvatarVariant>;
  progressBar?: Record<string, ProgressBarVariant>;
  image?: Record<string, ImageVariant>;
  table?: Record<string, TableVariant>;
  selectableChip?: Record<string, SelectableChipVariant>;
  textArea?: Record<string, TextAreaVariant>;
  select?: Record<string, SelectVariant>;
  multiSelect?: Record<string, MultiSelectVariant>;
  tabs?: Record<string, TabsVariant>;
  sizingToolbar?: Record<string, SizingToolbarVariant>;
  tabbedPanel?: Record<string, TabbedPanelVariant>;
  colorPalettePicker?: Record<string, ColorPalettePickerVariant>;
}
