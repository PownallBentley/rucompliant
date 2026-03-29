---
name: feature-done
description: Complete a feature — run tests, commit, push, create PR, and clean up
disable-model-invocation: false
allowed-tools: Bash(npm *), Bash(git *), Bash(gh *), Read, Glob, Grep, Edit, Write
---

Complete the current feature branch and create a PR to develop.

## Workflow

### Step 1: Verify branch
- Confirm we are on a `feature/*` or `fix/*` branch (not `develop`, `staging`, or `main`)
- If on the wrong branch, stop and tell the user

### Step 2: Run all tests
- Run `npm run lint` (ESLint)
- Run `npm run test` (Vitest unit tests)
- Run `npm run build` (TypeScript + Vite build)
- If ANY of these fail, stop and report the failures — do not proceed

### Step 3: Update documentation
- Check if `CHANGELOG.md` has been updated for this feature — if not, add an entry under `[Unreleased]`
- Check `git diff develop --stat` to see what changed

### Step 4: Commit
- Stage all changes
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
