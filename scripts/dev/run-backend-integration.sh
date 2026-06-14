#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SERVER_DIR="$ROOT_DIR/server"

if ! command -v docker >/dev/null 2>&1; then
  echo "docker is required for integration tests (Testcontainers)." >&2
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  echo "docker daemon is not reachable. start Docker and retry." >&2
  exit 1
fi

cd "$SERVER_DIR"
./gradlew integrationTest

echo "integration report: $SERVER_DIR/build/reports/tests/integrationTest/index.html"
echo "junit xml: $SERVER_DIR/build/test-results/integrationTest"
