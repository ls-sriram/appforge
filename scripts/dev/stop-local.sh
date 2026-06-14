#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
PID_DIR="$PROJECT_ROOT/.pids"
BACKEND_PID_FILE="$PID_DIR/backend.pid"
PROXY_PID_FILE="$PID_DIR/proxy.pid"

if [[ -f "$BACKEND_PID_FILE" ]]; then
  PID="$(cat "$BACKEND_PID_FILE" || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "[local] stopping backend pid=$PID"
    kill "$PID" || true
  fi
  rm -f "$BACKEND_PID_FILE"
else
  echo "[local] no backend pid file found"
fi

if [[ -f "$PROXY_PID_FILE" ]]; then
  PID="$(cat "$PROXY_PID_FILE" || true)"
  if [[ -n "$PID" ]] && kill -0 "$PID" 2>/dev/null; then
    echo "[local] stopping proxy pid=$PID"
    kill "$PID" || true
  fi
  rm -f "$PROXY_PID_FILE"
else
  echo "[local] no proxy pid file found"
fi
