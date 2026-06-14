import { asIsoUtcTimestamp, type IsoUtcTimestamp } from "../../../core/dates";

export type PlanName = "free" | "trial" | "pro";
export type PlanStatus = "active" | "trialing" | "cancel_pending" | "past_due" | "canceled";

export interface PlanModel {
  name: PlanName;
  status: PlanStatus;
  expiresAt?: IsoUtcTimestamp;
  startedAt?: IsoUtcTimestamp;
  cancelAtPeriodEnd: boolean;
  checkoutUrl?: string;
}

export interface BackendPlanPayload {
  name?: string;
  status?: string;
  expiresAt?: string;
  startedAt?: string;
  cancelAtPeriodEnd?: boolean;
  checkoutUrl?: string;
}

const ALLOWED_PLAN_NAMES: ReadonlyArray<PlanName> = ["free", "trial", "pro"];
const ALLOWED_PLAN_STATUS: ReadonlyArray<PlanStatus> = [
  "active",
  "trialing",
  "cancel_pending",
  "past_due",
  "canceled",
];

function parsePlanName(value: string | undefined): PlanName {
  return ALLOWED_PLAN_NAMES.includes(value as PlanName) ? (value as PlanName) : "free";
}

function parsePlanStatus(value: string | undefined): PlanStatus {
  return ALLOWED_PLAN_STATUS.includes(value as PlanStatus) ? (value as PlanStatus) : "active";
}

export function parsePlanModel(payload: BackendPlanPayload | undefined): PlanModel | undefined {
  if (!payload) return undefined;

  const expiresAt = asIsoUtcTimestamp(payload.expiresAt) ?? undefined;
  const startedAt = asIsoUtcTimestamp(payload.startedAt) ?? undefined;

  return {
    name: parsePlanName(payload.name),
    status: parsePlanStatus(payload.status),
    expiresAt,
    startedAt,
    cancelAtPeriodEnd: payload.cancelAtPeriodEnd === true,
    checkoutUrl: payload.checkoutUrl || undefined,
  };
}
