import React from "react";
import { MetricCard, MetricCardConfig } from "./MetricCard";
import { Row } from "../primitives";

export function OverviewMetricsStrip({ metrics }: { metrics: MetricCardConfig[] }) {
  return (
    <Row between="xs" flexWrap="wrap">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} config={metric} />
      ))}
    </Row>
  );
}
