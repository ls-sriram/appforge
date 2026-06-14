#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"

DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"
CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"
SEED_CONFIG_JSON="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --seed-config "$APP_ID")"

if [[ "$SEED_CONFIG_JSON" == "null" ]]; then
  echo "[seed] no app-specific seed hook for $APP_ID"
  exit 0
fi

normalize_app_id() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '_'
}

APP_SLUG="$(normalize_app_id "$APP_ID")"
APP_DB_NAME="appforge_${APP_SLUG}"

if [[ -f "$CONFIG_DB" && -f "$CONFIG_EXPORT_SCRIPT" ]]; then
  echo "[seed] loading env from config table (project=$CONFIG_PROJECT_ID env=$CONFIG_ENVIRONMENT scope=$CONFIG_SCOPE)"
  # shellcheck disable=SC2046
  eval "$(
    CONFIG_DB="$CONFIG_DB" \
      node "$CONFIG_EXPORT_SCRIPT" "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE"
  )"
fi

: "${POSTGRES_HOST:=localhost}"
: "${POSTGRES_PORT:=5432}"
: "${POSTGRES_DB:=$APP_DB_NAME}"
: "${POSTGRES_USER:=appforge}"
: "${POSTGRES_PASSWORD:=appforge_dev_password}"
export APP_ID CONFIG_PROJECT_ID CONFIG_ENVIRONMENT CONFIG_SCOPE CONFIG_DB
export POSTGRES_HOST POSTGRES_PORT POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD
export POSTGRES_SQL_URL="jdbc:postgresql://${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}"

echo "[seed] ensuring local postgres is ready for $APP_ID..."
APP_ID="$APP_ID" \
CONFIG_PROJECT_ID="$CONFIG_PROJECT_ID" \
CONFIG_ENVIRONMENT="$CONFIG_ENVIRONMENT" \
CONFIG_SCOPE="$CONFIG_SCOPE" \
CONFIG_DB="$CONFIG_DB" \
  "$PROJECT_ROOT/server/scripts/run-local-sql.sh" --db-only

SEED_KIND="$(SEED_CONFIG_JSON="$SEED_CONFIG_JSON" node --input-type=module -e 'process.stdout.write(JSON.parse(process.env.SEED_CONFIG_JSON).kind)')"
SEED_CWD="$(SEED_CONFIG_JSON="$SEED_CONFIG_JSON" node --input-type=module -e 'process.stdout.write(JSON.parse(process.env.SEED_CONFIG_JSON).cwd)')"
SEED_TASK="$(SEED_CONFIG_JSON="$SEED_CONFIG_JSON" node --input-type=module -e 'process.stdout.write(JSON.parse(process.env.SEED_CONFIG_JSON).task)')"

case "$SEED_KIND" in
  gradle)
    echo "[seed] running $SEED_TASK for $APP_ID..."
    (
      cd "$PROJECT_ROOT/$SEED_CWD"
      ./gradlew "$SEED_TASK"
    )
    ;;
  *)
    echo "[seed] unsupported seed kind '$SEED_KIND' for $APP_ID"
    exit 1
    ;;
esac

echo "[seed] complete"
