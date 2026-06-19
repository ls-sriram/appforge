const { contextBridge, ipcRenderer } = require("electron");

function sanitizeState(state) {
  if (!state || typeof state !== "object") {
    return {
      isDesktop: true,
      repoPath: null,
      repoName: null,
      repoValid: false,
    };
  }

  return {
    isDesktop: true,
    repoPath: typeof state.repoPath === "string" ? state.repoPath : null,
    repoName: typeof state.repoName === "string" ? state.repoName : null,
    repoValid: state.repoValid === true,
  };
}

contextBridge.exposeInMainWorld("appforgeDesktop", {
  getState: async () => sanitizeState(await ipcRenderer.invoke("appforge-desktop:get-state")),
  selectRepoSource: async () =>
    sanitizeState(await ipcRenderer.invoke("appforge-desktop:select-repo-source")),
  saveFile: async (payload) => ipcRenderer.invoke("appforge-desktop:save-file", payload),
  listApps: async () => ipcRenderer.invoke("appforge-desktop:list-apps"),
  scanApp: async (payload) => ipcRenderer.invoke("appforge-desktop:scan-app", payload),
  onStateChanged: (listener) => {
    const wrapped = (_event, state) => listener(sanitizeState(state));
    ipcRenderer.on("appforge-desktop:state-changed", wrapped);
    return () => ipcRenderer.removeListener("appforge-desktop:state-changed", wrapped);
  },
});
