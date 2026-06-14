import React from "react";
import { QuickActionCard, QuickActionTone } from "./QuickActionCard";
import { Block, IconName } from "../primitives"

export interface QuickActionItem {
  id: string;
  icon: IconName;
  label: string;
  tone?: QuickActionTone;
  onPress: () => void;
}

export function QuickActionsGrid({ items }: { items: QuickActionItem[] }) {
  const pairs: QuickActionItem[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }

  return (
    <Block>
      <Block >
        <Block space="sm">
          {pairs.map((row, rowIndex) => (
            <Block direction="horizontal" key={`row-${rowIndex}`} space="sm">
              {row.map((action) => (
                <Block key={action.id} >
                  <QuickActionCard
                    icon={action.icon}
                    label={action.label}
                    tone={action.tone}
                    onPress={action.onPress}
                  />
                </Block>
              ))}
              {row.length === 1 ? <Block  /> : null}
            </Block>
          ))}
        </Block>
      </Block>
    </Block>
  );
}
