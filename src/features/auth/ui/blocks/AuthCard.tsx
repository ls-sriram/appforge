import React from "react";
import { Card } from "../../../../ui/primitives";

export function AuthCard({ children }: { children: React.ReactNode }) {
  return <Card variant="neutral" pad="lg">{children}</Card>;
}
