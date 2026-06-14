import React from "react";
import { MetricCard, MetricCardConfig } from "./MetricCard";
import { Block } from "../primitives"

export function OverviewMetricsStrip({ metrics }: { metrics: MetricCardConfig[] }) {
  return (
    <Block>
      <Block >
        <Block direction="horizontal" space="xs" wrap>
          {metrics.map((metric) => (
            <MetricCard key={metric.label} config={metric} />
          ))}
        </Block>
      </Block>
    </Block>
  );
}
