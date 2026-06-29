export interface TabbedPanelContract {
  actionButton: {
    minWidth: number;
    minHeight: number;
    borderRadius: number;
    disabledOpacity: number;
  };
  actionIcon: {
    size: number;
    color: string;
    disabledColor: string;
  };
  layout: {
    inlineActionsMarginRight: number;
  };
}
