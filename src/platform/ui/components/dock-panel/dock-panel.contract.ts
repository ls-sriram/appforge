import { z } from "zod";
import type { ReactNode } from "react";
import type { IconName } from "../icon/Icon";
import type { TabsContract } from "../tabs/Tabs";
import type { UiStamp } from "../../viz";
import type { DockPanelContract } from "./dock-panel.styles";

export const DockPanelDisplayModeSchema = z.enum(["expanded", "icon-rail", "menu-trigger"]);
export const DockPanelPlacementSchema = z.enum(["left", "right", "top", "bottom"]);
export const DockPanelMoveDirectionSchema = z.enum(["backward", "forward"]);

export const DockPanelItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.custom<IconName>(),
  disabled: z.boolean().optional(),
  closeable: z.boolean().optional(),
  movable: z.boolean().optional(),
  badge: z.union([z.string(), z.number()]).optional(),
  content: z.custom<ReactNode>(),
});

export const DockPanelSchema = z.object({
  tabsContract: z.custom<TabsContract>().optional(),
  dockPanelContract: z.custom<DockPanelContract>(),
  items: z.array(DockPanelItemSchema).default([]),
  activeItemId: z.string().nullable().default(null),
  onActiveItemChange: z.custom<(itemId: string) => void>().optional(),
  title: z.string().optional(),
  icon: z.custom<IconName>().optional(),
  children: z.custom<ReactNode>().optional(),
  displayMode: DockPanelDisplayModeSchema.default("expanded"),
  placement: DockPanelPlacementSchema.default("left"),
  visible: z.boolean().default(true),
  collapsed: z.boolean().default(false),
  size: z.union([z.number(), z.string()]).optional(),
  minSize: z.number().optional(),
  maxSize: z.number().optional(),
  collapsedSize: z.number().optional(),
  collapseThreshold: z.number().optional(),
  canClose: z.boolean().default(false),
  canCollapse: z.boolean().default(false),
  canIconCollapse: z.boolean().default(false),
  canResize: z.boolean().default(false),
  onDisplayModeChange: z.custom<(mode: z.infer<typeof DockPanelDisplayModeSchema>) => void>().optional(),
  onCollapsedChange: z.custom<(collapsed: boolean) => void>().optional(),
  onVisibleChange: z.custom<(visible: boolean) => void>().optional(),
  onClose: z.custom<() => void>().optional(),
  onResizeStart: z.custom<() => void>().optional(),
  onResize: z.custom<(nextSize: number) => void>().optional(),
  onResizeEnd: z.custom<(nextSize: number) => void>().optional(),
  onCloseItem: z.custom<(itemId: string) => void>().optional(),
  onMoveItem: z.custom<(itemId: string, direction: z.infer<typeof DockPanelMoveDirectionSchema>) => void>().optional(),
  headerActions: z.custom<ReactNode>().optional(),
  actions: z.custom<ReactNode>().optional(),
  emptyState: z.custom<ReactNode>().optional(),
  menuLabel: z.string().default("Open dock menu"),
  onMenuPress: z.custom<() => void>().optional(),
  showHeader: z.boolean().default(true),
  ui: z.custom<UiStamp>().optional(),
});

export type DockPanelDisplayMode = z.infer<typeof DockPanelDisplayModeSchema>;
export type DockPanelPlacement = z.infer<typeof DockPanelPlacementSchema>;
export type DockPanelMoveDirection = z.infer<typeof DockPanelMoveDirectionSchema>;
export type DockPanelItem = z.infer<typeof DockPanelItemSchema>;
export type DockPanelProps = z.input<typeof DockPanelSchema>;
