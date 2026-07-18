export const lightColors = {
  background: '#F6F7FB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  textFaint: '#9CA3AF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  primary: '#1D4ED8',
  primaryLight: '#93C5FD',
  success: '#16A34A',
  warning: '#CA8A04',
  danger: '#EF4444',
  strike: '#38BDF8',
  strikeBg: '#F0F9FF',
  activeGuess: '#FACC15',
  activeGuessBg: '#FFFBEB',
  hint: '#7C3AED',
  hintBg: '#F5F3FF',
  pill: '#EEF2FF',
  pillBorder: '#E0E7FF',
  pillGood: '#ECFDF5',
  pillGoodBorder: '#A7F3D0',
  pillBad: '#FEF2F2',
  pillBadBorder: '#FECACA',
  keyAction: '#111827',
  keyUsed: '#F3F4F6',
  modalBackdrop: 'rgba(17, 24, 39, 0.55)',
  switchOff: '#D1D5DB',
  switchOn: '#93C5FD',
  switchThumb: '#F9FAFB',
  gridSep: '#D1D5DB',
  onPrimary: '#FFFFFF',
} as const;

export const darkColors = {
  background: '#0F172A',
  surface: '#1E293B',
  text: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textFaint: '#64748B',
  border: '#334155',
  borderLight: '#1E293B',
  primary: '#3B82F6',
  primaryLight: '#1D4ED8',
  success: '#22C55E',
  warning: '#EAB308',
  danger: '#F87171',
  strike: '#38BDF8',
  strikeBg: '#0C4A6E',
  activeGuess: '#FACC15',
  activeGuessBg: '#422006',
  hint: '#A78BFA',
  hintBg: '#2E1065',
  pill: '#1E3A5F',
  pillBorder: '#1D4ED8',
  pillGood: '#14532D',
  pillGoodBorder: '#166534',
  pillBad: '#450A0A',
  pillBadBorder: '#991B1B',
  keyAction: '#334155',
  keyUsed: '#0F172A',
  modalBackdrop: 'rgba(0, 0, 0, 0.7)',
  switchOff: '#475569',
  switchOn: '#3B82F6',
  switchThumb: '#F8FAFC',
  gridSep: '#475569',
  onPrimary: '#FFFFFF',
} as const;

export type ThemeColors = {
  readonly [K in keyof typeof lightColors]: string;
};

/** @deprecated Use useTheme().colors instead */
export const colors = lightColors;

export const spacing = {
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 16,
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  pill: 999,
} as const;
