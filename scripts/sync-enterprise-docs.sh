#!/bin/bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
SRC="${ENTERPRISE_DOCS_SRC:-${PROJECT_ROOT}/../AgenticX/enterprise/docs}"
DEST="${PROJECT_ROOT}/content/enterprise"

if [[ ! -d "${SRC}" ]]; then
  echo "ERROR: Enterprise docs source not found: ${SRC}" >&2
  echo "Set ENTERPRISE_DOCS_SRC to override." >&2
  exit 1
fi

mkdir -p "${DEST}"
rsync -av --delete --exclude='*.swp' --exclude='.DS_Store' "${SRC}/" "${DEST}/"
date -u +"%Y-%m-%dT%H:%M:%SZ" > "${DEST}/.synced-at"

echo "Synced enterprise docs:"
echo "  from: ${SRC}"
echo "  to:   ${DEST}"
echo "  at:   $(cat "${DEST}/.synced-at")"
