import React from "react";

export type DesktopRepoState = {
  isDesktop: boolean;
  repoPath: string | null;
  repoName: string | null;
  repoValid: boolean;
  loaded: boolean;
  selecting: boolean;
};

const DEFAULT_STATE: DesktopRepoState = {
  isDesktop: false,
  repoPath: null,
  repoName: null,
  repoValid: false,
  loaded: true,
  selecting: false,
};

export function useDesktopRepoSource() {
  const [state, setState] = React.useState<DesktopRepoState>(() => {
    if (typeof window === "undefined" || !window.appforgeDesktop) {
      return DEFAULT_STATE;
    }

    return {
      isDesktop: true,
      repoPath: null,
      repoName: null,
      repoValid: false,
      loaded: false,
      selecting: false,
    };
  });

  React.useEffect(() => {
    if (typeof window === "undefined" || !window.appforgeDesktop) {
      return;
    }

    let mounted = true;

    window.appforgeDesktop.getState().then((next) => {
      if (!mounted) return;
      setState((current) => ({
        ...current,
        ...next,
        loaded: true,
      }));
    });

    const unsubscribe = window.appforgeDesktop.onStateChanged((next) => {
      if (!mounted) return;
      setState((current) => ({
        ...current,
        ...next,
        loaded: true,
        selecting: false,
      }));
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const selectRepoSource = React.useCallback(async () => {
    if (!window.appforgeDesktop) return;
    setState((current) => ({ ...current, selecting: true }));

    try {
      const next = await window.appforgeDesktop.selectRepoSource();
      setState((current) => ({
        ...current,
        ...next,
        loaded: true,
        selecting: false,
      }));
    } catch {
      setState((current) => ({ ...current, selecting: false }));
    }
  }, []);

  return {
    ...state,
    selectRepoSource,
  };
}
