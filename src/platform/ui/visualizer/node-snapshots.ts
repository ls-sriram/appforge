export type VisualizerNodeSnapshot = {
  type: string;
  label: string;
  props: Record<string, unknown>;
};

const snapshots = new Map<string, VisualizerNodeSnapshot>();

export function setNodeSnapshot(id: string, snapshot: VisualizerNodeSnapshot) {
  snapshots.set(id, snapshot);
}

export function clearNodeSnapshot(id: string) {
  snapshots.delete(id);
}

export function getNodeSnapshot(id: string) {
  return snapshots.get(id);
}

export function resetNodeSnapshots(prefix?: string) {
  if (!prefix) {
    snapshots.clear();
    return;
  }

  for (const key of snapshots.keys()) {
    if (key === prefix || key.startsWith(`${prefix}.`)) {
      snapshots.delete(key);
    }
  }
}
