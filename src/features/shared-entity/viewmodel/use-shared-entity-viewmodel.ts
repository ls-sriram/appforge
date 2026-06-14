import React from "react";
import { BackendPublicShareRepository } from "../../sharing";
import { SharedEntityViewData } from "../domain/model";
import { toSharedEntityViewData } from "../mapping/to-shared-entity-view-data";

const repository = new BackendPublicShareRepository();

export function useSharedEntityViewModel(token?: string) {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string>();
  const [data, setData] = React.useState<SharedEntityViewData>();

  React.useEffect(() => {
    let canceled = false;
    async function load() {
      setLoading(true);
      setError(undefined);
      setData(undefined);
      const shareToken = String(token ?? "").trim();
      const result = await repository.getByToken(shareToken);
      if (canceled) return;
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      const contentUrl = repository.buildContentUrl(result.data.share.token);
      setData(toSharedEntityViewData(result.data, contentUrl));
      setLoading(false);
    }
    void load();
    return () => {
      canceled = true;
    };
  }, [token]);

  return {
    state: {
      loading,
      error,
      data,
    },
  };
}
