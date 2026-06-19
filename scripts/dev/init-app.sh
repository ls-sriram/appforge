#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
cd "$PROJECT_ROOT"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"
CONFIG_MANAGER="$PROJECT_ROOT/tools/config-manager/manager.mjs"
SETUP_INTEGRATIONS_SCRIPT="$PROJECT_ROOT/scripts/dev/setup-integrations.sh"
SET_FIREBASE_SCRIPT="$PROJECT_ROOT/scripts/dev/set-firebase-config.sh"
SEED_APP_SCRIPT="$PROJECT_ROOT/scripts/dev/seed-app.sh"

usage() {
  cat <<'EOF'
Usage:
  APP_ID=<app> ./scripts/dev/init-app.sh \
    [--firebase-json <path>] \
    [--dodo-api-key <key>] \
    [--dodo-webhook-key <key>] \
    [--dodo-product-monthly <id>] \
    [--dodo-product-annual <id>] \
    [--dodo-base-url <url>]

Required:
  APP_ID   App identifier (for example: example-app, another-app)

Optional env:
  CONFIG_DB
  CONFIG_PROJECT_ID
  CONFIG_ENVIRONMENT
  CONFIG_SCOPE
EOF
}

FIREBASE_JSON=""
DODO_API_KEY=""
DODO_WEBHOOK_KEY=""
DODO_PRODUCT_MONTHLY=""
DODO_PRODUCT_ANNUAL=""
DODO_BASE_URL="https://test.dodopayments.com"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --firebase-json)
      FIREBASE_JSON="${2:-}"
      shift 2
      ;;
    --dodo-api-key)
      DODO_API_KEY="${2:-}"
      shift 2
      ;;
    --dodo-webhook-key)
      DODO_WEBHOOK_KEY="${2:-}"
      shift 2
      ;;
    --dodo-product-monthly)
      DODO_PRODUCT_MONTHLY="${2:-}"
      shift 2
      ;;
    --dodo-product-annual)
      DODO_PRODUCT_ANNUAL="${2:-}"
      shift 2
      ;;
    --dodo-base-url)
      DODO_BASE_URL="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[init] unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${APP_ID:-}" ]]; then
  echo "[init] APP_ID is required."
  usage
  exit 1
fi

CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"

normalize_app_id() {
  printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '_'
}

APP_SLUG="$(normalize_app_id "$APP_ID")"
APP_DB_NAME="appforge_${APP_SLUG}"
APP_BACKEND_CONTAINER_NAME="appforge-${APP_SLUG}-backend"

require_config_row() {
  local key="$1"
  local group_category="$2"
  local category="$3"
  local value="$4"

  local current_value
  current_value="$(
    CONFIG_DB="$CONFIG_DB" node "$CONFIG_MANAGER" get \
      "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" "$category" "$key" 2>/dev/null || true
  )"

  if [[ -z "${current_value//[[:space:]]/}" ]]; then
    CONFIG_DB="$CONFIG_DB" npm run config:set -- \
      "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" "$group_category" "$category" "$key" "$value" >/dev/null
    echo "[init] seeded $key"
  else
    echo "[init] kept $key"
  fi
}

ensure_config_row() {
  local key="$1"
  local group_category="$2"
  local category="$3"
  local value="$4"

  local current_value
  current_value="$(
    CONFIG_DB="$CONFIG_DB" node "$CONFIG_MANAGER" get \
      "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" "$category" "$key" 2>/dev/null || true
  )"

  if [[ -z "${current_value//[[:space:]]/}" || "$current_value" != "$value" ]]; then
    CONFIG_DB="$CONFIG_DB" npm run config:set -- \
      "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" "$group_category" "$category" "$key" "$value" >/dev/null
    echo "[init] set $key"
  else
    echo "[init] kept $key"
  fi
}

echo "[init] APP_ID=$APP_ID"
echo "[init] config project=$CONFIG_PROJECT_ID env=$CONFIG_ENVIRONMENT scope=$CONFIG_SCOPE"
echo "[init] config db=$CONFIG_DB"

echo "[init] selecting app root..."
node "$PROJECT_ROOT/scripts/select-app-root.mjs" "$APP_ID"

echo "[init] initializing config-manager database..."
CONFIG_DB="$CONFIG_DB" npm run config:init >/dev/null

echo "[init] seeding baseline config-manager keys..."
CONFIG_DB="$CONFIG_DB" npm run config:seed -- "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" >/dev/null

echo "[init] backfilling config-manager groups..."
CONFIG_DB="$CONFIG_DB" npm run config:migrate:group >/dev/null

require_config_row "PORT" "runtime" "setting" "8080"
require_config_row "HOST" "runtime" "setting" "0.0.0.0"
require_config_row "NODE_ENV" "runtime" "setting" "development"
require_config_row "APP_PUBLIC_URL" "runtime" "setting" "http://localhost:8080"
require_config_row "COOKIE_SECURE" "runtime" "setting" "false"
require_config_row "COOKIE_SAMESITE" "runtime" "setting" "Strict"
require_config_row "SESSION_COOKIE_NAME" "runtime" "setting" "appforge-session"
require_config_row "SESSION_EXPIRY_DAYS" "runtime" "setting" "14"
require_config_row "CORS_ALLOWED_ORIGINS" "runtime" "setting" '["http://localhost:3000","http://localhost:3001"]'
require_config_row "EARLY_ACCESS_ENABLED" "runtime" "setting" "true"
require_config_row "TRIAL_DURATION_DAYS" "billing" "setting" "7"
require_config_row "UPLOAD_MAX_BYTES" "uploads" "setting" "10485760"

