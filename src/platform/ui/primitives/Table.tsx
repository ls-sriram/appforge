import React from "react";
import { Image, type ImageSourcePropType } from "react-native";
import { View } from "@tamagui/core";
import { useLayout } from "../../theme/DensityProvider";
import { useTheme } from "../../theme/ThemeProvider";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Body, Label } from "./Text";
import { Tag, type TagProps } from "./Tag";

export type TableWidth = "content" | "xs" | "sm" | "md" | "lg" | "xl" | "fill";
export type TableAlign = "start" | "center" | "end";
export type TableColumnKind =
  | "text"
  | "numeric"
  | "tag"
  | "badge"
  | "avatar"
  | "image"
  | "custom";

type TextTone = "primary" | "secondary" | "muted" | "accent" | "danger" | "success" | "warning" | "info";

export type TableTextCell = {
  type?: "text";
  value: string;
  tone?: TextTone;
};

export type TableTagCell = {
  type: "tag";
  label: string;
  variant: TagProps["variant"];
};

export type TableBadgeCell = {
  type: "badge";
  label: string;
  variant: string;
};

export type TableAvatarCell = {
  type: "avatar";
  initials: string;
  variant: string;
};

export interface ImageVariant {
  width: number;
  height: number;
  borderRadius: number;
}

export type TableImageCell = {
  type: "image";
  src: ImageSourcePropType;
  alt: string;
  variant: string;
};

export type TableCustomCell<Row> = {
  type: "custom";
  render: (row: Row) => React.ReactNode;
};

export type TableCellSpec<Row> =
  | TableTextCell
  | TableTagCell
  | TableBadgeCell
  | TableAvatarCell
  | TableImageCell
  | TableCustomCell<Row>;

export type TableColumn<Row> = {
  id: string;
  header: string;
  kind?: TableColumnKind;
  width?: TableWidth;
  align?: TableAlign;
  cell: (row: Row) => TableCellSpec<Row>;
};

export type TableProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row, index: number) => string;
  layout?: string;
  striped?: boolean;
  emptyLabel?: string;
};

const CELL_WIDTH: Record<Exclude<TableWidth, "content" | "fill">, number> = {
  xs: 72,
  sm: 120,
  md: 180,
  lg: 240,
  xl: 320,
};

const TEXT_TONE: Record<TextTone, React.ComponentProps<typeof Body>["tone"]> = {
  primary: "primary",
  secondary: "secondary",
  muted: "muted",
  accent: "accent",
  danger: "danger",
  success: "success",
  warning: "warning",
  info: "info",
};

function getCellLayout(width: TableWidth = "fill") {
  if (width === "fill") {
    return { flex: 1, minWidth: 0 };
  }
  if (width === "content") {
    return { flexGrow: 0, flexShrink: 0 };
  }
  return { width: CELL_WIDTH[width], flexGrow: 0, flexShrink: 0 };
}

function getCellAlignment(align: TableAlign = "start") {
  if (align === "center") return "center";
  if (align === "end") return "flex-end";
  return "flex-start";
}

function renderCell<Row>(
  spec: TableCellSpec<Row>,
  row: Row,
  imageVariants: Record<string, ImageVariant> | undefined,
) {
  switch (spec.type) {
    case "tag":
      return <Tag label={spec.label} variant={spec.variant} />;
    case "badge":
      return <Badge label={spec.label} variant={spec.variant} />;
    case "avatar":
      return <Avatar initials={spec.initials} variant={spec.variant} />;
    case "image": {
      const image = imageVariants?.[spec.variant];
      if (!image) throw new Error(`Unknown image variant "${spec.variant}"`);
      return (
        <Image
          source={spec.src}
          accessibilityLabel={spec.alt}
          style={{
            width: image.width,
            height: image.height,
            borderRadius: image.borderRadius,
          }}
        />
      );
    }
    case "custom":
      return spec.render(row);
    case "text":
    default:
      return (
        <Body tone={TEXT_TONE[spec.tone ?? "primary"]} size="sm">
          {spec.value}
        </Body>
      );
  }
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  layout,
  striped = false,
  emptyLabel = "No rows.",
}: TableProps<Row>) {
  const theme = useTheme();
  const tableLayout = useLayout(layout);

  if (rows.length === 0) {
    return (
      <View bg="$surfaceStrong" borderWidth={1} borderColor="$borderSubtle" br="$4" p="$4">
        <Body tone="muted">{emptyLabel}</Body>
      </View>
    );
  }

  return (
    <View bg="$surfaceStrong" borderWidth={1} borderColor="$borderSubtle" br="$4" overflow="hidden">
      <View bg="$surface" borderBottomWidth={1} borderBottomColor="$borderSubtle">
        <View fd="row" ai="center" px="$4" py="$3" gap="$3">
          {columns.map((column) => (
            <View
              key={column.id}
              {...getCellLayout(column.width)}
              ai={getCellAlignment(column.align)}
            >
              <Label tone="muted">
                {column.header}
              </Label>
            </View>
          ))}
        </View>
      </View>

      {rows.map((row, index) => (
        <View
          key={rowKey(row, index)}
          fd="row"
          ai="center"
          px="$4"
          py={tableLayout.rowPadding}
          gap={tableLayout.cellGap}
          minHeight={tableLayout.rowHeight}
          bg={striped && index % 2 === 1 ? "$surface" : "transparent"}
          borderTopWidth={index === 0 ? 0 : 1}
          borderTopColor="$borderSubtle"
        >
          {columns.map((column) => {
            const spec = column.cell(row);
            return (
              <View
                key={column.id}
                {...getCellLayout(column.width)}
                ai={getCellAlignment(column.align)}
                minWidth={0}
              >
                {renderCell(spec, row, theme.variants.image)}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
