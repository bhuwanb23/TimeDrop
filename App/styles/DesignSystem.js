import { StyleSheet } from 'react-native';

// Design System Constants
export const COLORS = {
  // Primary Colors
  primary: '#007AFF',          // Main brand color (blue)
  primaryLight: '#74B9FF',     // Light blue for backgrounds
  primaryDark: '#0056b3',      // Dark blue for buttons
  
  // Secondary Colors
  secondary: '#34C759',        // Success/green
  secondaryLight: '#00B894',   // Teal
  secondaryDark: '#00A085',    // Dark teal
  
  // Accent Colors
  accent: '#FF9500',           // Warning/orange
  accentLight: '#FFEAA7',      // Light yellow
  accentDark: '#D35400',       // Dark orange
  
  // Status Colors
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#74B9FF',
  
  // Neutral Colors
  white: '#FFFFFF',
  light: '#f8f9fa',            // Light background
  grayLight: '#f0f0f0',        // Light gray
  gray: '#ccc',                // Medium gray
  grayDark: '#666',            // Dark gray
  dark: '#333',                // Dark text
  black: '#000000',
  
  // Backgrounds
  background: '#f5f5f5',
  cardBackground: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  textInverted: '#FFFFFF',
};

export const TYPOGRAPHY = {
  // Font sizes
  h1: 28,
  h2: 24,
  h3: 20,
  body: 16,
  bodySmall: 14,
  caption: 12,
  
  // Font weights
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 40,
};

export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  circle: 50,
};

export const SHADOW = {
  shadowColor: COLORS.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

// Common styles that can be reused across components
export const COMMON_STYLES = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.m,
    margin: SPACING.m,
    ...SHADOW,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.m,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.m,
  },
  buttonText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textInverted,
  },
  input: {
    height: 50,
    backgroundColor: COLORS.grayLight,
    borderRadius: BORDER_RADIUS.small,
    paddingHorizontal: SPACING.m,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textPrimary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textPrimary,
    marginLeft: SPACING.s,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: SPACING.m,
  },
});

export default {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  BORDER_RADIUS,
  SHADOW,
  COMMON_STYLES,
};