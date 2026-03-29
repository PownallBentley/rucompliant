#!/bin/bash
# Claude Code Stop hook — runs unit tests when Claude finishes working.
# If tests fail, Claude sees the output and continues fixing.

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Run unit tests (fast — no E2E)
npm run test 2>&1
TEST_EXIT=$?

if [ $TEST_EXIT -ne 0 ]; then
  echo "❌ Unit tests failed. Please fix before completing." >&2
  exit 2  # Block — tells Claude to keep working
fi

echo "✅ All unit tests passed."
exit 0
