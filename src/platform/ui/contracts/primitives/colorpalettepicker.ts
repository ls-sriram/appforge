export interface ColorPalettePickerContract {
  preview: {
    size: number;
    borderWidth: number;
    borderRadius: number;
    borderColor: string;
    invalidBorderColor: string;
  };
  swatch: {
    size: number;
    borderWidth: number;
    borderRadius: number;
    borderColor: string;
    selectedBorderColor: string;
    disabledOpacity: number;
    defaultColors: string[];
  };
  input: {
    placeholder: string;
  };
  label: {
    color: string;
    fontSize: number;
    fontFamily: string;
  };
  helper: {
    color: string;
    fontSize: number;
    lineHeight: number;
    fontFamily: string;
  };
  error: {
    color: string;
  };
  icon: {
    selectedColor: string;
    selectedSize: number;
  };
}
