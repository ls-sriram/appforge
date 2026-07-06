import type { ButtonContract } from "../primitives/button";
import type { BadgeContract } from "../primitives/badge";
import type { TagContract } from "../primitives/tag";
import type { InputContract } from "../primitives/input";
import type { AvatarContract } from "../primitives/avatar";
import type { ProgressBarContract } from "../primitives/progressbar";
import type { ImageContract, TableContract } from "../primitives/table";
import type { SelectableChipContract } from "../primitives/selectablechip";
import type { TextAreaContract } from "../primitives/textarea";
import type { SelectContract } from "../primitives/select";
import type { MultiSelectContract } from "../primitives/multiselect";
import type { TabsContract } from "../primitives/tabs";
import type { SizingToolbarContract } from "../primitives/sizingtoolbar";
import type { TabbedPanelContract } from "../primitives/tabbedpanel";
import type { DockPanelContract } from "../primitives/dockpanel";
import type { DockSplitterContract } from "../primitives/docksplitter";
import type { ColorPalettePickerContract } from "../primitives/colorpalettepicker";

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
  dockPanel?: Record<string, DockPanelContract>;
  dockSplitter?: Record<string, DockSplitterContract>;
  colorPalettePicker?: Record<string, ColorPalettePickerContract>;
}
