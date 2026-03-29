---
name: test
description: Run the test suite (unit, component, and optionally E2E) and report results
disable-model-invocation: false
allowed-tools: Bash(npm run test*), Bash(npx playwright*), Read
argument-hint: "[all|unit|e2e]"
---

Run the RUCompliant test suite. Default is unit tests only.

## Instructions

Based on the argument:
- No argument or `unit`: Run `npm run test` (Vitest unit + component tests)
- `e2e`: Run `npm run test:e2e` (Playwright E2E tests)
- `all`: Run `npm run test:all` (both unit and E2E)

## After running:

1. Report total pass/fail counts
2. For any failures, show the test name and error message
3. If all tests pass, confirm with a summary
