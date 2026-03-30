---
name: feature-done
description: Complete a feature — update docs, run tests, commit, push, create PR, and clean up
disable-model-invocation: false
---

Complete the current feature branch and create a PR to develop.

## Workflow

### Step 1: Verify branch
- Confirm we are on a `feature/*` or `fix/*` branch (not `develop`, `staging`, or `main`)
- If on the wrong branch, stop and tell the user

### Step 2: Update documentation
Review and update ALL project documentation to reflect the current state of the codebase.
Run `git diff develop --stat` to see what changed on this branch, then check each doc:

1. **`CHANGELOG.md`** — Add/update entry under `[Unreleased]` describing what this feature adds, changes, or fixes. Use Keep a Changelog format (`### Added`, `### Changed`, `### Fixed`, `### Removed`).
2. **`CLAUDE.md`** — Check the Design System, Architecture, Tech Stack, and Key Conventions sections. Update if any of them are stale or incomplete given the changes on this branch.
3. **`docs/design.md`** — If any UI components, tokens, colours, fonts, or design rules changed, update this file.
4. **`docs/architecture.md`** — If any architectural decisions, new services, or data models were added, update this file.
5. **`docs/engineering.md`** — If any engineering conventions, testing strategy, or workflow changed, update this file.
6. **`README.md`** — If the tech stack, setup instructions, or project description changed, update this file.

Only update files that are actually affected by the changes on this branch. Do not rewrite docs that are already accurate.

### Step 3: Run all checks
- Run `npm run lint` (ESLint)
- Run `npm run test` (Vitest unit tests)
- Run `npm run build` (TypeScript + Vite build)
- If ANY of these fail, stop and report the failures — do not proceed

### Step 4: Commit
- Stage all changes (including doc updates from Step 2)
- Create a commit with a conventional commit message based on the changes
- Include `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

### Step 5: Push and create PR
- Push the branch to origin
- Create a PR targeting `develop` using `gh pr create`
- Include a summary of changes and test results in the PR body

### Step 6: Report
- Show the PR URL
- Remind the user: "After merging, the feature branch will be auto-deleted by GitHub"

## Important
- NEVER push to `main` or `staging` directly
- NEVER skip tests
- ALWAYS update CHANGELOG.md
- ALWAYS check docs BEFORE running tests — docs are part of the deliverable
