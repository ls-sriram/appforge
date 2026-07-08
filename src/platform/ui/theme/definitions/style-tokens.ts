// Shared numeric/color helpers used across many components' default style
// values in createContracts. Not owned by any single component — kept here
// rather than co-located under ui/components/<name>/ so per-component style
// files can import them without a circular dependency back into factory.ts.

export const CONTROL_H = { sm: 36, md: 54, lg: 64 } as const;
export const TRACK_H = 4;
export const GAP = { tight: 4, xs: 8 } as const;

export function alpha(hex: string, a: number): string {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
