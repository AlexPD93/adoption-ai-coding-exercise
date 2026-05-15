#!/usr/bin/env bash
# Delete every use case via the API. The server must be running.
#
# Usage:
#   ./scripts/cleanup.sh                          # http://localhost:8000 (python default)
#   ./scripts/cleanup.sh http://localhost:3000    # typescript default
set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"

if ! curl -sf "$BASE_URL/api/usecases" > /dev/null; then
    echo "Cannot reach $BASE_URL. Is the server running?" >&2
    exit 1
fi

response=$(curl -sf -X DELETE "$BASE_URL/api/usecases")
echo "Cleanup at $BASE_URL: $response"
