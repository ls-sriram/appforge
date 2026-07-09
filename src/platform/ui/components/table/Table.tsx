import React from "react";
import { Image, type ImageSourcePropType } from "react-native";
import { View } from "@tamagui/core";
import { useLayout } from "../../theme/DensityProvider";
import { Avatar, type AvatarContract } from "../avatar/Avatar";
import { Badge, type BadgeContract } from "../badge/Badge";
import { Body, Label } from "../text/Text";
import { Tag, type TagContract } from "../tag/Tag";

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
  contract: TagContract;
};

export type TableBadgeCell = {
  type: "badge";
  label: string;
  contract: BadgeContract;
};

export type TableAvatarCell = {
  type: "avatar";
  initials: string;
  contract: AvatarContract;
};

import type { ImageContract, TableContract } from "./table.styles";
export type { ImageContract, TableContract };
export { TableSchema } from "./table.contract";


export type TableImageCell = {
  type: "image";
  src: ImageSourcePropType;
  alt: string;
  contract: ImageContract;
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
  contract: TableContract;
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
  tableVariant: TableContract,
) {
  switch (spec.type) {
    case "tag":
      return <Tag contract={spec.contract} label={spec.label} />;
    case "badge":
      return <Badge contract={spec.contract} label={spec.label} />;
    case "avatar":
      return <Avatar contract={spec.contract} initials={spec.initials} />;
    case "image": {
      const image = spec.contract;
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
          color={spec.color ?? tableVariant.cell.color}
          fontFamily={spec.fontFamily ?? tableVariant.cell.fontFamily}
          fontSize={spec.fontSize ?? tableVariant.cell.fontSize}
          lineHeight={spec.lineHeight ?? tableVariant.cell.lineHeight}
        >
          {spec.value}
        </Body>
      );
  }
}

export function Table<Row>({
  contract,
  columns,
  rows,
  rowKey,
  layout,
  striped = false,
  emptyLabel = "No rows.",
}: TableProps<Row>) {
  const tableLayout = useLayout(layout);
  const tableVariant = contract;

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
                {renderCell(spec, row, tableVariant)}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}
