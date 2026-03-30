# Design System

> **Status**: Initial scaffold — master design tokens and brand guidelines to be provided by project owner.

This document defines the visual language and component conventions for RUCompliant. All UI work must follow these guidelines.

## Design Principles (from PRD)

1. **Plain English first** — Every screen must be completable by a non-technical user (Persona 1 — Sarah, 52, sole trader) without reading more than 3 sentences
2. **Mobile-first** — Design for iPhone-sized screens first, then scale up
3. **Reassure, don't alarm** — The product must reassure as well as inform
4. **One thing at a time** — Single question per screen, not long forms. Large tap targets. No dropdowns where buttons will do.
5. **Trust the user** — "Mark as done" buttons are always visible. We don't gate progress behind proof.

## Component Library

- **shadcn/ui** (Radix UI primitives + Tailwind CSS)
- **Lucide React** for icons
- **Inter** for body text
- **Geist** available as secondary/heading font

### Installed Components

| Component | Use case |
|-----------|----------|
| `Button` | Primary actions, CTAs |
| `Card` | Content containers, domain breakdowns |
| `Input` | Form fields |
| `Label` | Form labels |
| `Badge` | Status indicators, tags |
| `Alert` | Notifications, warnings |
| `Dialog` | Confirmations, modals |
| `DropdownMenu` | Navigation menus, profile menu |
| `Separator` | Section dividers |
| `Tooltip` | Jargon definitions (PRD requirement) |
| `Sheet` | AI Advisor flyout panel |
| `Tabs` | Content sections, settings |

### Adding New Components

```bash
npx shadcn@latest add <component-name>
```

## Colour System

### Brand Colours (placeholder — to be updated with master tokens)

```
brand-500: #1e40af  (Primary blue)
brand-600: #1e3a8a  (Dark blue)
brand-900: #15244d  (Darkest)
```

### Health Score RAG Status

These colours are core to the product and are used throughout:

```
status-green:  #22c55e  — All clear, no outstanding actions
status-amber:  #f59e0b  — Attention needed, upcoming or slightly overdue
status-red:    #ef4444  — Urgent action required
```

**Rule**: Colour alone must NEVER convey information. Always pair with text + icon (WCAG 2.1 AA).

### shadcn/ui Semantic Colours (CSS variables)

Defined in `src/index.css` using oklch colour space:
- `--background` / `--foreground` — Page background and text
- `--primary` / `--primary-foreground` — Primary actions
- `--muted` / `--muted-foreground` — Secondary content
- `--destructive` — Danger/delete actions
- `--border` / `--input` / `--ring` — Form elements
- `--card` / `--popover` — Elevated surfaces

## Typography

### Fonts
- **Inter** — Primary font for all body text and UI
- **Geist** — Available for headings (optional, configured in shadcn)

### Scale (placeholder — to be refined with master tokens)
- Body: 16px (1rem)
- Small: 14px (0.875rem)
- Heading 1: 36px (2.25rem)
- Heading 2: 24px (1.5rem)
- Heading 3: 20px (1.25rem)

## Spacing

Using Tailwind's default spacing scale (4px base unit):
- `p-4` (16px) — Standard padding
- `gap-4` (16px) — Standard gap
- `space-y-6` (24px) — Section spacing
- `py-8` (32px) — Page section padding

## Border Radius

Defined as CSS variable `--radius: 0.625rem`:
- `rounded-lg` — Cards, large containers
- `rounded-md` — Buttons, inputs
- `rounded-sm` — Badges, small elements

## Responsive Breakpoints

Mobile-first using Tailwind defaults:
- Default: Mobile (< 640px) — **Primary design target**
- `sm:` — 640px+ (large phones, small tablets)
- `md:` — 768px+ (tablets)
- `lg:` — 1024px+ (desktop)

## Dark Mode

Supported via `class` strategy (Tailwind `darkMode: 'class'`). Dark mode CSS variables defined in `src/index.css` under `.dark` class. Not a priority for MVP but the infrastructure is in place.

---

> **TODO**: Replace placeholder brand colours, typography scale, and spacing with master design tokens when provided.
