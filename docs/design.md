# Design System

> **Status**: Integrated — RUCompliant brand palette, component library, and dark mode are in place.

This document defines the visual language and component conventions for RUCompliant. All UI work must follow these guidelines.

## Design Principles (from PRD)

1. **Plain English first** — Every screen must be completable by a non-technical user (Persona 1 — Sarah, 52, sole trader) without reading more than 3 sentences
2. **Mobile-first** — Design for iPhone-sized screens first, then scale up
3. **Reassure, don't alarm** — The product must reassure as well as inform
4. **One thing at a time** — Single question per screen, not long forms. Large tap targets. No dropdowns where buttons will do.
5. **Trust the user** — "Mark as done" buttons are always visible. We don't gate progress behind proof.

## Component Library

- **shadcn/ui** (Radix UI primitives + Tailwind CSS)
- **Lucide React** for icons (via `AppIcon` wrapper)
- **Manrope** for all text (body and headings) — the only permitted font

### shadcn Primitives

| Component | Import | Use case |
|-----------|--------|----------|
| `Dialog` | `@/components/ui/dialog` | Confirmations, modals |
| `Input` | `@/components/ui/input` | Form text fields |
| `Textarea` | `@/components/ui/textarea` | Multi-line form fields |
| `Label` | `@/components/ui/label` | Form labels |
| `Progress` | `@/components/ui/progress` | Progress bars (Radix) |
| `Separator` | `@/components/ui/separator` | Section dividers |
| `Skeleton` | `@/components/ui/skeleton` | Loading placeholders |
| `Tooltip` | `@/components/ui/tooltip` | Jargon definitions (PRD requirement) |
| `DropdownMenu` | `@/components/ui/dropdown-menu` | Context menus |
| `Tabs` | `@/components/ui/tabs` | Content sections, settings |
| `Select` | `@/components/ui/select` | Dropdown selects |
| `Sheet` | `@/components/ui/sheet` | AI Advisor flyout panel |
| `Switch` | `@/components/ui/switch` | Boolean toggles |
| `Accordion` | `@/components/ui/accordion` | Collapsible sections |
| `Table` | `@/components/ui/table` | Data tables |

### Custom Components

All custom components use shadcn tokens and can be imported from `@/components/ui`:

| Component | Use case |
|-----------|----------|
| `Button` | Primary actions, CTAs — extends shadcn with variants |
| `Card` | Content containers, domain breakdowns — extends shadcn with variants |
| `Alert` | Notifications, warnings — extends shadcn with variants |
| `Badge` | Status indicators, tags — extends shadcn with variants |
| `Modal` | Dialog wrapper with standard layout |
| `FormField` | Input + Label + error state composition |
| `Toggle` | Styled toggle switch |
| `AppIcon` | Lucide icon wrapper with named lookup |
| `LoadingSpinner` | Spinner with size/variant options |
| `EmptyState` | Empty content placeholder |
| `ProgressBar` | Custom progress bar with colour/size options |
| `StatCard` | Metric display card |
| `IconCircle` | Circular icon container |
| `CircularProgress` | Circular progress indicator |
| `AvatarCircle` | User avatar with initials fallback |
| `ThemeToggle` | Dark/light mode switcher |
| `DropdownMenu` (custom) | Higher-level dropdown with item config |
| `Toast` / `useToast` | Toast notification system |

### Shared Feature Components

Reusable components in `src/components/shared/` used across multiple modules:

| Component | Use case |
|-----------|----------|
| `RagStatus` | RAG status indicator (dot/badge/card/large) — Health Score, domains, tasks, Advisor confidence |
| `TaskList` / `TaskItem` | Task list with 3 variants (checklist/timeline/compact) — Dashboard, Concierge, Calendar |
| `QuestionFlow` / `QuestionStep` | Multi-step question flow with 5 step types — Onboarding, contract generator |

Settings components in `src/components/settings/`:

| Component | Use case |
|-----------|----------|
| `SettingsCard` | Card wrapper with title + description for settings sections |
| `SettingsField` | Labelled input field with consistent styling |
| `SettingsToggle` | Toggle switch with label + description |
| `AvatarUpload` | Drag-drop image upload with zoom/reposition |

Calendar components in `src/components/calendar/`:

| Component | Use case |
|-----------|----------|
| `CalendarHeader` | Month/year navigation, today button, list/month view toggle |
| `MonthGrid` | Month grid view with coloured urgency dots per day |

Vault components in `src/components/vault/`:

| Component | Use case |
|-----------|----------|
| `DocumentUpload` | Upload modal with drag-drop, category selector, expiry date, file validation |
| `DocumentList` | Document rows with file icons, badges, expiry coding, download/delete |

### Adding New shadcn Components

```bash
npx shadcn@latest add <component-name>
```

## Colour System

### Brand Palette

Defined as CSS custom properties in `src/styles/themes.css` using HSL format for Tailwind opacity modifier support (e.g. `bg-primary/10`).

| Token | Light | Dark | Hex | Use |
|-------|-------|------|-----|-----|
| `--primary` | Magenta | Magenta (lighter) | `#E43F6F` | ALL CTAs, active nav, primary interactive |
| `--secondary` | Dusk Blue | Dusk Blue (lighter) | `#345995` | Info states, links, tooltips |
| `--page` | Porcelain | Dark bg | `#FFFFFC` | ALL page/layout backgrounds |
| `--surface` | Light surface | Dark surface | `#F8F8F5` | Subtle section backgrounds |

