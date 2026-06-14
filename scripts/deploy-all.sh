#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-}"
if [[ -z "$ENV" ]]; then
  echo "Usage: $0 <local|staging|production>"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEFAULT_BACKEND_ROOT="$PROJECT_ROOT/server"
BACKEND_ROOT="${BACKEND_ROOT:-$DEFAULT_BACKEND_ROOT}"

if [[ ! -f "$BACKEND_ROOT/scripts/deploy-all.sh" ]]; then
  echo "[deploy] missing backend deploy script: $BACKEND_ROOT/scripts/deploy-all.sh"
  exit 1
fi

echo "[deploy] delegating to backend deploy-all.sh (env=$ENV)"
"$BACKEND_ROOT/scripts/deploy-all.sh" "$ENV"
