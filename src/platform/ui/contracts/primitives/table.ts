export interface ImageContract {
  frame: {
    width: number;
    height: number;
    borderRadius: number;
  };
}

export interface TableContract {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  header: {
    backgroundColor: string;
    paddingVertical: number;
    gap: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
  row: {
    contentPaddingHorizontal: number;
    dividerWidth: number;
    stripedBackgroundColor: string;
  };
  cellText: {
    color: string;
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
  };
  empty: {
    padding: number;
    textColor: string;
    textFontFamily: string;
    textFontSize: number;
    textLineHeight: number;
  };
}
