import type { ButtonVariant } from "../primitives/Button";
import type { BadgeVariant } from "../primitives/Badge";
import type { TagVariant } from "../primitives/Tag";
import type { InputVariant } from "../primitives/Input";
import type { AvatarVariant } from "../primitives/Avatar";
import type { ProgressBarVariant } from "../primitives/ProgressBar";
import type { ImageVariant } from "../primitives/Table";
import type { SelectableChipVariant } from "../primitives/SelectableChip";
import type { TextAreaVariant } from "../primitives/TextArea";
import type { SelectVariant } from "../primitives/Select";
import type { MultiSelectVariant } from "../primitives/MultiSelect";

export type {
  ButtonVariant,
  BadgeVariant,
  TagVariant,
  InputVariant,
  AvatarVariant,
  ProgressBarVariant,
  ImageVariant,
  SelectableChipVariant,
  TextAreaVariant,
  SelectVariant,
  MultiSelectVariant,
};

export interface Variants {
  button?: Record<string, ButtonVariant>;
  badge?: Record<string, BadgeVariant>;
  tag?: Record<string, TagVariant>;
  input?: Record<string, InputVariant>;
  avatar?: Record<string, AvatarVariant>;
  progressBar?: Record<string, ProgressBarVariant>;
  image?: Record<string, ImageVariant>;
  selectableChip?: Record<string, SelectableChipVariant>;
  textArea?: Record<string, TextAreaVariant>;
  select?: Record<string, SelectVariant>;
  multiSelect?: Record<string, MultiSelectVariant>;
}
