import React from "react";
import { View } from "react-native";
import { workspaceShell } from "../../theme/tokens";
import { useViewport, type ViewportTier } from "../../theme/Viewport";
import {
  type ScaffoldSlotPlacement,
} from "../contract";
import { noopUi, type UiStamp } from "../viz";

type SlotNode = React.ReactNode;
type SidebarPlacement = Extract<ScaffoldSlotPlacement, "left" | "right">;
type CollapseMode = "never" | ViewportTier;

export type HeaderScaffoldProps = {
  ui?: UiStamp;
  leading?: SlotNode;
  title?: SlotNode;
  actions?: SlotNode;
  collapseLeadingOn?: CollapseMode;
  collapseActionsOn?: CollapseMode;
};

export type SidebarScaffoldProps = {
  ui?: UiStamp;
  header?: SlotNode;
  content: SlotNode;
  footer?: SlotNode;
  collapseOn?: CollapseMode;
  collapsedContent?: SlotNode;
};

export type PanelScaffoldProps = {
  ui?: UiStamp;
  header?: SlotNode;
  content: SlotNode;
  footer?: SlotNode;
  actions?: SlotNode;
};

export type PanelCollectionScaffoldProps = {
  ui?: UiStamp;
  header?: SlotNode;
  items: SlotNode;
  actions?: SlotNode;
};

export type PageScaffoldProps = {
  ui?: UiStamp;
  header?: SlotNode;
  sidebar?: SlotNode;
  content: SlotNode;
  footer?: SlotNode;
  sidebarPlacement?: SidebarPlacement;
};

function hasContent(node: React.ReactNode) {
  return node !== undefined && node !== null && node !== false;
}

function shouldCollapse(mode: CollapseMode | undefined, viewport: ReturnType<typeof useViewport>) {
  return mode !== undefined && mode !== "never" && viewport.tier === mode;
}

function Section({
  children,
  testID,
}: {
  children: React.ReactNode;
  testID?: string;
}) {
  if (!hasContent(children)) {
    return null;
  }

  return (
    <View
      nativeID={testID}
      testID={testID}
      style={styles.section}
    >
      {children}
    </View>
  );
}

export function HeaderScaffold({
  ui = noopUi,
  leading,
  title,
  actions,
  collapseLeadingOn = "never",
  collapseActionsOn = "never",
}: HeaderScaffoldProps) {
  const viewport = useViewport();
  const showLeading = hasContent(leading) && !shouldCollapse(collapseLeadingOn, viewport);
  const showActions = hasContent(actions) && !shouldCollapse(collapseActionsOn, viewport);

  return (
    <View
      nativeID={ui("root").__uiid}
      testID={ui("root").__uiid}
      style={[
        styles.headerRow,
      ]}
    >
      {showLeading ? (
        <View nativeID={ui("leading").__uiid} testID={ui("leading").__uiid} style={styles.headerEdge}>
          {leading}
        </View>
      ) : null}
      <View nativeID={ui("title").__uiid} testID={ui("title").__uiid} style={styles.headerTitle}>
        {title}
      </View>
      {showActions ? (
        <View nativeID={ui("actions").__uiid} testID={ui("actions").__uiid} style={[styles.headerEdge, styles.actionsAlign]}>
          {actions}
        </View>
      ) : null}
    </View>
  );
}

export function SidebarScaffold({
  ui = noopUi,
  header,
  content,
  footer,
  collapseOn = "never",
  collapsedContent,
}: SidebarScaffoldProps) {
  const viewport = useViewport();
  const collapsed = shouldCollapse(collapseOn, viewport);

  return (
    <View
      nativeID={ui("root").__uiid}
      testID={ui("root").__uiid}
      style={styles.sidebarColumn}
    >
      <Section testID={ui("header").__uiid}>
        {header}
      </Section>
      <Section testID={ui("content").__uiid}>
        {collapsed ? collapsedContent : content}
      </Section>
      <Section testID={ui("footer").__uiid}>
        {footer}
      </Section>
    </View>
  );
}

