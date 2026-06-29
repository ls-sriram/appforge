export interface SizingToolbarContract {
  container: {
    borderWidth: number;
    borderColor: string;
    borderRadius: number;
    disabledOpacity: number;
  };
  button: {
    minWidth: number;
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    selectedBackgroundColor: string;
    unselectedBackgroundColor: string;
    dividerWidth: number;
    dividerColor: string;
  };
  icon: {
    selectedColor: string;
    unselectedColor: string;
    size: number;
  };
}
