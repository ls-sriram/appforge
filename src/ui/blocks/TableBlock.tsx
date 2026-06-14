import React from "react";
import { Block, MetaText, Text, Skeleton } from "../primitives"
import { Panel } from "../panels";

export interface TableColumn {
  key: string;
  title: string;
  flex?: number;
}

export interface TableRow extends Record<string, string | number> {}

export interface TableBlockConfig {
  columns: TableColumn[];
  rows: TableRow[];
  rowKey: string;
  limit?: number;
}

interface TableBlockProps {
  config: TableBlockConfig;
  loading?: boolean;
  onRowPress?: (row: TableRow) => void;
}

export function TableBlock({ config, loading = false, onRowPress }: TableBlockProps) {
  const rows = config.limit ? config.rows.slice(0, config.limit) : config.rows;

  if (loading) {
    return (
      <Block>
        <Panel>
          <Block space="sm">
            <Skeleton height={16} variant="text" width="40%" />
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} height={14} variant="text" />
            ))}
          </Block>
        </Panel>
      </Block>
    );
  }

  if (!rows.length) {
    return (
      <Block>
        <Panel>
          <Text variant="bodySm">No data</Text>
        </Panel>
      </Block>
    );
  }

  return (
    <Block>
      <Panel>
        <Block space="sm">
          <Block direction="horizontal" justify="space-between" space="sm">
            {config.columns.map((col) => (
              <MetaText key={col.key}>{col.title}</MetaText>
            ))}
          </Block>
          {rows.map((row) => (
            <Block direction="horizontal"
              key={String(row[config.rowKey])}
              justify="space-between"
              space="sm"
              onTouchEnd={onRowPress ? () => onRowPress(row) : undefined}
            >
              {config.columns.map((col) => (
                col.key === "status" ? (
                  <MetaText key={col.key}>{row[col.key] ?? "—"}</MetaText>
                ) : (
                  <Text key={col.key} variant="bodySm">
                    {row[col.key] ?? "—"}
                  </Text>
                )
              ))}
            </Block>
          ))}
        </Block>
      </Panel>
    </Block>
  );
}
