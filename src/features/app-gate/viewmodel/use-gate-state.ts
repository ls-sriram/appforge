import { useSessionContext } from "@providers/SessionProvider";

export type GateState = {
  loading: boolean;
  authenticated: boolean;
  onboardingComplete: boolean;
};

export function useGateState() {
  const { loading, authenticated, onboardingComplete } = useSessionContext();
  return {
    loading,
    authenticated,
    onboardingComplete,
  } as GateState;
}