Full hex scales available in `src/constants/colors.ts` (magenta, dusk, emerald, neutral).

### Health Score RAG Status

These colours are **semantic only** — never used for branding, hover states, or decoration:

```
status-green:  #48BF84 (Emerald)  — All clear, no outstanding actions
status-amber:  #F0A500            — Attention needed, upcoming or slightly overdue
status-red:    #CC2200            — Urgent action required
```

**Rules**:
- Colour alone must NEVER convey information. Always pair with text + icon (WCAG 2.1 AA).
- Status chips must include a text label alongside the colour indicator.
- Emerald is semantic green only — never apply it to CTAs, buttons, links, or decorative elements.

### Backgrounds & Surfaces

- **Page background**: Always Porcelain (`#FFFFFC` / `bg-page`). No `bg-white` on page layouts.
- **Card interior**: White (`#FFFFFF`) is permitted inside cards/modals only.
- **Sidebar**: Always pure black (`#000000`). No other background colour.

### Semantic Colours (CSS variables)

Defined in `src/styles/themes.css` using HSL colour space:
- `--page` / `--surface` — Page background, subtle section bg
- `--primary` / `--primary-foreground` — Primary actions (Magenta)
- `--secondary` / `--secondary-foreground` — Info states (Dusk Blue)
- `--muted` / `--muted-foreground` — Subdued content
- `--destructive` — Danger/delete actions (`#CC2200`)
- `--success` / `--warning` / `--info` — Semantic status
- `--border` / `--input` / `--ring` — Form elements (0.5px `#E5E5E0`)
- `--card` / `--popover` — Elevated surfaces

## Typography

### Font
- **Manrope** — The only permitted font for all text (body and headings)
- Loaded via Google Fonts in `src/styles/globals.css`
- No Inter, Roboto, Geist, or system-ui as primary font

### Scale

Defined as CSS custom properties in `src/styles/themes.css`:

| Token | Size | Use |
|-------|------|-----|
| `text-2xs` | 0.625rem (10px) | Fine print |
| `text-xs` | 0.75rem (12px) | Captions |
| `text-sm` | 0.875rem (14px) | Secondary text |
| `text-base` | 1rem (16px) | Body text |
| `text-lg` | 1.125rem (18px) | Lead text |
| `text-xl` | 1.25rem (20px) | Heading 3 |
| `text-2xl` | 1.5rem (24px) | Heading 2 |
| `text-3xl` | 1.875rem (30px) | Heading 1 |
| `text-4xl` | 2.25rem (36px) | Display |

## Spacing

Using Tailwind's default spacing scale (4px base unit):
- `p-4` (16px) — Standard padding
- `gap-4` (16px) — Standard gap
- `space-y-6` (24px) — Section spacing
- `py-8` (32px) — Page section padding

## Border Radius

Defined as CSS variable `--radius: 0.625rem` (10px):
- `rounded-lg` — Cards, large containers
- `rounded-md` — Buttons, inputs
- `rounded-sm` — Badges, small elements
- `rounded-xl` / `rounded-2xl` — Feature cards
- `rounded-pill` — Pills, full-round elements

## Responsive Breakpoints

Mobile-first using custom screen config:
- Default: Mobile (< 375px)
- `xs:` — 375px+ (iPhone-sized — **primary design target**)
- `sm:` — 640px+ (large phones, small tablets)
- `md:` — 768px+ (tablets)
- `lg:` — 1024px+ (desktop)
- `xl:` — 1280px+ (large desktop)

## Borders & Shadows

### Borders
- Default border: **0.5px solid `#E5E5E0`** (`border-border`)
- All cards, inputs, and dividers use 0.5px
- Only featured/highlighted cards use 2px borders

### Shadows
- **No decorative shadows** on cards, buttons, or containers
- Only two permitted shadows:
  - `shadow-advisor` — AI Advisor panel: `0 0 24px rgba(0,0,0,0.12)`
  - `shadow-focus` — Focus rings: `0 0 0 2px hsl(var(--ring) / 0.4)`

## Section Labels

The **only** ALL CAPS text permitted in the UI:
- Font: Manrope 700
- Size: 10px (0.625rem)
- Letter-spacing: 0.8px
- CSS class: `.section-label`
- Remove ALL CAPS from headings, buttons, nav items, and all other elements

## Dark Mode

Supported via `class` strategy (Tailwind `darkMode: 'class'`). Dark mode tokens defined in `src/styles/themes.css` under `.dark` class. Toggle available via `ThemeToggle` component and `ThemeProvider` context (`src/contexts/ThemeContext.tsx`).

## File Structure

```
src/styles/
├── globals.css          # Entry point — imports themes.css, Tailwind directives
└── themes.css           # All CSS custom properties (light + dark tokens)

src/constants/
└── colors.ts            # Hex colour constants for JS usage

src/contexts/
└── ThemeContext.tsx      # Dark/light mode provider + useTheme hook

src/components/ui/
├── index.ts             # Barrel export for all components
├── [component].tsx      # shadcn primitives (lowercase)
└── [Component].tsx      # Custom composites (PascalCase)
```
