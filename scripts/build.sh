#!/bin/bash
set -Eeuo pipefail

COZE_WORKSPACE_PATH="${COZE_WORKSPACE_PATH:-$(pwd)}"

cd "${COZE_WORKSPACE_PATH}"

# Vercel (and many CI) set NODE_ENV=production for the build script. With that value,
# `pnpm install` omits devDependencies — but Next 16 still needs `typescript` on disk to
# transpile `next.config.ts`, otherwise: "Cannot find module 'typescript'".
echo "Installing dependencies (devDependencies required for next.config.ts)..."
NODE_ENV=development pnpm install --prefer-frozen-lockfile --prefer-offline --loglevel debug --reporter=append-only

echo "Building the project..."
NODE_ENV=production npx next build

echo "Build completed successfully!"
