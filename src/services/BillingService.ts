import { Result } from "../core/types";
import { api } from "./ApiClient";

export type CheckoutPaymentType = "subscription" | "one_time";

export interface PricingCard {
  id: string;
  priceId: string;
  name: string;
  duration: string;
  price: string;
  originalPrice?: string;
  savings?: string;
  description: string;
  featured: boolean;
  monthlyPrice?: string;
  features: string[];
}

interface PricingCardsResponsePayload {
  cards: Array<{
    id: string;
    priceId: string;
    name: string;
    duration: string;
    price: string;
    originalPrice?: string;
    savings?: string;
    description: string;
    featured?: boolean;
    monthlyPrice?: string;
    features?: string[];
  }>;
}

interface CheckoutResponsePayload {
  sessionId: string;
  url?: string;
}

interface CheckoutRequestPayload {
  priceId: string;
  paymentType: CheckoutPaymentType;
  customerEmail: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
}

export interface BillingService {
  listPricingCards(): Promise<Result<PricingCard[]>>;
  createCheckoutSession(payload: CheckoutRequestPayload): Promise<Result<{ sessionId: string; url?: string }>>;
}

export class BackendBillingService implements BillingService {
  async listPricingCards(): Promise<Result<PricingCard[]>> {
    const result = await api.get<PricingCardsResponsePayload>("/billing/pricing-cards");
    if (!result.ok) return { ok: false, error: result.error };

    return {
      ok: true,
      data: (result.data.cards ?? []).map((card) => ({
        id: card.id,
        priceId: card.priceId,
        name: card.name,
        duration: card.duration,
        price: card.price,
        originalPrice: card.originalPrice || undefined,
        savings: card.savings || undefined,
        description: card.description,
        featured: card.featured === true,
        monthlyPrice: card.monthlyPrice || undefined,
        features: card.features ?? [],
      })),
    };
  }

  async createCheckoutSession(
    payload: CheckoutRequestPayload,
  ): Promise<Result<{ sessionId: string; url?: string }>> {
    const result = await api.post<CheckoutResponsePayload>("/billing/checkout", {
      priceId: payload.priceId,
      paymentType: payload.paymentType,
      customerEmail: payload.customerEmail,
      ...(payload.successUrl ? { successUrl: payload.successUrl } : {}),
      ...(payload.cancelUrl ? { cancelUrl: payload.cancelUrl } : {}),
      ...(payload.metadata ? { metadata: payload.metadata } : {}),
    });

    if (!result.ok) return { ok: false, error: result.error };
    return {
      ok: true,
      data: {
        sessionId: result.data.sessionId,
        url: result.data.url || undefined,
      },
    };
  }
}
