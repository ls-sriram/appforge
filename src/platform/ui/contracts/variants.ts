import type { ButtonVariant } from "../primitives/Button";
import type { BadgeVariant } from "../primitives/Badge";
import type { TagVariant } from "../primitives/Tag";
import type { InputVariant } from "../primitives/Input";
import type { AvatarVariant } from "../primitives/Avatar";

export type { ButtonVariant, BadgeVariant, TagVariant, InputVariant, AvatarVariant };

export interface ProgressBarVariant {
  trackColor: string;
  fillColor: string;
  height: number;
  borderRadius: number;
}

export interface Variants {
  button?: Record<string, ButtonVariant>;
  badge?: Record<string, BadgeVariant>;
  tag?: Record<string, TagVariant>;
  input?: Record<string, InputVariant>;
  avatar?: Record<string, AvatarVariant>;
  progressBar?: Record<string, ProgressBarVariant>;
}
