# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RUCompliant is a compliance-as-a-service SaaS platform for UK microbusinesses (sub-10 employees, sub-£2m revenue). It provides a Compliance Health Score (RAG status), guided Concierge Journey, Task Calendar with statutory deadlines, AI Advisor, Document Vault, and Stripe billing — all in plain English for non-technical users.

**PRD**: `docs/RUCompliant_PRD_v4.1.pdf` (39 pages, the source of truth for all product decisions)

## Tech Stack

- **Build**: Vite
- **Frontend**: React 18 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v3 + shadcn/ui (Radix UI primitives)
- **UI Components**: shadcn/ui — add with `npx shadcn@latest add <component>`
- **State**: Zustand (stores in `src/stores/`)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions + Realtime + RLS)
- **Payments**: Stripe (subscriptions, 14-day free trial, no card at signup)
- **Email**: Resend (via Supabase Edge Functions)
- **AI** (Phase 3+): Anthropic Claude API + pgvector for RAG-powered Advisor
- **Hosting**: Vercel (deployed from GitHub)

## Commands

```bash
npm run dev           # Start Vite dev server (localhost:5173)
npm run build         # TypeScript check + production build
npm run lint          # ESLint
npm run preview       # Preview production build locally
npm run test          # Unit + component tests (Vitest)
npm run test:watch    # Watch mode for development
npm run test:coverage # Tests with coverage report
npm run test:e2e      # E2E tests (Playwright, starts dev server)
npm run test:all      # Run everything (unit + E2E)
```

## Custom Skills

- `/test` — Run test suite on demand (`/test`, `/test e2e`, `/test all`)
- `/feature-done` — Lint → test → build → commit → push → create PR to develop

## Design System

Full details in `docs/design.md`.

- **Font**: Manrope (loaded via Google Fonts in `src/styles/globals.css`). Only font. No Inter/Roboto/system-ui.
- **Tokens**: HSL CSS custom properties in `src/styles/themes.css` (light + dark mode)
- **Primary colour**: Magenta (`#E43F6F`) — ALL CTAs, active nav, interactive elements
- **Secondary colour**: Dusk Blue (`#345995`) — info states, links, tooltips
- **Page background**: Porcelain (`#FFFFFC`) via `bg-page`. No `bg-white` on page layouts.
- **Sidebar**: Always pure black (`#000000`)
- **RAG health score**: Green (`#48BF84`), Amber (`#F0A500`), Red (`#CC2200`) — semantic status only, never decorative
- **Borders**: 0.5px solid `#E5E5E0` default. Only featured cards use 2px.
- **Shadows**: None decorative. Only `shadow-advisor` (flyout panel) and `shadow-focus` (focus rings).
- **Section labels**: Only ALL CAPS text (10px / Manrope 700 / 0.8px letter-spacing). No other ALL CAPS.
- **Components**: 15 shadcn primitives + 14 custom composites, all importable from `@/components/ui`
- **Dark mode**: `ThemeProvider` + `useTheme` from `src/contexts/ThemeContext.tsx`. Tailwind `class` strategy.
- **CSS entry point**: `src/styles/globals.css` (imported in `main.tsx`)
- **Adding shadcn components**: `npx shadcn@latest add <component>`
- **Hex constants**: `src/constants/colors.ts` — magenta, dusk, emerald, neutral scales + status/chart colours

## Architecture

```
src/
├── components/     # React components
│   ├── ui/         # Design system (shadcn primitives + custom composites)
│   ├── layout/     # AppLayout, Sidebar, PublicLayout, MobileNav
│   ├── auth/       # ProtectedRoute, AuthProvider, MagicLinkSent
│   ├── dashboard/  # DomainBreakdown, NextActions
│   ├── calendar/   # CalendarHeader, MonthGrid
│   ├── vault/      # DocumentUpload, DocumentList
│   ├── concierge/  # StageSelector, StageProgress
│   ├── settings/   # SettingsCard, SettingsField, SettingsToggle, AvatarUpload
│   ├── landing/    # LandingNav, HeroHealthCard, EmailSignup, PricingCard, etc.
│   └── shared/     # Reusable feature components (RagStatus, TaskList, QuestionFlow)
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks (useCamelCase)
├── services/       # API calls and business logic
├── stores/         # Zustand stores (camelCaseStore.ts)
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
├── contexts/       # React context providers (ThemeContext)
├── constants/      # Static constants (colors.ts, icons.ts)
├── styles/         # CSS (globals.css, themes.css)
└── lib/            # Client singletons (supabase.ts, stripe.ts, utils.ts)

supabase/
├── functions/      # Edge Functions (Deno/TypeScript)
├── migrations/     # SQL migrations
└── config.toml     # Supabase local config

docs/
├── RUCompliant_PRD_v4.1.pdf   # Product Requirements Document
├── architecture.md             # System architecture
├── design.md                   # Design system documentation
└── engineering.md              # Engineering standards & workflow
```

## Git Workflow

- **Branches**: `main` (production) → `staging` → `develop` → `feature/*`
- **Feature work**: Always create `feature/descriptive-name` from `develop`
- **Commit format**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`)
- **After each feature**: Update `CHANGELOG.md` and relevant docs before merging
- **PRs**: Feature branches → `develop` via PR

## Key Conventions

- **Path alias**: `@/` maps to `src/` (e.g., `import { supabase } from '@/lib/supabase'`)
- **Auth**: Supabase Auth with magic link (no passwords). Auth state in `useAuthStore` Zustand store.
- **Database**: All tables use Row Level Security (RLS). Migrations via Supabase CLI.
- **Styling**: Tailwind utility classes only. Brand colours as CSS variables in `src/styles/themes.css`, Tailwind maps them in `tailwind.config.js`. See Design System section above.
- **Health Score**: Three RAG states — Green `#48BF84` (all clear), Amber `#F0A500` (attention needed), Red `#CC2200` (urgent action). Semantic only — never decorative.
- **Plain English**: No jargon without inline tooltips. Target audience is non-technical (see PRD Persona 1 — Sarah, sole trader, low tech confidence).
- **Mobile-first**: All layouts must work on iPhone-sized screens first, then scale up.

## Supabase

- **Project ref**: `mpiybsrrbfcppsvbbhrd`
- **Edge Functions**: TypeScript, deployed via `supabase functions deploy <name>`
- **Migrations**: Create with `supabase migration new <name>`, apply with `supabase db push`
- **Local dev**: `supabase start` for local Supabase stack

## Environment Variables

Required in `.env.local` (never committed):
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase publishable anon key
- `VITE_STRIPE_PUBLISHABLE_KEY` — Stripe publishable key
- `VITE_APP_URL` — App URL (default: http://localhost:5173)
