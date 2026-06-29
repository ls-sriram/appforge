import React from "react";
import { Image, type ImageSourcePropType } from "react-native";
import { View } from "@tamagui/core";
import { useLayout } from "../theme/DensityProvider";
import { useUI } from "../theme/ThemeProvider";
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

export type TableTextCell = {
  type?: "text";
  value: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
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

export interface ImageContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

export interface TableContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  header: {
    backgroundColor: string;
    paddingVertical: number;
    gap: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
  row: {
    contentPaddingHorizontal: number;
    dividerWidth: number;
    stripedBackgroundColor: string;
  };
  cellText: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  empty: {
    padding: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
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
  variant?: string;
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
  imageVariants: Record<string, ImageContract> | undefined,
  tableVariant: TableContract,
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
            width: image.frame.width,
            height: image.frame.height,
            borderRadius: image.frame.borderRadius,
          }}
        />
      );
    }
    case "custom":
      return spec.render(row);
    case "text":
    default:
      return (
        <Body
          color={spec.color ?? tableVariant.cellText.color}
          fontFamily={spec.fontFamily ?? tableVariant.cellText.fontFamily}
          fontSize={spec.fontSize ?? tableVariant.cellText.fontSize}
          lineHeight={spec.lineHeight ?? tableVariant.cellText.lineHeight}
        >
          {spec.value}
        </Body>
      );
  }
}

export function Table<Row>({
  columns,
  rows,
  rowKey,
  variant = "default",
  layout,
  striped = false,
  emptyLabel = "No rows.",
}: TableProps<Row>) {
  const ui = useUI();
  const tableLayout = useLayout(layout);
  const tableVariant = ui.contracts.table?.[variant];
  if (!tableVariant) throw new Error(`Unknown table variant "${variant}"`);

  if (rows.length === 0) {
    return (
      <View
        bg={tableVariant.container.backgroundColor}
        borderWidth={tableVariant.container.borderWidth}
        borderColor={tableVariant.container.borderColor}
        br={tableVariant.container.borderRadius}
        p={tableVariant.empty.padding}
      >
        <Body
          color={tableVariant.empty.textColor}
          fontFamily={tableVariant.empty.textFontFamily}
          fontSize={tableVariant.empty.textFontSize}
          lineHeight={tableVariant.empty.textLineHeight}
        >
          {emptyLabel}
        </Body>
      </View>
    );
  }

  return (
    <View
      bg={tableVariant.container.backgroundColor}
      borderWidth={tableVariant.container.borderWidth}
      borderColor={tableVariant.container.borderColor}
      br={tableVariant.container.borderRadius}
      overflow="hidden"
    >
      <View
        bg={tableVariant.header.backgroundColor}
        borderBottomWidth={tableVariant.row.dividerWidth}
        borderBottomColor={tableVariant.container.borderColor}
      >
        <View
          fd="row"
          ai="center"
          px={tableVariant.row.contentPaddingHorizontal}
          py={tableVariant.header.paddingVertical}
          gap={tableVariant.header.gap}
        >
          {columns.map((column) => (
            <View
              key={column.id}
              {...getCellLayout(column.width)}
              ai={getCellAlignment(column.align)}
            >
              <Label
                color={tableVariant.header.textColor}
                fontFamily={tableVariant.header.textFontFamily}
                fontSize={tableVariant.header.textFontSize}
                lineHeight={tableVariant.header.textLineHeight}
              >
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
          px={tableVariant.row.contentPaddingHorizontal}
          py={tableLayout.rowPadding}
          gap={tableLayout.cellGap}
          minHeight={tableLayout.rowHeight}
          bg={striped && index % 2 === 1 ? tableVariant.row.stripedBackgroundColor : "transparent"}
          borderTopWidth={index === 0 ? 0 : tableVariant.row.dividerWidth}
          borderTopColor={tableVariant.container.borderColor}
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
                {renderCell(spec, row, ui.contracts.image, tableVariant)}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
