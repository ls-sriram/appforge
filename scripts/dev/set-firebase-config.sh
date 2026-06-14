#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"
CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
CONFIG_DB="${CONFIG_DB:-$(node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")}"

usage() {
  cat <<'EOF2'
Usage:
  APP_ID=<app> ./scripts/dev/set-firebase-config.sh --json /path/to/service-account.json

Updates backend Firebase config in config-manager:
  - FIREBASE_PROJECT_ID
  - FIREBASE_SERVICE_ACCOUNT_JSON
  - FIREBASE_ENABLED=true
EOF2
}

FIREBASE_JSON=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json|--firebase-json)
      FIREBASE_JSON="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "[firebase-config] unknown arg: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$FIREBASE_JSON" ]]; then
  usage
  exit 1
fi

if [[ ! -f "$FIREBASE_JSON" ]]; then
  echo "[firebase-config] firebase json not found: $FIREBASE_JSON"
  exit 1
fi

FIREBASE_PROJECT_ID="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["project_id"])' "$FIREBASE_JSON")"
FIREBASE_SERVICE_ACCOUNT_JSON="$(python3 -c 'import json,sys; print(json.dumps(json.load(open(sys.argv[1]))))' "$FIREBASE_JSON")"

CONFIG_DB="$CONFIG_DB" npm run config:set -- "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" firebase setting FIREBASE_PROJECT_ID "$FIREBASE_PROJECT_ID" >/dev/null
CONFIG_DB="$CONFIG_DB" npm run config:set -- "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" firebase secret FIREBASE_SERVICE_ACCOUNT_JSON "$FIREBASE_SERVICE_ACCOUNT_JSON" >/dev/null
CONFIG_DB="$CONFIG_DB" npm run config:set -- "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE" firebase setting FIREBASE_ENABLED "true" >/dev/null

echo "[firebase-config] updated config table: $CONFIG_DB"
echo "[firebase-config] set FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID"
echo "[firebase-config] set FIREBASE_ENABLED=true"
echo "[firebase-config] updated FIREBASE_SERVICE_ACCOUNT_JSON from $FIREBASE_JSON"
