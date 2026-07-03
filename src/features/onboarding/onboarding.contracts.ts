export interface FeatureHighlightStyle {
  layout: {
    rootGap: number;
    copyGap: number;
  };
  frame: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  icon: {
    color: string;
    size: number;
  };
  description: {
    color: string;
  };
}

export interface OnboardingHeroStyle {
  layout: {
    gap: number;
  };
  subtitle: {
    color: string;
  };
}

export interface OnboardingProgressStyle {
  layout: {
    gap: number;
  };
  backIcon: {
    color: string;
    size: number;
  };
  label: {
    fontSize: number;
  };
}

export interface OnboardingPromptStyle {
  text: {
    fontWeight: string;
  };
}

export interface OnboardingStepperStyle {
  label: {
    color: string;
    fontSize: number;
  };
}

export interface OnboardingUiStyles {
  featureHighlight: FeatureHighlightStyle;
  hero: OnboardingHeroStyle;
  progress: OnboardingProgressStyle;
  prompt: OnboardingPromptStyle;
  stepper: OnboardingStepperStyle;
}
