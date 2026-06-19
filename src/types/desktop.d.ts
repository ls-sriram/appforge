export {};

declare global {
  interface Window {
    appforgeDesktop?: {
      getState: () => Promise<{
        isDesktop: true;
        repoPath: string | null;
        repoName: string | null;
        repoValid: boolean;
      }>;
      selectRepoSource: () => Promise<{
        isDesktop: true;
        repoPath: string | null;
        repoName: string | null;
        repoValid: boolean;
      }>;
      saveFile: (payload: {
        sourcePath: string;
        content: string;
      }) => Promise<{
        ok: true;
        path: string;
      }>;
      listApps: () => Promise<Array<{ id: string; displayName: string }>>;
      scanApp: (payload: { appId: string }) => Promise<{
        appId: string;
        documents: import("../apps/appforge-site/features/ui-visualizer/domain/ui-document.types").UiDocument[];
        blocks: import("../apps/appforge-site/features/ui-visualizer/domain/ui-document.types").UiBlock[];
      }>;
      onStateChanged: (
        listener: (state: {
          isDesktop: true;
          repoPath: string | null;
          repoName: string | null;
          repoValid: boolean;
        }) => void,
      ) => () => void;
    };
  }
}
