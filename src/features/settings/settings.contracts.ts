export interface SettingsShellStyle {
  container: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
  sectionTitle: {
    color: string;
    fontSize: number;
  };
  card: {
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
    borderRadius: number;
    padding: number;
  };
}

export interface ProfileBlockStyle {
  shell: SettingsShellStyle;
  avatar: {
    backgroundColor: string;
    textColor: string;
    textFontWeight: string;
    sizeSm: number;
    sizeMd: number;
    sizeLg: number;
  };
  email: {
    color: string;
    fontSize: number;
  };
  uid: {
    color: string;
    fontSize: number;
  };
  chevron: {
    color: string;
    size: number;
  };
}

export interface AccountBlockStyle {
  shell: SettingsShellStyle;
  icon: {
    color: string;
    size: number;
  };
  value: {
    color: string;
    fontSize: number;
  };
}

export interface PlanBlockStyle {
  shell: SettingsShellStyle;
  description: {
    color: string;
    fontSize: number;
  };
  badge: {
    paddingHorizontal: number;
    paddingVertical: number;
    textFontWeight: string;
  };
  renewCard: {
    gap: number;
  };
  planStatus: {
    activeBackgroundColor: string;
    activeColor: string;
    pastDueBackgroundColor: string;
    pastDueColor: string;
  };
  renewalIcon: {
    proColor: string;
    trialColor: string;
    defaultColor: string;
    size: number;
  };
}

export interface UsageBlockStyle {
  shell: SettingsShellStyle;
  metricValue: {
    color: string;
    fontSize: number;
  };
  bar: {
    trackColor: string;
    trackHeight: number;
    radius: number;
    primaryColor: string;
    warningColor: string;
    errorColor: string;
  };
}

export interface SettingsUiStyles {
  profile: ProfileBlockStyle;
  account: AccountBlockStyle;
  plan: PlanBlockStyle;
  usage: UsageBlockStyle;
}