export function PanelScaffold({
  ui = noopUi,
  header,
  content,
  footer,
  actions,
}: PanelScaffoldProps) {
  const showHeaderBand = hasContent(header) || hasContent(actions);

  return (
    <View
      nativeID={ui("root").__uiid}
      testID={ui("root").__uiid}
      style={styles.panel}
    >
      {showHeaderBand ? (
        <View
          nativeID={ui("header").__uiid}
          testID={ui("header").__uiid}
          style={styles.headerRow}
        >
          <View style={styles.panelHeader}>{header}</View>
          <View nativeID={ui("actions").__uiid} testID={ui("actions").__uiid} style={styles.actionsAlign}>
            {actions}
          </View>
        </View>
      ) : null}
      <Section testID={ui("content").__uiid}>
        {content}
      </Section>
      <Section testID={ui("footer").__uiid}>
        {footer}
      </Section>
    </View>
  );
}

export function PanelCollectionScaffold({
  ui = noopUi,
  header,
  items,
  actions,
}: PanelCollectionScaffoldProps) {
  const showHeaderBand = hasContent(header) || hasContent(actions);

  return (
    <View
      nativeID={ui("root").__uiid}
      testID={ui("root").__uiid}
      style={styles.collection}
    >
      {showHeaderBand ? (
        <View nativeID={ui("header").__uiid} testID={ui("header").__uiid} style={styles.headerRow}>
          <View style={styles.panelHeader}>{header}</View>
          <View nativeID={ui("actions").__uiid} testID={ui("actions").__uiid} style={styles.actionsAlign}>
            {actions}
          </View>
        </View>
      ) : null}
      <View nativeID={ui("items").__uiid} testID={ui("items").__uiid} style={styles.collectionItems}>
        {items}
      </View>
    </View>
  );
}

export function PageScaffold({
  ui = noopUi,
  header,
  sidebar,
  content,
  footer,
  sidebarPlacement = "left",
}: PageScaffoldProps) {
  const viewport = useViewport();
  const bodyDirection = viewport.isMobile ? "column" : "row";
  const sidebarWidth = viewport.isMobile ? "100%" : workspaceShell.sidebarWidth;
  const sidebarSlot = sidebar ? (
    <View
      data-uiid={ui("sidebar").__uiid}
      style={[
        styles.sidebarRail,
        {
          width: sidebarWidth,
        },
      ]}
    >
      {sidebar}
    </View>
  ) : null;

  return (
    <View
      testID={ui("root").__uiid}
      style={styles.pageRoot}
    >
      {hasContent(header) ? (
        <View
          nativeID={ui("header").__uiid}
          testID={ui("header").__uiid}
          style={styles.pageBand}
        >
          {header}
        </View>
      ) : null}
      <View
        style={[
          styles.pageBody,
          {
            flexDirection: bodyDirection,
          },
        ]}
      >
        {sidebarPlacement === "left" ? sidebarSlot : null}
        <View
          nativeID={ui("content").__uiid}
          testID={ui("content").__uiid}
          style={styles.pageContent}
        >
          {content}
        </View>
        {sidebarPlacement === "right" ? sidebarSlot : null}
      </View>
      {hasContent(footer) ? (
        <View
          nativeID={ui("footer").__uiid}
          testID={ui("footer").__uiid}
          style={styles.pageBand}
        >
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = {
  section: {
    width: "100%",
  },
  headerRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  headerEdge: {
    flexShrink: 0,
  },
  headerTitle: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
  },
  actionsAlign: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flexShrink: 0,
  },
  panel: {
    width: "100%",
    minWidth: 0,
  },
  panelHeader: {
    flex: 1,
    minWidth: 0,
  },
  collection: {
    width: "100%",
    minWidth: 0,
  },
  collectionItems: {
    width: "100%",
  },
  sidebarColumn: {
    width: "100%",
  },
  pageRoot: {
    flex: 1,
    width: "100%",
  },
  pageBand: {
    width: "100%",
  },
  pageBody: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },
  pageContent: {
    flex: 1,
    minWidth: 0,
  },
  sidebarRail: {
    flexShrink: 0,
  },
} as const;
