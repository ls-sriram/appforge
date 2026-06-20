import * as React from "react";
import { useRouter } from "expo-router";
import { useNotesData } from "./notes.hook";
import type { NotesViewActions, NotesViewState } from "./notes.model";

export function useNotesViewModel(): {
  state: NotesViewState;
  actions: NotesViewActions;
} {
  const router = useRouter();
  const data = useNotesData();

  const actions: NotesViewActions = React.useMemo(
    () => ({
      onSelect: (_id: string) => {
        void router;
      },
    }),
    [router],
  );

  return {
    state: {
      loading: data.loading,
      title: "Notes",
      items: data.items,
    },
    actions,
  };
}
