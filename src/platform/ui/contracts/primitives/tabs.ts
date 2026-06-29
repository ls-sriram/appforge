export interface TabsContract {
  list: {
    borderWidth: number;
    borderColor: string;
  };
  item: {
    minHeight: number;
    paddingHorizontal: number;
    paddingVertical: number;
    gap: number;
    borderWidth: number;
    selectedBorderColor: string;
    unselectedBorderColor: string;
    disabledOpacity: number;
  };
  icon: {
    size: number;
    selectedColor: string;
    unselectedColor: string;
  };
  text: {
    fontSize: number;
    lineHeight: number;
    selectedColor: string;
    unselectedColor: string;
    selectedFontFamily: string;
    unselectedFontFamily: string;
  };
}
