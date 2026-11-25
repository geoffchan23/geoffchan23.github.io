#!/bin/bash
# Full UI audit for Mochi's Mini Kitchen + Katara's Test Prep.
# Plays through every screen on 5 devices (iPhone 13, iPhone SE, iPad portrait
# and landscape in WebKit = Safari's engine; Android in Chromium), runs layout
# checks (sideways scroll, off-screen, clipped/spilling text, overlapping
# cards) and saves screenshots to ./out for a visual pass with sheet.py.
# Needs: playwright with webkit + chromium (npx playwright install webkit;
# npx playwright install-deps webkit).
cd "$(dirname "$0")"; mkdir -p out; rm -f out/*.png
run() { for f in A_study A_kitchen A_podium; do node audit.cjs $2 "$3" out/$1 $f.json; done > out/$1.txt 2>&1; }
run i13 webkit "iPhone 13" & run se webkit "iPhone SE" & run ipad webkit "iPad (gen 7)" &
run ipadl webkit "iPad (gen 7) landscape" & run and chromium "Galaxy S8" & wait
if grep -v "^errors: \[\]$" out/*.txt; then echo "UI AUDIT: PROBLEMS FOUND"; exit 1; else echo "UI AUDIT: all clean ($(ls out/*.png | wc -l) screenshots)"; fi
