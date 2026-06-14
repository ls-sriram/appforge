import { useEffect, useMemo, useState } from "react";
import { Alert, Linking } from "react-native";
import { BackendBillingService, type CheckoutPaymentType, type PricingCard } from "../../services/BillingService";
import { BackendUserProfileService, type Plan } from "../../services/UserProfileService";

export interface UpgradePageState {
  identityEmail: string;
  currentPlan?: Plan;
  pricingCards: PricingCard[];
  loading: boolean;
  pricingError?: string;
  checkoutBusyId?: string;
}

export function useUpgradePage() {
  const billingService = useMemo(() => new BackendBillingService(), []);
  const profileService = useMemo(() => new BackendUserProfileService(), []);
  const [state, setState] = useState<UpgradePageState>({
    identityEmail: "",
    pricingCards: [],
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setState((current) => ({ ...current, loading: true, pricingError: undefined }));

      const cardsResult = await billingService.listPricingCards();
      if (!cancelled) {
        if (cardsResult.ok) {
          setState((current) => ({ ...current, pricingCards: cardsResult.data, loading: false }));
        } else {
          setState((current) => ({ ...current, pricingCards: [], pricingError: cardsResult.error, loading: false }));
          Alert.alert("Billing", cardsResult.error);
        }
      }

      const profileResult = await profileService.getFullProfile();
      if (cancelled) return;
      if (profileResult.ok && profileResult.data?.identity?.email) {
        setState((current) => ({
          ...current,
          identityEmail: profileResult.data?.identity?.email ?? "",
          currentPlan: profileResult.data?.plan ?? undefined,
        }));
      } else {
        console.warn("[upgrade] missing identity email from profile", {
          profileOk: profileResult.ok,
          hasIdentity: Boolean(profileResult.ok && profileResult.data?.identity),
        });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [billingService, profileService]);

  const checkout = async (card: PricingCard) => {
    if (!state.identityEmail) {
      console.warn("[upgrade] checkout blocked due to missing identity email");
      Alert.alert("Billing", "Missing account email. Please sign in again.");
      return;
    }
    const paymentType: CheckoutPaymentType = card.id.includes("annual") ? "one_time" : "subscription";
    setState((current) => ({ ...current, checkoutBusyId: card.id }));
    const result = await billingService.createCheckoutSession({
      priceId: card.id,
      paymentType,
      customerEmail: state.identityEmail,
      metadata: {
        source: "upgrade_page",
      },
    });
    setState((current) => ({ ...current, checkoutBusyId: undefined }));

    if (!result.ok) {
      Alert.alert("Billing", result.error);
      return;
    }
    if (!result.data.url) {
      Alert.alert("Billing", "Checkout URL not returned.");
      return;
    }

    const canOpen = await Linking.canOpenURL(result.data.url);
    if (!canOpen) {
      Alert.alert("Billing", "Cannot open checkout URL on this device.");
      return;
    }
    await Linking.openURL(result.data.url);
  };

  return {
    state,
    checkout,
  };
}
