#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────
# AppForge — Local Boot Script
#
# Usage:
#   ./scripts/boot.sh            # full boot (env + typegen + dev server)
#   ./scripts/boot.sh --no-types # skip API type generation
# ──────────────────────────────────────────────────────────────────────────

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

log()   { echo -e "${BLUE}[boot]${NC} $*"; }
ok()    { echo -e "${GREEN}  ✓${NC} $*"; }
warn()  { echo -e "${YELLOW}  ⚠${NC} $*"; }

SKIP_TYPES=false
for arg in "$@"; do
  case "$arg" in
    --no-types) SKIP_TYPES=true ;;
    --help|-h)
      echo "Usage: ./scripts/boot.sh [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --no-types      Skip API type generation"
      echo "  --help, -h      Show this help"
      exit 0
      ;;
  esac
done

# ─── Step 1: Runtime config ──────────────────────────────────────────────
log "Using runtime env from shell/config-manager"
ok "Runtime environment ready"

# ─── Step 2: Install deps ────────────────────────────────────────────────
if [ ! -d "$ROOT_DIR/node_modules" ]; then
  log "Installing dependencies..."
  cd "$ROOT_DIR" && npm install --legacy-peer-deps
  ok "Dependencies installed"
else
  ok "Dependencies already installed"
fi

# ─── Step 3: Generate API types ──────────────────────────────────────────
if [ "$SKIP_TYPES" = false ]; then
  log "Generating API types..."
  cd "$ROOT_DIR" && npx tsx scripts/generate-api.ts 2>&1
  ok "API types generated"
else
  warn "Skipping API type generation"
fi

# ─── Step 4: Start Expo ──────────────────────────────────────────────────
log "Starting Expo dev server..."
echo ""
echo -e "${GREEN}─────────────────────────────────────────────────${NC}"
echo -e "${GREEN} AppForge — Local Dev${NC}"
echo -e "${GREEN}  Web:      http://localhost:8082${NC}"
echo -e "${GREEN}  API:      http://localhost:8080${NC}"
echo -e "${GREEN}─────────────────────────────────────────────────${NC}"
echo ""

cd "$ROOT_DIR" && npx expo start --web --port 8082 2>&1
