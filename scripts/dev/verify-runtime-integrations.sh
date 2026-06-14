#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEFAULT_BACKEND_ROOT="$PROJECT_ROOT/server"
BACKEND_ROOT="${BACKEND_ROOT:-$DEFAULT_BACKEND_ROOT}"
DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"

if [[ ! -d "$BACKEND_ROOT" ]]; then
  echo "[verify] missing BACKEND_ROOT: $BACKEND_ROOT"
  exit 1
fi

CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"

if [[ -f "$CONFIG_DB" && -f "$CONFIG_EXPORT_SCRIPT" ]]; then
  # shellcheck disable=SC2046
  eval "$(
    CONFIG_DB="$CONFIG_DB" \
      node "$CONFIG_EXPORT_SCRIPT" "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE"
  )"
else
  echo "[verify] config manager db/export script not found: $CONFIG_DB"
  exit 1
fi

missing=0
check_required() {
  local key="$1"
  if [[ -n "${!key:-}" ]]; then
    echo "OK   $key"
  else
    echo "MISS $key"
    missing=1
  fi
}

echo "[verify] required config values"
for key in \
  FIREBASE_PROJECT_ID FIREBASE_SERVICE_ACCOUNT_JSON \
  DODO_PAYMENTS_API_KEY DODO_PAYMENTS_BASE_URL DODO_PAYMENTS_WEBHOOK_KEY \
  DODO_PRODUCT_ID_PRO_MONTHLY DODO_PRODUCT_ID_PRO_ANNUAL \
  DATABASE_PRIMARY DATABASE_SQL_URL DATABASE_SQL_USER DATABASE_SQL_PASSWORD \
  INTERNAL_SECRET CORS_ALLOWED_ORIGINS APP_PUBLIC_URL EARLY_ACCESS_ENABLED TRIAL_DURATION_DAYS
do
  check_required "$key"
done

if [[ "$missing" -ne 0 ]]; then
  echo "[verify] failed: missing required keys"
  exit 1
fi

echo "[verify] firebase service account JSON shape"
python3 - <<'PY'
import json
import os
raw = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON", "")
obj = json.loads(raw)
required = ["type", "project_id", "private_key", "client_email", "token_uri"]
missing = [k for k in required if not obj.get(k)]
if missing:
    raise SystemExit(f"Missing JSON fields: {', '.join(missing)}")
if obj.get("type") != "service_account":
    raise SystemExit("type is not service_account")
print("OK   FIREBASE_SERVICE_ACCOUNT_JSON (valid service_account JSON)")
PY

echo "[verify] dodo API connectivity"
DODO_STATUS="$(curl -sS -o /tmp/dodo-products.json -w '%{http_code}' \
  -H "Authorization: Bearer ${DODO_PAYMENTS_API_KEY}" \
  "${DODO_PAYMENTS_BASE_URL%/}/products" || true)"

if [[ "$DODO_STATUS" == "200" ]]; then
  echo "OK   Dodo /products reachable (200)"
else
  echo "FAIL Dodo /products status=$DODO_STATUS"
  exit 1
fi

echo "[verify] backend health (if running)"
BACKEND_BASE="${EXPO_PUBLIC_API_BASE_URL:-http://localhost:8080}"
HEALTH_STATUS="$(curl -sS -o /tmp/backend-health.json -w '%{http_code}' "${BACKEND_BASE%/}/health" || true)"
if [[ "$HEALTH_STATUS" == "200" ]]; then
  echo "OK   backend health ${BACKEND_BASE%/}/health"
else
  echo "WARN backend health check failed status=$HEALTH_STATUS (${BACKEND_BASE%/}/health)"
fi

echo "[verify] completed"
