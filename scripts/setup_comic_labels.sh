#!/usr/bin/env bash
# Creates or updates the comic:* labels used by the Comic Factory state machine.
# Idempotent: safe to re-run.

set -euo pipefail

create_or_update() {
    local name="$1"
    local color="$2"
    local description="$3"
    # `gh label create --force` creates or updates
    gh label create "$name" --color "$color" --description "$description" --force
}

create_or_update "comic:draft"     "fbca04" "Ideation issue — pre-generation"
create_or_update "comic:generate"  "0e8a16" "Ready to generate — triggers GHA"
create_or_update "comic:review"    "1d76db" "Draft generated — awaiting Geoff's review"
create_or_update "comic:queued"    "5319e7" "Approved — waiting for publisher cron"
create_or_update "comic:published" "d4c5f9" "Published to /comics/ — closed"

echo "All comic:* labels created or updated."
