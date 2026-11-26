#!/bin/bash
# Full check for Katara's Test Prep + the kitchen game's questions. Run before any change ships.
#  1. analyze.mjs   - generates thousands of tests/drills/Bake-Offs; fails on any question that gives away an answer
#  2. grading.mjs   - perfect tests score 21/21, wrong 0; typed answers, example lists, hearts
#  3. e2e*.cjs      - real taps and typing in WebKit (Safari's engine): scores on screen, drills, hearts
#  4. ../../katara-kitchen/_dev/ui-audit/run.sh - layout on 5 devices
set -e; cd "$(dirname "$0")"
node analyze.mjs 1000
node grading.mjs
node e2e.cjs right 2 && node e2e.cjs wrong 1 && node e2e.cjs mixed 1
node e2e-drill.cjs
../../katara-kitchen/_dev/ui-audit/run.sh
echo "ALL CHECKS PASSED"
