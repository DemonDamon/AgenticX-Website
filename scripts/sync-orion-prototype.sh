#!/usr/bin/env bash
# Copy the Orion ontology / OAG static prototype into public/ for Vercel.
# Source of truth: oag-deep-research/prototype (merged cursor + near)
# Usage: pnpm sync:orion-prototype
# Override: ORION_PROTOTYPE_SRC=/path/to/prototype pnpm sync:orion-prototype
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/public/prototype/orion"

resolve_src() {
  if [[ -n "${ORION_PROTOTYPE_SRC:-}" && -f "${ORION_PROTOTYPE_SRC}/index.html" ]]; then
    printf '%s\n' "$ORION_PROTOTYPE_SRC"
    return 0
  fi
  local candidate
  for candidate in \
    "$ROOT/../../oag-deep-research/prototype" \
    "$HOME/myWork/oag-deep-research/prototype"; do
    if [[ -f "$candidate/index.html" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  return 1
}

SRC="$(resolve_src)" || {
  echo "Orion prototype source not found. Clone oag-deep-research next to AgenticX, or set ORION_PROTOTYPE_SRC." >&2
  exit 1
}

rm -rf "$DEST"
mkdir -p "$DEST"
rsync -a \
  --exclude 'figma/' \
  --exclude 'README.md' \
  --exclude '.DS_Store' \
  --exclude '.vercel/' \
  --exclude '.gitignore' \
  --exclude 'prototype-near/' \
  --exclude 'vercel.json' \
  "$SRC/" "$DEST/"

python3 - "$DEST/index.html" <<'PY'
from pathlib import Path
import sys
html = Path(sys.argv[1])
text = html.read_text(encoding="utf-8")
needle = '    <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>\n'
html.write_text(text.replace(needle, ""), encoding="utf-8")
PY

echo "Synced $SRC -> $DEST"
