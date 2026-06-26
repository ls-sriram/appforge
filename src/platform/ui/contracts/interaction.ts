export interface InteractionContract {
  disabledOpacity?: number;

  hover?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    opacity?: number;
    scale?: number;
    shadow?: string;
  };

  pressed?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    opacity?: number;
    scale?: number;
    shadow?: string;
  };

  focused?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    borderWidth?: number;
    shadow?: string;
  };

  selected?: {
    backgroundColor?: string;
    borderColor?: string;
    color?: string;
    shadow?: string;
  };

  loading?: {
    opacity?: number;
  };
}
