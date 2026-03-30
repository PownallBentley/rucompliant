// src/constants/colors.ts
// Centralized color constants matching Tailwind theme

export const COLORS = {
  // Primary colors — RUCompliant Blue
  primary: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    300: "#93C5FD",
    400: "#60A5FA",
    500: "#3B82F6",
    600: "#2563EB", // Main brand color
    700: "#1D4ED8",
    800: "#1E40AF",
    900: "#1E3A8A",
  },

  // Neutral colors
  neutral: {
    0: "#FFFFFF",
    50: "#F9FAFC",
    100: "#F6F7FB",
    200: "#E1E4EE",
    300: "#CFD3E0",
    400: "#A8AEBD",
    500: "#6C7280",
    600: "#4B5161",
    700: "#1F2330",
    800: "#121420",
    900: "#050611",
  },

  // Accent colors
  accent: {
    green: "#22C55E",
    amber: "#F59E0B",
    red: "#EF4444",
    blue: "#3B82F6",
    purple: "#7C3AED",
    pink: "#EC4899",
    orange: "#F97316",
    lime: "#84CC16",
    indigo: "#6366F1",
  },

  // Semantic colors
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",

  // Chart colors (for data visualization)
  chart: [
    "#3B82F6", // primary
    "#60A5FA", // primary-400
    "#93C5FD", // primary-300
    "#22C55E", // success
    "#F59E0B", // warning
    "#EF4444", // danger
  ],
} as const;

// Compliance Health Score colors (RAG status)
export const HEALTH_SCORE_COLORS = {
  green: COLORS.accent.green,
  amber: COLORS.accent.amber,
  red: COLORS.accent.red,
} as const;

// Status colors
export const STATUS_COLORS = {
  on_track: COLORS.accent.green,
  needs_attention: COLORS.accent.amber,
  behind: COLORS.accent.red,
  completed: COLORS.accent.purple,
  not_started: COLORS.neutral[400],
} as const;
