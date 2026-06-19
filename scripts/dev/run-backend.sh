#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PROFILE="${ENV_PROFILE:-local}"
DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"
CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
SELECTION_ENV="$PROJECT_ROOT/.generated/app-selection.env"

DEFAULT_BACKEND_ROOT="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --server-root "$APP_ID")"
BACKEND_ROOT="${BACKEND_ROOT:-$DEFAULT_BACKEND_ROOT}"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"

if [[ ! -d "$BACKEND_ROOT" ]]; then
  echo "[backend] missing server directory: $BACKEND_ROOT"
  echo "Add localDev.serverRoot to config/app-manifest.json for '$APP_ID', or set BACKEND_ROOT=/absolute/path"
  exit 1
fi

echo "[backend] ENV_PROFILE=$PROFILE (using runtime env/config defaults)"
node "$PROJECT_ROOT/scripts/select-app-root.mjs" "$APP_ID"
# shellcheck disable=SC1090
source "$SELECTION_ENV"
echo "[backend] APP_ID=$APP_ID"
if [[ -f "$CONFIG_DB" && -f "$CONFIG_EXPORT_SCRIPT" ]]; then
  echo "[backend] loading env from config table (project=$CONFIG_PROJECT_ID env=$CONFIG_ENVIRONMENT scope=$CONFIG_SCOPE)"
  # shellcheck disable=SC2046
  eval "$(
    CONFIG_DB="$CONFIG_DB" \
      node "$CONFIG_EXPORT_SCRIPT" "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE"
  )"
fi

cd "$BACKEND_ROOT"

if [[ -z "${FIREBASE_SERVICE_ACCOUNT_JSON:-}" && -n "${GOOGLE_APPLICATION_CREDENTIALS:-}" && -f "$GOOGLE_APPLICATION_CREDENTIALS" ]]; then
  export FIREBASE_SERVICE_ACCOUNT_JSON="$(python3 -c 'import json,sys; print(json.dumps(json.load(open(sys.argv[1]))))' "$GOOGLE_APPLICATION_CREDENTIALS")"
  echo "[backend] loaded FIREBASE_SERVICE_ACCOUNT_JSON from GOOGLE_APPLICATION_CREDENTIALS"
fi

echo "[backend] starting postgres..."
APP_ID="$APP_ID" CONFIG_PROJECT_ID="$CONFIG_PROJECT_ID" CONFIG_ENVIRONMENT="$CONFIG_ENVIRONMENT" \
  CONFIG_SCOPE="$CONFIG_SCOPE" CONFIG_DB="$CONFIG_DB" \
  "$PROJECT_ROOT/scripts/dev/run-local-sql.sh" --db-only

echo "[backend] starting app server..."
make local-sql-app
