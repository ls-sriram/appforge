export interface NotesItemModel {
  id: string;
  title: string;
}

export interface NotesViewState {
  loading: boolean;
  title: string;
  items: NotesItemModel[];
}

export interface NotesViewActions {
  onSelect: (id: string) => void;
}
