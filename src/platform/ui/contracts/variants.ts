/**
 * Variant contracts for value primitives.
 *
 * Each interface defines what an application-provided variant must supply.
 * Fields are resolved values (strings/numbers) — not token references.
 * Applications define variant names; AppForge defines the contract.
 */

export interface ButtonVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  minHeight?: number;
  borderWidth?: number;
  borderColor?: string;
  shadow?: string;
}

export interface BadgeVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
  borderWidth?: number;
  borderColor?: string;
}

export interface TagVariant {
  backgroundColor: string;
  color: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontWeight: string | number;
}

export interface InputVariant {
  backgroundColor: string;
  color: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
  fontFamily: string;
  placeholderColor?: string;
}

export interface AvatarVariant {
  width: number;
  height: number;
  borderRadius: number;
  fontSize: number;
  backgroundColor: string;
  color: string;
}

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
