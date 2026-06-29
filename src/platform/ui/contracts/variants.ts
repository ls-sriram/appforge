import type { ButtonContract } from "../primitives/Button";
import type { BadgeContract } from "../primitives/Badge";
import type { TagContract } from "../primitives/Tag";
import type { InputContract } from "../primitives/Input";
import type { AvatarContract } from "../primitives/Avatar";
import type { ProgressBarContract } from "../primitives/ProgressBar";
import type { ImageContract } from "../primitives/Table";
import type { TableContract } from "../primitives/Table";
import type { SelectableChipContract } from "../primitives/SelectableChip";
import type { TextAreaContract } from "../primitives/TextArea";
import type { SelectContract } from "../primitives/Select";
import type { MultiSelectContract } from "../primitives/MultiSelect";
import type { TabsContract } from "../primitives/Tabs";
import type { SizingToolbarContract } from "../primitives/SizingToolbar";
import type { TabbedPanelContract } from "../primitives/TabbedPanel";
import type { ColorPalettePickerContract } from "../primitives/ColorPalettePicker";

export type {
  ButtonContract,
  BadgeContract,
  TagContract,
  InputContract,
  AvatarContract,
  ProgressBarContract,
  ImageContract,
  TableContract,
  SelectableChipContract,
  TextAreaContract,
  SelectContract,
  MultiSelectContract,
  TabsContract,
  SizingToolbarContract,
  TabbedPanelContract,
  ColorPalettePickerContract,
};

export interface PrimitiveContracts {
  button?: Record<string, ButtonContract>;
  badge?: Record<string, BadgeContract>;
  tag?: Record<string, TagContract>;
  input?: Record<string, InputContract>;
  avatar?: Record<string, AvatarContract>;
  progressBar?: Record<string, ProgressBarContract>;
  image?: Record<string, ImageContract>;
  table?: Record<string, TableContract>;
  selectableChip?: Record<string, SelectableChipContract>;
  textArea?: Record<string, TextAreaContract>;
  select?: Record<string, SelectContract>;
  multiSelect?: Record<string, MultiSelectContract>;
  tabs?: Record<string, TabsContract>;
  sizingToolbar?: Record<string, SizingToolbarContract>;
  tabbedPanel?: Record<string, TabbedPanelContract>;
  colorPalettePicker?: Record<string, ColorPalettePickerContract>;
}
