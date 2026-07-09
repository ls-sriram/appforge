import { z } from "zod";
import type { TableColumn, TableContract } from "./Table";

// Curated documentation schema only — NOT a type replacement. Table<Row> is
// generic over its row type: `columns`, `rows`, and `rowKey` are all
// parameterized by Row (TableColumn<Row>[], Row[], (row: Row, index:
// number) => string). Zod schemas describe closed shapes, not open generic
// type parameters, so those three stay z.custom rather than being narrowed
// to a specific Row. Only the genuinely non-generic fields are meaningfully
// described here.
export const TableSchema = z.object({
  contract: z.custom<TableContract>(),
  columns: z.custom<TableColumn<unknown>[]>(),
  rows: z.custom<unknown[]>(),
  rowKey: z.custom<(row: unknown, index: number) => string>(),
  layout: z.string().optional(),
  striped: z.boolean().default(false),
  emptyLabel: z.string().default("No rows."),
});
