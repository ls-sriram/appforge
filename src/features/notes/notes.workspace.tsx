import React from "react";
import { useNotesViewModel } from "./notes.viewmodel";
import { NotesView } from "./notes.view";

export function NotesWorkspace() {
  const { state, actions } = useNotesViewModel();
  return <NotesView state={state} actions={actions} />;
}
