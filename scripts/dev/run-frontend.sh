#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROFILE="${ENV_PROFILE:-local}"
DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"
CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="frontend"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"
SELECTION_ENV="$PROJECT_ROOT/.generated/app-selection.env"
echo "[frontend] ENV_PROFILE=$PROFILE (using runtime env/config defaults)"

if [[ -f "$CONFIG_DB" && -f "$CONFIG_EXPORT_SCRIPT" ]]; then
  echo "[frontend] loading frontend env from config table (project=$CONFIG_PROJECT_ID env=$CONFIG_ENVIRONMENT scope=$CONFIG_SCOPE)"
  # shellcheck disable=SC2046
  eval "$(
    CONFIG_DB="$CONFIG_DB" \
      node "$CONFIG_EXPORT_SCRIPT" "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE"
  )"
else
  echo "[frontend] config DB/export script not found; using process env defaults."
fi

export EXPO_PUBLIC_API_BASE_URL="${EXPO_PUBLIC_API_BASE_URL:-/api}"
export APP_PUBLIC_URL="${APP_PUBLIC_URL:-http://localhost:3000}"

node "$PROJECT_ROOT/scripts/select-app-root.mjs" "$APP_ID"
# shellcheck disable=SC1090
source "$SELECTION_ENV"

cd "$PROJECT_ROOT"

echo "[frontend] starting Expo for APP_ID=$APP_ID with router root $EXPO_ROUTER_APP_ROOT..."
npx expo start -c "$@"
