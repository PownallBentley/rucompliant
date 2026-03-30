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
- shadcn/ui component library (Radix UI + Tailwind) with 12 core components
- Design system documentation (`docs/design.md`) — placeholder for master tokens
- Separate `vitest.config.ts` for clean TypeScript compilation
