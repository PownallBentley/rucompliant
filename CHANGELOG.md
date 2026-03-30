# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Migrated design system from generic blue to RUCompliant brand palette
- Primary colour: Magenta (`#E43F6F`) replaces Blue (`#3B82F6`) for all CTAs and interactive elements
- Secondary colour: Dusk Blue (`#345995`) for info states, links, tooltips
- Page background: Porcelain (`#FFFFFC`) replaces white
- Sidebar: Pure black (`#000000`)
- RAG status colours updated: Green (`#48BF84`), Amber (`#F0A500`), Red (`#CC2200`)
- Font: Manrope replaces DM Sans as the only permitted font
- Removed all decorative shadows from cards, buttons, tooltips, dropdowns, switches
- Default border width changed to 0.5px solid `#E5E5E0`
- Added `section-label` CSS class for the only permitted ALL CAPS text
- Only `shadow-advisor` (AI panel) and `shadow-focus` (focus rings) shadows remain
- Updated Tailwind config with magenta, dusk, emerald scales and status tokens
- Updated all component token usage (button, card, badge, alert, dialog, toast, etc.)
- Updated CLAUDE.md, docs/design.md, and docs/engineering.md with RUCompliant brand guidelines
- `/feature-done` skill now enforces documentation review before tests
- Removed unsupported `allowed-tools` frontmatter from skill files

### Removed
- Unused `@fontsource-variable/geist` dependency

### Added
- App shell with Sidebar (black), AppLayout, PublicLayout, MobileNav (F-003)
- ProtectedRoute guard redirecting unauthenticated users to /auth
- 9 placeholder pages: Landing, Auth, AuthCallback, Onboarding, Dashboard, Concierge, Calendar, Documents, Settings
- Full route structure: public routes via PublicLayout, protected routes via AppLayout
- Floating "Ask Advisor" button placeholder in AppLayout
- Full landing page with 7 sections matching UX design (F-023): Hero, Trust Strip, Problem, How It Works, Pricing, Final CTA, Footer
- 8 reusable landing components: LandingNav, HeroHealthCard, EmailSignup, TrustBadges, StatStrip, SectionHeader, FeatureCard, NumberedStep, PricingCard, LandingFooter
- Landing page renders outside PublicLayout (full-width with own nav)
- Reusable `RagStatus` component with 4 variants: dot, badge, card, large (F-004)
- WCAG 2.1 AA compliant — every variant pairs colour with text label + icon
- Core database schema (Migration 001) with 13 tables, RLS policies, indexes, and updated_at triggers
- 8 custom enums: business_type, health_status, task_type, action_type, message_role, plan_type, subscription_status, document_category
- Seed data: 6 compliance domains, 3 concierge stages
- Tables: business_profiles, compliance_domains, compliance_domain_scores, health_scores, concierge_stages, concierge_tasks, user_concierge_progress, task_calendar, documents, advisor_conversations, advisor_messages, subscriptions, notification_preferences

- Initial project scaffolding with Vite + React 18 + TypeScript
- Tailwind CSS v3 configuration with RUCompliant brand colours and Manrope font
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
- Colour constants (`src/constants/colors.ts`) for JS usage
- ThemeContext provider with dark/light mode toggle
- Barrel export (`src/components/ui/index.ts`) for all UI components
- Design system documentation (`docs/design.md`)
- Separate `vitest.config.ts` for clean TypeScript compilation
