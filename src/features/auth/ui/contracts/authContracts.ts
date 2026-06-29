export interface AuthFieldStyle {
  layout: {
    gap: number;
  };
  frame: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
  };
  padding: {
    horizontal: number;
    vertical: number;
    gap: number;
  };
  icon: {
    color: string;
    size: number;
  };
  input: {
    textColor: string;
    placeholderColor: string;
    fontSize: number;
  };
  error: {
    textColor: string;
    fontSize: number;
  };
  states: {
    error: {
      frameBackgroundColor: string;
      frameBorderColor: string;
    };
  };
}

export interface AuthFormStyle {
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  layout: {
    contentGap: number;
    brandGap: number;
    brandRowGap: number;
    footerGap: number;
  };
  brandIcon: {
    color: string;
    size: number;
  };
  brandTitle: {
    fontWeight: string;
  };
  subtitle: {
    color: string;
  };
  terms: {
    color: string;
  };
  footerPrompt: {
    color: string;
    fontSize: number;
  };
  footerLink: {
    color: string;
    fontWeight: string;
  };
}

export interface AuthSubmitStyle {
  layout: {
    gap: number;
  };
  errorBox: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  errorText: {
    color: string;
    fontSize: number;
  };
}

export interface AuthWelcomeStyle {
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    paddingHorizontal: number;
    paddingVertical: number;
  };
  layout: {
    rootGap: number;
    copyGap: number;
    actionsGap: number;
  };
  eyebrow: {
    color: string;
    letterSpacing: number;
  };
  body: {
    color: string;
    fontSize: number;
    lineHeight: number;
  };
}

export interface AuthUiStyles {
  field: AuthFieldStyle;
  form: AuthFormStyle;
  submit: AuthSubmitStyle;
  welcome: AuthWelcomeStyle;
}
