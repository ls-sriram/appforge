import React from "react";
import { DimensionValue, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../theme/ThemeProvider";
import { useViewport } from "../../theme/Viewport";
import { Block, Icon, IconName, IconSize, IconTone, MetaText, TapTarget, Text } from "../primitives"

export interface NavigationTileGridItem {
  id: string;
  label: string;
  icon: IconName;
}

export interface NavigationTileGridProps {
  items: NavigationTileGridItem[];
  activeId?: string;
  onPress: (id: string) => void;
}

const tileTones = ["accent", "action", "deadline", "warning", "success", "info"] as const;

function resolveTileTone(index: number, active: boolean, theme: ReturnType<typeof useTheme>) {
  const c = theme.colors;
  if (active) {
    return {
      background: c.accentMuted,
      border: c.accent,
      icon: "accent" as const,
    };
  }

  switch (tileTones[index % tileTones.length]) {
    case "accent":
      return { background: c.accentMuted, border: c.borderSubtle, icon: "accent" as const };
    case "action":
      return { background: c.actionAccentMuted, border: c.borderSubtle, icon: "action" as const };
    case "deadline":
      return { background: c.alertAccentMuted, border: c.borderSubtle, icon: "danger" as const };
    case "warning":
      return { background: c.warningMuted, border: c.borderSubtle, icon: "warning" as const };
    case "success":
      return { background: c.successAccentMuted, border: c.borderSubtle, icon: "success" as const };
    case "info":
    default:
      return { background: c.infoMuted, border: c.borderSubtle, icon: "info" as const };
  }
}

function GridViewport({
  paddingHorizontal,
  paddingTop,
  paddingBottom,
  children,
}: {
  paddingHorizontal: number;
  paddingTop: number;
  paddingBottom: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.content,
        {
          paddingHorizontal,
          paddingTop,
          paddingBottom,
        },
      ]}
    >
      {children}
    </View>
  );
}

function GridItemShell({
  width,
  gap,
  children,
}: {
  width: DimensionValue;
  gap: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.gridItem,
        {
          width,
          paddingLeft: gap / 2,
          paddingRight: gap / 2,
          paddingBottom: gap,
        },
      ]}
    >
      {children}
    </View>
  );
}

function NavigationTileSurface({
  height,
  backgroundColor,
  borderColor,
  borderRadius,
  padding,
  gap,
  children,
}: {
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderRadius: number;
  padding: number;
  gap: number;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.tile,
        {
          height,
          backgroundColor,
          borderColor,
          borderRadius,
          padding,
          gap,
        },
      ]}
    >
      {children}
    </View>
  );
}

function TileIconBox({
  width,
  height,
  borderRadius,
  backgroundColor,
  children,
}: {
  width: number;
  height: number;
  borderRadius: number;
  backgroundColor: string;
  children: React.ReactNode;
}) {
  return (
    <View
      style={[
        styles.iconBox,
        {
          width,
          height,
          borderRadius,
          backgroundColor,
        },
      ]}
    >
      {children}
    </View>
  );
}

export function NavigationTileGrid({ items, activeId, onPress }: NavigationTileGridProps) {
  const theme = useTheme();
  const viewport = useViewport();
  const insets = useSafeAreaInsets();
  const columns = viewport.isMobile ? 2 : 3;
  const rows = Math.ceil(items.length / columns);
  const gap = viewport.isMobile ? theme.colors.space.xs : theme.colors.space.sm;
  const itemWidth: DimensionValue = `${100 / columns}%`;
  const topPadding = viewport.isMobile ? insets.top + theme.colors.space.xs : theme.colors.space.lg;
  const bottomPadding = viewport.isMobile ? theme.colors.space.sm : theme.colors.space.lg;
  const horizontalPadding = viewport.isMobile ? theme.colors.space.sm : theme.colors.space.md;
  const mobileHeaderHeight = 38;
  const mobileBottomNavReserve = 92;
  const mobileGridBudget =
    viewport.height - mobileBottomNavReserve - topPadding - bottomPadding - mobileHeaderHeight - theme.colors.space.sm;
  const mobileTileHeight = Math.min(94, Math.max(72, Math.floor((mobileGridBudget - gap * rows) / rows)));
  const tileHeight = viewport.isMobile ? mobileTileHeight : 154;
  const iconSize: IconSize = viewport.isMobile ? "lg" : "3xl";
  const iconBoxSize = viewport.isMobile ? 34 : 44;
  const tileContentGap = viewport.isMobile ? theme.colors.space.xxs : theme.colors.space.sm;

  return (
    <Block frame="fill" paint="page">
      <GridViewport
        paddingHorizontal={horizontalPadding}
        paddingTop={topPadding}
        paddingBottom={bottomPadding}
      >
        <Block space={viewport.isMobile ? "sm" : "lg"}>
          <Block space="xxs">
            <Text variant={viewport.isMobile ? "h3" : "pageTitle"}>Explore</Text>
            <MetaText tone="secondary">Jump into the tools you need next.</MetaText>
          </Block>
          <Block direction="horizontal" wrap frame="expand">
            {items.map((item, index) => {
              const active = item.id === activeId;
              const tone = resolveTileTone(index, active, theme);

              return (
                <GridItemShell key={item.id} width={itemWidth} gap={gap}>
                  <TapTarget onPress={() => onPress(item.id)}>
                    <NavigationTileSurface
                      height={tileHeight}
                      backgroundColor={theme.colors.surfaceAlt}
                      borderColor={tone.border}
                      borderRadius={theme.colors.radii.md}
                      padding={viewport.isMobile ? theme.colors.space.xs : theme.colors.space.md}
                      gap={tileContentGap}
                    >
                      <TileIconBox
                        width={iconBoxSize}
                        height={iconBoxSize}
                        borderRadius={theme.colors.radii.sm}
                        backgroundColor={tone.background}
                      >
                        <Icon name={item.icon} size={iconSize} tone={tone.icon} />
                      </TileIconBox>
                      <Text variant={viewport.isMobile ? "bodySm" : "displayLg"} weight="semibold" numberOfLines={2}>
                        {item.label}
                      </Text>
                    </NavigationTileSurface>
                  </TapTarget>
                </GridItemShell>
              );
            })}
          </Block>
        </Block>
      </GridViewport>
    </Block>
  );
}

const styles = StyleSheet.create({
  // content: safe-area-aware flex:1 wrapper — cannot be Block (inset-derived padding)
  content: {
    flex: 1,
  },
  // gridItem, tile, iconBox: computed pixel values (viewport %, theme.space, safe area) — cannot be token
  gridItem: {
    minWidth: 0,
  },
  tile: {
    borderWidth: 1,
    overflow: "hidden",
    justifyContent: "flex-start",
  },
  iconBox: {
    alignItems: "center",
    justifyContent: "center",
  },
});
