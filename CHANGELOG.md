# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Initial project scaffolding with Vite + React 18 + TypeScript
- Tailwind CSS v3 configuration with brand colours and Inter font
- Supabase client setup (`src/lib/supabase.ts`)
- Stripe client setup (`src/lib/stripe.ts`)
- Zustand auth store (`src/stores/authStore.ts`)
- React Router v6 with base routing
- Path alias `@/` → `src/`
- Project documentation: CLAUDE.md, README.md, architecture.md, engineering.md
- Environment configuration: `.env.example`, `.gitignore`
- Git branch strategy: main/staging/develop/feature
- Vitest unit/component testing with React Testing Library
- Playwright E2E testing (Desktop Safari + Mobile iPhone 13)
- GitHub Actions CI pipeline (lint → build → unit tests → E2E)
- Claude Code `/test` skill for on-demand test runs
- Claude Code `/feature-done` skill for automated commit/PR workflow
- Claude Code `Stop` hook to auto-run tests when work completes
- shadcn/ui component library (Radix UI + Tailwind) with 15 primitives
- 14 custom composite components (Button, Card, Alert, Badge, Modal, FormField, Toggle, AppIcon, LoadingSpinner, EmptyState, ProgressBar, StatCard, IconCircle, CircularProgress, AvatarCircle, ThemeToggle, DropdownMenu, Toast)
- Design token system (`src/styles/themes.css`) with HSL CSS variables for light/dark mode
- RUCompliant Blue brand palette (`#3B82F6`) with RAG health score colours
- Colour constants (`src/constants/colors.ts`) for JS usage
- ThemeContext provider with dark/light mode toggle
- DM Sans as primary font (body and headings)
- Barrel export (`src/components/ui/index.ts`) for all UI components
- Design system documentation (`docs/design.md`)
- Separate `vitest.config.ts` for clean TypeScript compilation
