/**
 * Theme configuration for EmployeeHub.
 * Follows clean and premium dark mode tokens using an Indigo/Teal/Slate color palette.
 */

export const COLORS = {
  // Brand Colors
  primary: '#6366F1', // Electric Indigo
  primaryLight: '#818CF8',
  secondary: '#06B6D4', // Cyan/Teal Neon
  secondaryLight: '#22D3EE',

  // System Backgrounds (Premium Slate Dark Scheme)
  background: '#0B0F19', // Deep dark slate
  cardBackground: '#171E2E', // Lighter container slate
  border: '#1F2937', // Subdued border
  divider: '#374151',

  // Status & Semantics
  success: '#10B981', // Emerald green
  successLight: '#D1FAE5',
  warning: '#F59E0B', // Amber gold
  error: '#F43F5E', // Vibrant rose
  errorLight: '#FFE4E6',

  // Text Hierarchy
  textPrimary: '#F9FAFB', // White/Near white
  textSecondary: '#9CA3AF', // Muted grey
  textMuted: '#6B7280', // Darker grey for helper text
  textOnPrimary: '#FFFFFF',
};

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    jumbo: 32,
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  subtle: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
};

export const THEME = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};
