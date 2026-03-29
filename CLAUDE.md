# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RUCompliant is a compliance-as-a-service SaaS platform for UK microbusinesses (sub-10 employees, sub-£2m revenue). It provides a Compliance Health Score (RAG status), guided Concierge Journey, Task Calendar with statutory deadlines, AI Advisor, Document Vault, and Stripe billing — all in plain English for non-technical users.

**PRD**: `docs/RUCompliant_PRD_v4.1.pdf` (39 pages, the source of truth for all product decisions)

## Tech Stack

- **Build**: Vite
- **Frontend**: React 18 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v3
- **State**: Zustand (stores in `src/stores/`)
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions + Realtime + RLS)
- **Payments**: Stripe (subscriptions, 14-day free trial, no card at signup)
- **Email**: Resend (via Supabase Edge Functions)
- **AI** (Phase 3+): Anthropic Claude API + pgvector for RAG-powered Advisor
- **Hosting**: Vercel (deployed from GitHub)

## Commands

```bash
npm run dev        # Start Vite dev server (localhost:5173)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

## Architecture

```
src/
├── components/     # React components (PascalCase files)
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks (useCamelCase)
├── services/       # API calls and business logic
├── stores/         # Zustand stores (camelCaseStore.ts)
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
├── context/        # React context providers
└── lib/            # Client singletons (supabase.ts, stripe.ts)

supabase/
├── functions/      # Edge Functions (Deno/TypeScript)
├── migrations/     # SQL migrations
└── config.toml     # Supabase local config

docs/
├── RUCompliant_PRD_v4.1.pdf   # Product Requirements Document
├── architecture.md             # System architecture
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
- **Styling**: Tailwind utility classes only. Brand colours defined in `tailwind.config.js` (`brand-*`, `status-green/amber/red`).
- **Health Score**: Three states — Green (all clear), Amber (attention needed), Red (urgent action). This is the core UX concept.
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
