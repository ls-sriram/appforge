export interface DockPanelContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  header: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  title: {
    color: string;
  };
  content: {
    backgroundColor: string;
  };
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
  itemButton: {
    minWidth: number;
    minHeight: number;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
    gap: number;
    activeBackgroundColor: string;
    inactiveBackgroundColor: string;
    disabledOpacity: number;
  };
  itemIcon: {
    size: number;
    selectedColor: string;
    unselectedColor: string;
    disabledColor: string;
  };
  rail: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    gap: number;
    padding: number;
    collapsedWidth: number;
  };
  menuButton: {
    width: number;
    height: number;
  };
  splitterGrip: {
    size: number;
    thickness: number;
    color: string;
  };
  layout: {
    inlineActionsMarginRight: number;
    contentGap: number;
  };
}
