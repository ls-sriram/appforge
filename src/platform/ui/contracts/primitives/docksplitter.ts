export interface DockSplitterContract {
  container: {
    thickness: number;
    minHitSize: number;
    backgroundColor: string;
    activeBackgroundColor: string;
    disabledOpacity: number;
  };
  grip: {
    length: number;
    thickness: number;
    borderRadius: number;
    color: string;
  };
}
