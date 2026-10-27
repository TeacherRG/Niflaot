#!/bin/bash
# SessionStart hook for Claude Code on the web: installs what the tests need.
#  - npm install → Playwright (version pinned in package.json to match the
#    browsers preinstalled in the cloud image at $PLAYWRIGHT_BROWSERS_PATH)
# The game itself has no build step and no runtime dependencies.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

# Browsers are preinstalled in the cloud image; never download them here.
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
npm install --no-audit --no-fund

# Make the same settings available to commands in the session.
if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1' >> "$CLAUDE_ENV_FILE"
fi
