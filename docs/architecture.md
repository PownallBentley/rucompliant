# System Architecture

## Overview

RUCompliant is a single-page application (SPA) hosted on Vercel, backed by Supabase as a unified backend-as-a-service. There is no custom API server — all backend logic runs through Supabase Edge Functions, PostgreSQL Row Level Security, and Realtime subscriptions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                    VERCEL (CDN)                       │
│  ┌───────────────────────────────────────────────┐   │
│  │  React 18 + TypeScript + Tailwind CSS         │   │
│  │  Vite build → Static assets                    │   │
│  │  React Router v6 (client-side routing)        │   │
│  │  Zustand (state management)                    │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │ HTTPS
┌─────────────────────▼───────────────────────────────┐
│                    SUPABASE                           │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  PostgreSQL  │  │    Auth     │  │   Storage   │  │
│  │  + pgvector  │  │ Magic Link  │  │  Doc Vault  │  │
│  │  + RLS       │  │  OAuth      │  │             │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐                    │
│  │   Realtime   │  │    Edge     │                    │
│  │ Health Score │  │  Functions  │                    │
│  │ live updates │  │  (Deno/TS)  │                    │
│  └─────────────┘  └──────┬──────┘                    │
└──────────────────────────┼──────────────────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
         ┌────────┐  ┌────────┐  ┌────────┐
         │ Stripe │  │ Resend │  │ Claude │
         │Payments│  │ Email  │  │  API   │
         └────────┘  └────────┘  └────────┘
```

## Layers

### Frontend (Vercel)

- **Framework**: React 18 with TypeScript in strict mode
- **Build**: Vite with ESBuild for dev, Rollup for production
- **Styling**: Tailwind CSS v3 (utility-first, JIT compiler)
- **State**: Zustand for global state (auth, sidebar, health score, notification queue)
- **Routing**: React Router v6 with nested routes for module layouts
- **Deployment**: Automatic from GitHub — every push to `main` deploys to production, PRs get preview deployments

### Backend (Supabase)

Supabase replaces what would traditionally be a separate API server, auth service, file storage, and real-time layer.

**PostgreSQL Database**
- All application data
- pgvector extension for AI Advisor semantic search (Phase 3+)
- Row Level Security (RLS) on every table — no data access without valid auth
- Migrations managed via Supabase CLI

**Auth**
- Magic link (email-based, no passwords) as primary auth method
- OAuth providers as secondary option
- Session management handled by Supabase client
- Auth state synced to Zustand `useAuthStore`

**Storage**
- Document Vault file storage (PDF, JPG, PNG up to 25MB)
- Bucket-level access policies tied to auth

**Realtime**
- Health Score live updates via Supabase Realtime subscriptions
- Dashboard reflects changes without page refresh

**Edge Functions** (Deno/TypeScript)
- Stripe webhook handling (subscription events, payment confirmations)
- Email sending via Resend (compliance reminders, digest emails, escalation alerts)
- Assessment scoring logic
- AI Advisor query processing (Phase 3+)

### External Services

**Stripe** — Subscription billing
- Monthly (£49.99) and annual (£499.99) plans
- 14-day free trial, no credit card at signup
- Stripe Customer Portal for self-serve billing
- Webhook events processed by Edge Functions

**Resend** — Transactional email
- Escalating deadline reminders (30/14/7/3/overdue)
- Monthly digest emails
- Account and billing notifications
- React Email templates for consistent branding

**Anthropic Claude API** (Phase 3+)
- AI Advisor responses
- Document analysis
- Regulatory knowledge base queries via pgvector RAG

## Security Model

1. **Authentication**: Magic link (no stored passwords)
2. **Authorisation**: Row Level Security on all Supabase tables
3. **Data isolation**: Users can only access their own business data
4. **API keys**: Supabase anon key is safe to expose (RLS enforces access)
5. **Secrets**: Stripe secret key, Resend API key, Claude API key stored in Supabase Edge Function secrets — never exposed to frontend
6. **HTTPS**: Enforced on all connections (Vercel + Supabase)

## Data Model (Key Tables)

```
users                    # Supabase auth.users (managed by Supabase Auth)
business_profiles        # Business type, headcount, VAT status, sector
compliance_domains       # The 6 compliance domains (Tax, Legal, Employment, etc.)
compliance_tasks         # Individual compliance obligations per business
task_calendar            # Auto-generated statutory deadlines
health_scores            # Current and historical RAG scores
concierge_stages         # Journey progress (Stages 1-3)
concierge_tasks          # Individual tasks within each stage
documents                # Document Vault metadata (files in Supabase Storage)
advisor_conversations    # AI Advisor chat history
subscriptions            # Stripe subscription state (synced via webhooks)
```

> Detailed schema will be defined in Supabase migrations as features are built.

## Deployment Pipeline

```
feature/* branch → PR to develop → Vercel preview deploy
develop → staging → Vercel staging deploy
staging → main → Vercel production deploy
```

Each PR gets an automatic preview URL from Vercel for testing.
