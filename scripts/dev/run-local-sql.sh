#!/usr/bin/env bash
# Start local PostgreSQL for development (shared container across all apps).
# The Docker Compose file lives in appforge-server; this script delegates there.
#
# Usage:
#   ./scripts/dev/run-local-sql.sh           # Start Postgres
#   ./scripts/dev/run-local-sql.sh --db-only # Same (explicit)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
APPFORGE_SERVER_ROOT="${APPFORGE_SERVER_ROOT:-$PROJECT_ROOT/../appforge-server}"

DEFAULT_APP_ID="$(node "$PROJECT_ROOT/scripts/app-registry.mjs" --default-app-id)"
APP_ID="${APP_ID:-${CONFIG_PROJECT_ID:-$DEFAULT_APP_ID}}"

normalize_app_id() {
    printf '%s' "$1" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '_'
}
APP_SLUG="$(normalize_app_id "$APP_ID")"
APP_DB_NAME="appforge_${APP_SLUG}"

CONFIG_PROJECT_ID="${CONFIG_PROJECT_ID:-$APP_ID}"
CONFIG_ENVIRONMENT="${CONFIG_ENVIRONMENT:-dev}"
CONFIG_SCOPE="${CONFIG_SCOPE:-backend}"
CONFIG_DB="$(CONFIG_DB= node "$PROJECT_ROOT/tools/config-manager/db-path.mjs" "$CONFIG_PROJECT_ID")"
CONFIG_EXPORT_SCRIPT="$PROJECT_ROOT/tools/config-manager/export-env.mjs"

if [[ -f "$CONFIG_DB" && -f "$CONFIG_EXPORT_SCRIPT" ]]; then
    echo "Loading env from config table (project=$CONFIG_PROJECT_ID env=$CONFIG_ENVIRONMENT scope=$CONFIG_SCOPE)"
    # shellcheck disable=SC2046
    eval "$(
        CONFIG_DB="$CONFIG_DB" \
            node "$CONFIG_EXPORT_SCRIPT" "$CONFIG_PROJECT_ID" "$CONFIG_ENVIRONMENT" "$CONFIG_SCOPE"
    )"
else
    echo "Config DB not found; using built-in defaults."
fi

POSTGRES_HOST="localhost"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_DB="${POSTGRES_DB:-$APP_DB_NAME}"
POSTGRES_USER="${POSTGRES_USER:-appforge}"
POSTGRES_PASSWORD="${POSTGRES_PASSWORD:-appforge_dev_password}"
POSTGRES_CONTAINER_NAME="${POSTGRES_CONTAINER_NAME:-appforge-postgres}"
POSTGRES_BOOT_DB="${POSTGRES_BOOT_DB:-appforge}"
POSTGRES_VOLUME_NAME="${POSTGRES_VOLUME_NAME:-appforge-postgres-data}"

export POSTGRES_HOST POSTGRES_PORT POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD
export POSTGRES_CONTAINER_NAME POSTGRES_BOOT_DB POSTGRES_VOLUME_NAME APP_ID

start_db() {
    if docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER_NAME}$"; then
        echo "PostgreSQL container '${POSTGRES_CONTAINER_NAME}' is already running"
    else
        echo "Starting PostgreSQL..."
        cd "$APPFORGE_SERVER_ROOT"
        docker compose up -d postgres
    fi

    echo "Waiting for PostgreSQL to be ready..."
    local ready=0
    for i in $(seq 1 15); do
        if docker exec "$POSTGRES_CONTAINER_NAME" pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_BOOT_DB" > /dev/null 2>&1; then
            echo "PostgreSQL is ready"
            ready=1
            break
        fi
        sleep 2
    done
    if [[ "$ready" -ne 1 ]]; then
        echo "ERROR: PostgreSQL did not become ready in time"
        exit 1
    fi

    if ! docker exec "$POSTGRES_CONTAINER_NAME" psql -U "$POSTGRES_USER" -d "$POSTGRES_BOOT_DB" -tAc \
      "SELECT 1 FROM pg_database WHERE datname = '$POSTGRES_DB'" | grep -q 1; then
        echo "Creating app database $POSTGRES_DB..."
        docker exec "$POSTGRES_CONTAINER_NAME" createdb -U "$POSTGRES_USER" "$POSTGRES_DB"
    else
        echo "App database $POSTGRES_DB already exists"
    fi
}

case "${1:-}" in
    --db-only|"")
        start_db
        ;;
    *)
        echo "Unknown flag: $1"
        echo "Usage: $0 [--db-only]"
        exit 1
        ;;
esac
