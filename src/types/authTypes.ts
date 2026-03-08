interface Theme {
  bg: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  textMuted: string;
  accent: string;
  accentGlow: string;
  inputBg: string;
  inputBorder: string;
  inputFocus: string;
  buttonBg: string;
  buttonText: string;
  toggleBg: string;
  shadow: string;
  starOpacity: number;
}

interface ToggleProps {
  isDark: boolean;
  onToggle: () => void;
  t: Theme;
}

export type { Theme, ToggleProps }