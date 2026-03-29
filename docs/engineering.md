# Engineering Standards

## Git Workflow

### Branch Strategy

```
main          ← Production (auto-deploys to Vercel)
  └── staging ← Pre-production testing
       └── develop ← Integration branch
            └── feature/* ← Feature branches
            └── fix/*     ← Bug fix branches
            └── docs/*    ← Documentation branches
```

### Feature Workflow

Every feature follows this process:

1. **Branch**: Create `feature/descriptive-name` from `develop`
2. **Build**: Implement the feature
3. **Test**: Verify locally (`npm run dev`, `npm run build`, `npm run lint`)
4. **Commit**: Use conventional commit messages
5. **Document**: Update `CHANGELOG.md` and relevant docs
6. **PR**: Create pull request to `develop`
7. **Review**: Address any feedback
8. **Merge**: Squash merge to `develop`

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add compliance health score dashboard
fix: correct VAT deadline calculation for Q4
docs: update architecture diagram with AI layer
refactor: extract calendar service from dashboard hook
test: add unit tests for health score calculation
chore: update Supabase CLI to latest version
```

Format: `type: short description (lowercase, no period)`

If the change is scoped: `feat(calendar): add bank holiday detection`

## Code Style

### TypeScript

- **Strict mode** is enabled — do not bypass with `any` or `@ts-ignore`
- Use `interface` for object shapes, `type` for unions/intersections
- Export types from `src/types/` — co-locate component-specific types with the component

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `HealthScore.tsx` |
| Pages | PascalCase + Page suffix | `DashboardPage.tsx` |
| Hooks | camelCase with `use` prefix | `useHealthScore.ts` |
| Stores | camelCase + Store suffix | `authStore.ts` |
| Services | camelCase + Service suffix | `calendarService.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | camelCase | `compliance.ts` |

### Imports

Use the `@/` path alias for all imports from `src/`:

```typescript
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { HealthStatus } from '@/types'
```

### Styling

- Tailwind CSS utility classes only — no custom CSS except for Tailwind `@apply` in rare cases
- Brand colours: `brand-500` through `brand-900`
- Health status: `status-green`, `status-amber`, `status-red`
- Mobile-first: Start with base styles, add `sm:`, `md:`, `lg:` breakpoints

### State Management

- **Zustand** for global state (auth, health score, sidebar, notifications)
- **React state** (`useState`) for component-local state
- **URL state** (React Router search params) for Advisor panel open/closed
- Do not use React Context for state that Zustand handles better

## Database Conventions

### Migrations

- Create: `supabase migration new descriptive_name`
- Apply locally: `supabase db push`
- All tables must have RLS enabled
- Include `created_at` and `updated_at` timestamps on all tables
- Use `uuid` for primary keys (Supabase default)

### Row Level Security

Every table must have RLS policies. Minimum pattern:

```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own data"
  ON table_name FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own data"
  ON table_name FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Edge Functions

- Written in TypeScript (Deno runtime)
- Located in `supabase/functions/<function-name>/index.ts`
- Shared utilities in `supabase/functions/_shared/`
- Secrets set via `supabase secrets set KEY=value`

## Testing Strategy

### Unit Tests (Vitest — to be configured)

- Test Zustand stores, utility functions, and service logic
- Co-locate test files: `useHealthScore.test.ts` next to `useHealthScore.ts`

### E2E Tests (Playwright — to be configured)

- Critical user flows: signup → onboarding → dashboard → task completion
- Run against preview deployments in CI

### Manual Testing

- Every feature must be tested against Persona 1 (Sarah):
  - Can she complete the task on iPhone?
  - Does she need to read more than 3 sentences?
  - Is any jargon unexplained?

## Accessibility

- Target: WCAG 2.1 AA compliance
- All interactive elements must be keyboard accessible
- All images must have alt text
- Colour alone must not convey information (RAG status uses colour + text + icon)
- Test with VoiceOver on macOS/iOS

## Plain English Rules

From the PRD (Section 3 MUST HAVE):
- Any term in the top-50 confusing compliance terms list (PRD Appendix A) must include a tooltip or inline definition
- All UI copy must pass Flesch-Kincaid reading ease score of 60+
- Error messages must tell the user what happened and what to do next, in one sentence