ensure_config_row "POSTGRES_HOST" "postgres" "setting" "localhost"
ensure_config_row "POSTGRES_PORT" "postgres" "setting" "5432"
ensure_config_row "POSTGRES_DB" "postgres" "setting" "$APP_DB_NAME"
ensure_config_row "POSTGRES_USER" "postgres" "setting" "appforge"
ensure_config_row "POSTGRES_PASSWORD" "postgres" "secret" "appforge_dev_password"
require_config_row "POSTGRES_POOL_SIZE" "postgres" "setting" "5"
ensure_config_row "POSTGRES_CONTAINER_NAME" "postgres" "metadata" "appforge-postgres"
ensure_config_row "BACKEND_CONTAINER_NAME" "runtime" "metadata" "$APP_BACKEND_CONTAINER_NAME"
ensure_config_row "POSTGRES_VOLUME_NAME" "postgres" "metadata" "appforge-postgres-data"
require_config_row "INTERNAL_SECRET" "security" "secret" "${APP_SLUG}_dev_secret"
require_config_row "UPLOAD_EVENT_SHARED_SECRET" "security" "secret" "${APP_SLUG}_upload_secret"
require_config_row "FIREBASE_PROJECT_ID" "firebase" "setting" "${APP_ID}-dev"
require_config_row "FIREBASE_ENABLED" "firebase" "setting" "false"
require_config_row "FIREBASE_SERVICE_ACCOUNT_JSON" "firebase" "secret" "" "[init] initialized FIREBASE_SERVICE_ACCOUNT_JSON placeholder" "[init] kept FIREBASE_SERVICE_ACCOUNT_JSON"
require_config_row "UPLOADS_BUCKET" "uploads" "setting" "appforge-${APP_SLUG}-dev-uploads"
require_config_row "DODO_PAYMENTS_BASE_URL" "dodo" "setting" "https://test.dodopayments.com"
require_config_row "DODO_PAYMENTS_ENABLED" "dodo" "setting" "false"
require_config_row "DODO_PAYMENTS_API_KEY" "dodo" "secret" ""
require_config_row "DODO_PAYMENTS_WEBHOOK_KEY" "dodo" "secret" ""
require_config_row "DODO_PRODUCT_ID_PRO_MONTHLY" "dodo" "setting" ""
require_config_row "DODO_PRODUCT_ID_PRO_ANNUAL" "dodo" "setting" ""
require_config_row "OPENAI_ENABLED" "openai" "setting" "false"
require_config_row "OPENAI_API_KEY" "openai" "secret" ""
require_config_row "EMAIL_ENABLED" "email" "setting" "false"
require_config_row "ZEPTOMAIL_API_URL" "email" "setting" "https://api.zeptomail.in/v1.1/email"
require_config_row "ZEPTOMAIL_SEND_MAIL_TOKEN" "email" "secret" ""
require_config_row "EMAIL_FROM_ADDRESS" "email" "setting" "no-reply@example.com"
require_config_row "EMAIL_FROM_NAME" "email" "setting" "AppForge Local"
require_config_row "EMAIL_API_KEY" "email" "secret" ""

if [[ -n "$FIREBASE_JSON" || -n "$DODO_API_KEY" || -n "$DODO_WEBHOOK_KEY" || -n "$DODO_PRODUCT_MONTHLY" || -n "$DODO_PRODUCT_ANNUAL" ]]; then
  if [[ -z "$FIREBASE_JSON" || -z "$DODO_API_KEY" || -z "$DODO_WEBHOOK_KEY" || -z "$DODO_PRODUCT_MONTHLY" || -z "$DODO_PRODUCT_ANNUAL" ]]; then
    echo "[init] integration flags are incomplete."
    usage
    exit 1
  fi

  if [[ ! -f "$FIREBASE_JSON" ]]; then
    echo "[init] firebase json not found: $FIREBASE_JSON"
    exit 1
  fi

  echo "[init] seeding Firebase/Dodo integration config..."
  CONFIG_DB="$CONFIG_DB" \
  CONFIG_PROJECT_ID="$CONFIG_PROJECT_ID" \
  CONFIG_ENVIRONMENT="$CONFIG_ENVIRONMENT" \
  CONFIG_SCOPE="$CONFIG_SCOPE" \
  "$SETUP_INTEGRATIONS_SCRIPT" \
    --firebase-json "$FIREBASE_JSON" \
    --dodo-api-key "$DODO_API_KEY" \
    --dodo-webhook-key "$DODO_WEBHOOK_KEY" \
    --dodo-product-monthly "$DODO_PRODUCT_MONTHLY" \
    --dodo-product-annual "$DODO_PRODUCT_ANNUAL" \
    --dodo-base-url "$DODO_BASE_URL"
fi

echo "[init] running app-specific seed/setup..."
APP_ID="$APP_ID" \
CONFIG_PROJECT_ID="$CONFIG_PROJECT_ID" \
CONFIG_ENVIRONMENT="$CONFIG_ENVIRONMENT" \
CONFIG_SCOPE="$CONFIG_SCOPE" \
CONFIG_DB="$CONFIG_DB" \
  "$SEED_APP_SCRIPT"

echo "[init] complete"
echo "[init] next: use the existing run-* scripts to start backend/frontend separately."
