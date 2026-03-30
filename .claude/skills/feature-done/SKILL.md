---
name: feature-done
description: Complete a feature — update docs, run tests, commit, push, create PR, and close GitHub issue
disable-model-invocation: false
---

Complete the current feature branch and create a PR to develop.

## Workflow

### Step 1: Verify branch
- Confirm we are on a `feature/*` or `fix/*` branch (not `develop`, `staging`, or `main`)
- Extract the feature ID from the branch name (e.g., `feature/F-003-app-shell` → `F-003`)
- If on the wrong branch, stop and tell the user

### Step 2: Update documentation
Review and update ALL project documentation to reflect the current state of the codebase.
Run `git diff develop --stat` to see what changed on this branch, then check each doc:

1. **`CHANGELOG.md`** — Add/update entry under `[Unreleased]` describing what this feature adds, changes, or fixes. Use Keep a Changelog format (`### Added`, `### Changed`, `### Fixed`, `### Removed`). Include the feature ID (e.g., "(F-003)").
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
- Include the feature ID in the commit message, e.g., `feat: add app shell with routing (F-003)`
- Include `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`

### Step 5: Push and create PR
- Push the branch to origin
- Create a PR targeting `develop` using `gh pr create`
- Look up the GitHub issue number for this feature ID: `gh issue list --search "F-XXX" --json number --jq '.[0].number'`
- Include in the PR body:
  - Summary of changes
  - Test results (lint/test/build status, test count)
  - `Closes #N` (the GitHub issue number) — this auto-closes the issue on merge
  - Test plan checklist
  - `🤖 Generated with [Claude Code](https://claude.com/claude-code)`

### Step 6: Report
- Show the PR URL and which GitHub issue it will close
- Show the milestone progress (how many issues open/closed in this milestone)
- Remind the user: "After merging, run the post-merge cleanup"

### Step 7: Post-merge cleanup (run after user confirms merge)
When the user confirms the PR has been merged:
- `git checkout develop && git pull origin develop`
- Delete the local feature branch: `git branch -D feature/F-XXX-*`
- Delete the remote feature branch: `git push origin --delete feature/F-XXX-*`
- Verify the GitHub issue was auto-closed: `gh issue view N --json state`
- If the issue is still open, close it manually: `gh issue close N --comment "Merged via PR #M (squash)"`
- Report milestone progress

## Important
- NEVER push to `main` or `staging` directly
- NEVER skip tests
- ALWAYS update CHANGELOG.md
- ALWAYS check docs BEFORE running tests — docs are part of the deliverable
- ALWAYS include `Closes #N` in the PR body to auto-close the GitHub issue
- ALWAYS include the feature ID (F-XXX) in the commit message
- This skill must ONLY be run from the main session with full tool access — NOT from subagents

## Parallel Development Rules
When using subagents (worktree isolation) to build features in parallel:
1. Subagents write code and tests ONLY — they do NOT run feature-done
2. After all subagents complete, the main session runs feature-done for each branch
3. The main session handles: doc updates, lint, test, build, commit, push, PR creation
4. This ensures the full process is never skipped
