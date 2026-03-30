# Design System

> **Status**: Integrated — brand tokens, component library, and dark mode are in place.

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
- **DM Sans** for all text (body and headings)

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

### Adding New shadcn Components

```bash
npx shadcn@latest add <component-name>
```

## Colour System

### Brand Colours

Defined as CSS custom properties in `src/styles/themes.css` using HSL format for Tailwind opacity modifier support (e.g. `bg-primary/10`).

```
Primary (light): hsl(217, 91%, 60%)  → #3B82F6 (RUCompliant Blue)
Primary (dark):  hsl(217, 91%, 70%)  → #60A5FA (Blue-400)
```

Full palette available in `src/constants/colors.ts`.

### Health Score RAG Status

These colours are core to the product and are used throughout:

```
status-green:  #22C55E  — All clear, no outstanding actions
status-amber:  #F59E0B  — Attention needed, upcoming or slightly overdue
status-red:    #EF4444  — Urgent action required
```

**Rule**: Colour alone must NEVER convey information. Always pair with text + icon (WCAG 2.1 AA).

### Semantic Colours (CSS variables)

Defined in `src/styles/themes.css` using HSL colour space:
- `--background` / `--foreground` — Page background and text
- `--primary` / `--primary-foreground` — Primary actions
- `--secondary` / `--secondary-foreground` — Secondary content
- `--muted` / `--muted-foreground` — Subdued content
- `--destructive` — Danger/delete actions
- `--success` / `--warning` / `--info` — Semantic status
- `--border` / `--input` / `--ring` — Form elements
- `--card` / `--popover` — Elevated surfaces

## Typography

### Font
- **DM Sans** — Primary font for all text (body and headings)
- Loaded via Google Fonts in `src/styles/globals.css`

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
