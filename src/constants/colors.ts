// src/constants/colors.ts
// RUCompliant brand colour constants matching Tailwind theme

export const COLORS = {
  // Primary — Magenta
  magenta: {
    50: "#FDE8EF",
    100: "#FBD1DF",
    200: "#F7A3BF",
    300: "#F2759F",
    400: "#E43F6F", // Main brand primary
    500: "#D1325F",
    600: "#B5294F",
    700: "#8F1F3D",
    800: "#69162D",
    900: "#430E1D",
  },

  // Secondary — Dusk Blue
  dusk: {
    50: "#E8EDF5",
    100: "#D1DBEB",
    200: "#A3B7D7",
    300: "#7593C3",
    400: "#4A70AB",
    500: "#345995", // Main dusk blue
    600: "#2B4A7B",
    700: "#213A61",
    800: "#172B47",
    900: "#0E1B2D",
  },

  // Neutral
  neutral: {
    0: "#FFFFFC",    // Porcelain (page bg)
    50: "#F8F8F5",   // Surface
    100: "#F0F0EC",
    200: "#E5E5E0",  // Border default
    300: "#CCCCCC",
    400: "#AAAAAA",
    500: "#888888",  // Muted text
    600: "#666666",
    700: "#333333",
    800: "#1A1A1A",
    900: "#000000",  // Black (sidebar, foreground)
  },

  // Emerald — semantic green only (RAG status)
  emerald: {
    50: "#E8F8F0",
    100: "#D1F1E1",
    200: "#A3E3C3",
    300: "#75D5A5",
    400: "#48BF84", // RAG Green
    500: "#3AA36F",
    600: "#2D875A",
    700: "#1F6B45",
    800: "#124F30",
    900: "#04331B",
  },

  // Semantic / Status — RAG only
  status: {
    green: "#48BF84",
    amber: "#F0A500",
    red: "#CC2200",
  },

  // Functional semantic aliases
  success: "#48BF84",
  warning: "#F0A500",
  danger: "#CC2200",
  info: "#345995",

  // Chart colors (data visualisation)
  chart: [
    "#E43F6F", // magenta (primary)
    "#48BF84", // emerald
    "#F0A500", // amber
    "#345995", // dusk blue
    "#8B5CF6", // violet
    "#CC2200", // red
  ],
} as const;

// Compliance Health Score colours (RAG status)
export const HEALTH_SCORE_COLORS = {
  green: COLORS.status.green,
  amber: COLORS.status.amber,
  red: COLORS.status.red,
} as const;

// Status colours
export const STATUS_COLORS = {
  on_track: COLORS.status.green,
  needs_attention: COLORS.status.amber,
  behind: COLORS.status.red,
  completed: COLORS.magenta[400],
  not_started: COLORS.neutral[400],
} as const;
