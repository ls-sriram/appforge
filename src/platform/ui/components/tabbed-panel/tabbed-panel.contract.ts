import { z } from "zod";
import type { ReactNode } from "react";
import type { IconName } from "../icon/Icon";
import type { TabsContract } from "../tabs/Tabs";
import type { UiStamp } from "../../viz";
import type { TabbedPanelContract } from "./tabbed-panel.styles";

export const TabbedPanelMoveDirectionSchema = z.enum(["left", "right"]);

export const TabbedPanelTabSchema = z.object({
  id: z.string(),
  label: z.string(),
  icon: z.custom<IconName>().optional(),
  disabled: z.boolean().optional(),
  closeable: z.boolean().optional(),
  movable: z.boolean().optional(),
  content: z.custom<ReactNode>(),
});

export const TabbedPanelSchema = z.object({
  tabsContract: z.custom<TabsContract>(),
  tabbedPanelContract: z.custom<TabbedPanelContract>(),
  tabs: z.array(TabbedPanelTabSchema),
  activeTabId: z.string().nullable(),
  onActiveTabChange: z.custom<(tabId: string) => void>(),
  onCloseTab: z.custom<(tabId: string) => void>().optional(),
  onMoveTab: z.custom<(tabId: string, direction: z.infer<typeof TabbedPanelMoveDirectionSchema>) => void>().optional(),
  actions: z.custom<ReactNode>().optional(),
  emptyState: z.custom<ReactNode>().optional(),
  ui: z.custom<UiStamp>().optional(),
});

export type TabbedPanelMoveDirection = z.infer<typeof TabbedPanelMoveDirectionSchema>;
export type TabbedPanelTab = z.infer<typeof TabbedPanelTabSchema>;
export type TabbedPanelProps = z.input<typeof TabbedPanelSchema>;
