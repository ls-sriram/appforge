#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-$DEFAULT_APP_ID}"
export APP_ID
LOG_DIR="$PROJECT_ROOT/.logs"
PID_DIR="$PROJECT_ROOT/.pids"
BACKEND_LOG="$LOG_DIR/backend.log"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
PROXY_LOG="$LOG_DIR/proxy.log"
PROXY_PID_FILE="$PID_DIR/proxy.pid"

mkdir -p "$LOG_DIR" "$PID_DIR"

PUBLIC_URL=""
FORWARD_ARGS=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --public-url)
      PUBLIC_URL="${2:-}"
      if [[ -z "$PUBLIC_URL" ]]; then
        echo "[local] --public-url requires a value"
        exit 1
      fi
      shift 2
      ;;
    *)
      FORWARD_ARGS+=("$1")
      shift
      ;;
  esac
done

normalize_url() {
  local value="$1"
  if [[ "$value" =~ ^https?:// ]]; then
    printf '%s' "${value%/}"
  else
    printf 'https://%s' "${value%/}"
  fi
}

if [[ -n "$PUBLIC_URL" ]]; then
  PUBLIC_URL="$(normalize_url "$PUBLIC_URL")"
  echo "[local] configuring runtime env for public url: $PUBLIC_URL"
  CORS_VALUE="[\"$PUBLIC_URL\",\"http://localhost:8081\",\"http://localhost:3000\"]"
  export EXPO_PUBLIC_API_BASE_URL="/api"
  export APP_PUBLIC_URL="$PUBLIC_URL"
  export CORS_ALLOWED_ORIGINS="$CORS_VALUE"
  export COOKIE_SECURE="true"
  export COOKIE_SAMESITE="None"
fi

if [[ -f "$BACKEND_PID_FILE" ]]; then
  OLD_PID="$(cat "$BACKEND_PID_FILE" || true)"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" 2>/dev/null; then
    echo "[local] backend already running (pid=$OLD_PID)"
  else
    rm -f "$BACKEND_PID_FILE"
  fi
fi

if [[ ! -f "$BACKEND_PID_FILE" ]]; then
  echo "[local] starting backend in background..."
  nohup "$SCRIPT_DIR/run-backend.sh" >"$BACKEND_LOG" 2>&1 &
  echo $! > "$BACKEND_PID_FILE"
  echo "[local] backend pid=$(cat "$BACKEND_PID_FILE"), log=$BACKEND_LOG"
fi

if [[ -f "$PROXY_PID_FILE" ]]; then
  OLD_PROXY_PID="$(cat "$PROXY_PID_FILE" || true)"
  if [[ -n "$OLD_PROXY_PID" ]] && kill -0 "$OLD_PROXY_PID" 2>/dev/null; then
    echo "[local] proxy already running (pid=$OLD_PROXY_PID)"
  else
    rm -f "$PROXY_PID_FILE"
  fi
fi

if [[ ! -f "$PROXY_PID_FILE" ]]; then
  echo "[local] starting reverse proxy in background..."
  nohup npm run local:proxy >"$PROXY_LOG" 2>&1 &
  echo $! > "$PROXY_PID_FILE"
  echo "[local] proxy pid=$(cat "$PROXY_PID_FILE"), log=$PROXY_LOG"
fi

echo "[local] open frontend via http://localhost:3000 (not :8081)"

echo "[local] starting frontend in foreground..."
if ((${#FORWARD_ARGS[@]} > 0)); then
  "$SCRIPT_DIR/run-frontend.sh" "${FORWARD_ARGS[@]}"
else
  "$SCRIPT_DIR/run-frontend.sh"
fi
