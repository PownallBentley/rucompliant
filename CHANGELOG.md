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
