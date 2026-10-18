#!/usr/bin/env bash
#
# Re-export the OG share image (public/og-image.png) from the HTML source
# (scripts/og-image.html) using headless Chromium, so the self-hosted Nunito
# font renders. rsvg/cairo cannot draw the woff2.
#
# Usage:  scripts/export-og-image.sh
#         (also wired to `npm run og-image`)
set -euo pipefail

# Repo root = parent of this scripts/ dir.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
WRAPPER="${SCRIPT_DIR}/og-image.html"
OUT="${ROOT_DIR}/public/og-image.png"

# Pick a Chromium/Chrome binary.
CHROME=""
for cand in chromium chromium-browser google-chrome google-chrome-stable chrome; do
  if command -v "$cand" >/dev/null 2>&1; then CHROME="$(command -v "$cand")"; break; fi
done
if [[ -z "$CHROME" ]]; then
  echo "error: no Chromium/Chrome binary found on PATH" >&2
  exit 1
fi

# Chromium resolves the wrapper's relative asset paths from the file's own dir.
URL="file://${WRAPPER}"

"$CHROME" --headless=new --disable-gpu --no-sandbox --hide-scrollbars \
  --window-size=1200,630 \
  --screenshot="${OUT}" \
  --virtual-time-budget=3000 \
  "${URL}" >/dev/null 2>&1

echo "wrote ${OUT}"
