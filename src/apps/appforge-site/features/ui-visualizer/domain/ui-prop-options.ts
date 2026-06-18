// Predefined lists for every inspector control.
// Nothing is free-text for design tokens — PMs pick from these menus.

import { DARK_THEME_RESOLVED } from "./ui-theme-palette";

export interface OptionItem {
  value: string | number | undefined;
  label: string;
  color?: string; // resolved hex for color swatches
}

// ── Spacing (maps $n tokens to px labels) ──────────────────────────────────

export const SPACE_OPTIONS: OptionItem[] = [
  { value: undefined, label: '—' },
  { value: '$1',  label: '4px' },
  { value: '$2',  label: '6px' },
  { value: '$3',  label: '10px' },
  { value: '$4',  label: '16px' },
  { value: '$5',  label: '22px' },
  { value: '$6',  label: '30px' },
];

// ── Radius ──────────────────────────────────────────────────────────────────

export const RADIUS_OPTIONS: OptionItem[] = [
  { value: undefined, label: 'None' },
  { value: '$1',      label: 'S' },
  { value: '$2',      label: 'M' },
  { value: '$3',      label: 'L' },
  { value: '$4',      label: 'XL' },
  { value: 999,       label: 'Full' },
];

// ── Typography ───────────────────────────────────────────────────────────────

export const FONT_FAMILY_OPTIONS: OptionItem[] = [
  { value: undefined,   label: '—' },
  { value: 'System',    label: 'System' },
  { value: 'Inter',     label: 'Inter' },
  { value: 'Caveat',    label: 'Caveat' },
  { value: 'monospace', label: 'Mono' },
];

export const TEXT_ALIGN_OPTIONS: OptionItem[] = [
  { value: undefined,  label: '—' },
  { value: 'left',     label: 'Left' },
  { value: 'center',   label: 'Center' },
  { value: 'right',    label: 'Right' },
];

export const FONT_SIZE_OPTIONS: OptionItem[] = [
  { value: '$1', label: 'XS  11px' },
  { value: '$2', label: 'SM  13px' },
  { value: '$3', label: 'MD  15px' },
  { value: '$4', label: 'LG  18px' },
  { value: '$5', label: 'XL  24px' },
];

export const FONT_WEIGHT_OPTIONS: OptionItem[] = [
  { value: '$reg',  label: 'Regular' },
  { value: '$bold', label: 'Bold' },
];

export const TEXT_TRANSFORM_OPTIONS: OptionItem[] = [
  { value: undefined,    label: 'None' },
  { value: 'uppercase',  label: 'Uppercase' },
  { value: 'capitalize', label: 'Capitalize' },
];

// ── Layout ───────────────────────────────────────────────────────────────────

export const ALIGN_OPTIONS: OptionItem[] = [
  { value: 'flex-start', label: 'Start' },
  { value: 'center',     label: 'Center' },
  { value: 'flex-end',   label: 'End' },
  { value: 'stretch',    label: 'Stretch' },
];

export const JUSTIFY_OPTIONS: OptionItem[] = [
  { value: 'flex-start',    label: 'Start' },
  { value: 'center',        label: 'Center' },
  { value: 'flex-end',      label: 'End' },
  { value: 'space-between', label: 'Space between' },
];

// ── Border ───────────────────────────────────────────────────────────────────

export const BORDER_WIDTH_OPTIONS: OptionItem[] = [
  { value: undefined, label: 'None' },
  { value: 1,         label: '1px' },
  { value: 2,         label: '2px' },
];

export const OPACITY_OPTIONS: OptionItem[] = [
  { value: undefined, label: '100%' },
  { value: 0.8,       label: '80%' },
  { value: 0.6,       label: '60%' },
  { value: 0.5,       label: '50%' },
  { value: 0.35,      label: '35%' },
];

// ── Color options (friendly name → swatch from resolved theme) ───────────────

function colorOpt(token: string | undefined, label: string): OptionItem {
  const key = token?.replace('$', '');
  const color = key ? (DARK_THEME_RESOLVED[key] ?? undefined) : undefined;
  return { value: token, label, color };
}

export const BG_COLOR_OPTIONS: OptionItem[] = [
  colorOpt(undefined,          'None'),
  colorOpt('$bg',              'Background'),
  colorOpt('$surface',         'Surface'),
  colorOpt('$surfaceAlt',      'Surface alt'),
  colorOpt('$surfaceStrong',   'Surface strong'),
  colorOpt('$primary',         'Primary'),
  colorOpt('$primaryMuted',    'Primary muted'),
  colorOpt('$successMuted',    'Success muted'),
  colorOpt('$warningMuted',    'Warning muted'),
  colorOpt('$errorMuted',      'Error muted'),
];

export const TEXT_COLOR_OPTIONS: OptionItem[] = [
  colorOpt('$textPrimary',   'Text'),
  colorOpt('$textSecondary', 'Secondary'),
  colorOpt('$textMuted',     'Muted'),
  colorOpt('$textInverse',   'Inverse'),
  colorOpt('$primary',       'Brand'),
  colorOpt('$success',       'Success'),
  colorOpt('$warning',       'Warning'),
  colorOpt('$error',         'Error'),
  colorOpt('$info',          'Info'),
];

export const BORDER_COLOR_OPTIONS: OptionItem[] = [
  colorOpt(undefined,        'None'),
  colorOpt('$borderSubtle',  'Subtle'),
  colorOpt('$border',        'Default'),
  colorOpt('$primary',       'Primary'),
  colorOpt('$error',         'Error'),
  colorOpt('$warning',       'Warning'),
];

// ── Icon & Tone ───────────────────────────────────────────────────────────────

export const ICON_NAME_OPTIONS: OptionItem[] = [
  'flask','home','user','table','list','check','shield','zap','info','settings',
].map(n => ({ value: n, label: n }));

export const ICON_SIZE_OPTIONS: OptionItem[] = [
  { value: 'sm', label: 'S' },
  { value: 'md', label: 'M' },
  { value: 'lg', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
];

export const TONE_OPTIONS: OptionItem[] = [
  'muted','secondary','accent','action','success','warning','danger','info','inverse','brand',
].map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }));

// ── Variant contracts ─────────────────────────────────────────────────────────

export const TEXT_TONE_OPTIONS: OptionItem[] = [
  { value: undefined,   label: '—' },
  { value: 'primary',   label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'muted',     label: 'Muted' },
  { value: 'accent',    label: 'Accent' },
  { value: 'inverse',   label: 'Inverse' },
  { value: 'danger',    label: 'Danger' },
  { value: 'success',   label: 'Success' },
  { value: 'warning',   label: 'Warning' },
  { value: 'info',      label: 'Info' },
];

export const TEXT_SIZE_OPTIONS: OptionItem[] = [
  { value: 'xs',      label: 'XS  11px' },
  { value: 'sm',      label: 'SM  13px' },
  { value: 'md',      label: 'MD  15px' },
  { value: 'lg',      label: 'LG  18px' },
  { value: 'xl',      label: 'XL  24px' },
  { value: '2xl',     label: '2XL 26px' },
  { value: 'display', label: 'Display 32px' },
];

export const TEXT_WEIGHT_OPTIONS: OptionItem[] = [
  { value: undefined,   label: '—' },
  { value: 'regular',   label: 'Regular' },
  { value: 'bold',      label: 'Bold' },
];

export const BUTTON_VARIANT_OPTIONS: OptionItem[] = [
  { value: 'primary',   label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'ghost',     label: 'Ghost' },
  { value: 'danger',    label: 'Danger' },
];

export const BUTTON_SIZE_OPTIONS: OptionItem[] = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' },
];
