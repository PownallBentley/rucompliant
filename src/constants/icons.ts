// src/constants/icons.ts
// Centralized icon system for consistent icon usage across the app

import type { IconKey } from "../components/ui/AppIcon";

/**
 * Icon Size Constants
 * Use these for consistent icon sizing across the app
 */
export const ICON_SIZES = {
  xs: "w-3 h-3",      // 12px - tiny badges, inline text
  sm: "w-4 h-4",      // 16px - buttons, chips, small cards
  base: "w-5 h-5",    // 20px - default size, most UI elements
  lg: "w-6 h-6",      // 24px - larger buttons, prominent icons
  xl: "w-8 h-8",      // 32px - hero sections, empty states
  "2xl": "w-10 h-10", // 40px - large cards, avatars
  "3xl": "w-12 h-12", // 48px - very large UI elements
} as const;

export type IconSize = keyof typeof ICON_SIZES;

/**
 * Get icon size class by size key
 * @example getIconSize('sm') → 'w-4 h-4'
 */
export function getIconSize(size: IconSize = 'base'): string {
  return ICON_SIZES[size];
}

/**
 * Status Icon Mapping
 * Icons used for different status states
 */
export const STATUS_ICONS = {
  not_started: "circle",
  started: "clock",
  in_progress: "clock",
  completed: "check-circle",
  skipped: "minus",
  on_track: "check-circle",
  behind: "flame",
  needs_attention: "triangle-alert",
  complete: "check-circle",
} as const;

/**
 * Get status icon by status key
 */
export function getStatusIcon(status?: string): IconKey {
  if (!status) return "circle";
  const normalized = status.toLowerCase().replace(/_/g, '_');
  return (STATUS_ICONS[normalized as keyof typeof STATUS_ICONS] || "circle") as IconKey;
}

/**
 * Common icon usage patterns by context
 * Reference for which icons to use where
 */
export const ICON_USAGE = {
  navigation: {
    back: "arrow-left",
    forward: "arrow-right",
    close: "x",
    menu: "grip-vertical",
    expand: "chevron-down",
    collapse: "chevron-right",
  },
  actions: {
    add: "plus",
    remove: "minus",
    edit: "pencil",
    delete: "trash-2",
    save: "save",
    settings: "settings",
    search: "search",
    filter: "sliders-horizontal",
  },
  time: {
    calendar: "calendar",
    clock: "clock",
    deadline: "calendar-clock",
    completed_date: "calendar-check",
    blocked: "calendar-x",
    timer: "hourglass",
  },
  feedback: {
    success: "check-circle",
    error: "triangle-alert",
    warning: "triangle-alert",
    info: "info",
    loading: "loader",
  },
  content: {
    idea: "lightbulb",
    tip: "lightbulb",
    message: "message-circle",
    book: "book",
    reading: "book-open",
    learning: "graduation-cap",
  },
  progress: {
    target: "target",
    trophy: "trophy",
    star: "star",
    flame: "flame",
    growth: "sprout",
    trend_up: "trending-up",
    trend_down: "trending-down",
  },
  user: {
    profile: "user",
    logout: "log-out",
    security: "shield",
    lock: "lock",
    unlock: "unlock",
    email: "mail",
  },
} as const;
