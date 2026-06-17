import React from "react";
import { Card, Col, Row, MetaText, Body, Skeleton } from "../primitives";

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
      <Card>
        <Col between="sm">
          <Skeleton height={16} variant="text" width="40%" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} height={14} variant="text" />
          ))}
        </Col>
      </Card>
    );
  }

  if (!rows.length) {
    return (
      <Card>
        <Body size="sm">No data</Body>
      </Card>
    );
  }

  return (
    <Card>
      <Col between="sm">
        <Row spread between="sm">
          {config.columns.map((col) => (
            <MetaText key={col.key}>{col.title}</MetaText>
          ))}
        </Row>
        {rows.map((row) => (
          <Row
            key={String(row[config.rowKey])}
            spread
            between="sm"
            onTouchEnd={onRowPress ? () => onRowPress(row) : undefined}
          >
            {config.columns.map((col) => (
              col.key === "status" ? (
                <MetaText key={col.key}>{row[col.key] ?? "—"}</MetaText>
              ) : (
                <Body key={col.key} size="sm">{String(row[col.key] ?? "—")}</Body>
              )
            ))}
          </Row>
        ))}
      </Col>
    </Card>
  );
}
