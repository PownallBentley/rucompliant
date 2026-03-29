# RUCompliant

Compliance that has your back. A compliance-as-a-service platform built for UK microbusinesses — businesses with fewer than 10 employees and under £2 million in annual revenue.

## What is RUCompliant?

RUCompliant is a compliance concierge that knows what obligations apply to your specific business, tells you when action is needed, guides you through every step, and remembers everything so you don't have to.

### Core Features

- **Compliance Health Score** — A single RAG (Green/Amber/Red) indicator showing your compliance status at a glance
- **Concierge Journey** — Guided walkthrough through every formation and setup obligation, in plain English
- **Task Calendar** — Personalised, auto-populated calendar of every statutory deadline
- **AI Advisor** — Contextual, RAG-powered compliance assistant with confidence indicators
- **Document Vault** — Upload, categorise, and store compliance documents with expiry tracking
- **Email Reminders** — Escalating notifications (30/14/7/3 days + overdue)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Build | Vite |
| Frontend | React 18 + TypeScript |
| Styling | Tailwind CSS v3 |
| State | Zustand |
| Routing | React Router v6 |
| Backend | Supabase (PostgreSQL, Auth, Storage, Edge Functions, Realtime) |
| Payments | Stripe |
| Email | Resend |
| Hosting | Vercel |

## Prerequisites

- Node.js 20+
- npm 10+
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase`)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/PownallBentley/rucompliant.git
   cd rucompliant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase and Stripe credentials
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | TypeScript check + production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build locally |

## Project Structure

```
src/
├── components/     # React UI components
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks
├── services/       # API and business logic
├── stores/         # Zustand state stores
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── context/        # React context providers
└── lib/            # Client singletons (Supabase, Stripe)
```

## Git Workflow

- `main` — Production (deployed to Vercel)
- `staging` — Pre-production testing
- `develop` — Integration branch
- `feature/*` — Feature branches (branch from `develop`)

All feature work happens on `feature/` branches, merged to `develop` via pull request.

## Documentation

- [Product Requirements Document](docs/RUCompliant_PRD_v4.1.pdf)
- [System Architecture](docs/architecture.md)
- [Engineering Standards](docs/engineering.md)
- [Changelog](CHANGELOG.md)

## License

Proprietary — All rights reserved.
