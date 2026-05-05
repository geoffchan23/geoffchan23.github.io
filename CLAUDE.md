# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- This is a static Jekyll site without build tools
- To test locally: `jekyll serve`
- View locally at: `http://localhost:4000`

## Code Style Guidelines
- HTML: Use semantic HTML5 elements (header, main, section)
- CSS: 
  - Use Libre Baskerville as primary font
  - Maintain minimal design with consistent spacing
  - Use flexbox for layouts
  - Color scheme: light background (#f9f9f9), dark text (#333)
  - Consistent border-radius (5-5.5px)
- Naming: Use hyphenated class names
- Structure: Follow Jekyll conventions with _layouts directory
- Links: Use relative paths for internal links

## Adding a New Art Post

When the user asks to add a new art post, follow the format documented in `_art/README.md`.

1. **Ask for:** title, image file(s) (path or drag-drop), and optional caption/thoughts
2. **Create image folder:** `art/images/YYYY-MM-DD-slug/` and copy images as `01.png`, `02.png`, etc.
3. **Create post file:** `_art/YYYY-MM-DD-slug.md` with front matter (title, date, images list) and caption body
4. **Commit and push** so it auto-deploys to GitHub Pages

## /tokens Page (Auto-Generated Data)

- `data/usage.json` is auto-generated and committed hourly by the smart-home agent. Do not edit manually.
- The agent commits appear in git history as `data: update usage stats` with author `Geoff Chan <geoffchan23@gmail.com>` (the publisher uses a path-scoped commit so only `data/usage.json` is included).
- Page lives at `tokens.html` (serves at `/tokens`). Styles in `tokens.css`. Renderer in `tokens.js` (uses Chart.js v4 + chartjs-plugin-zoom via CDN).
- If the agent is down, `data/usage.json` becomes stale but the page still renders the most recent snapshot.

## /conferences Page (Agent-Maintained)

- `data/conferences.json` is maintained by the skill at `.claude/skills/maintaining-conference-calendar/SKILL.md`. A human can also hand-edit entries; mark those with `"source": "manual"`.
- Page lives at `conferences.html` (serves at `/conferences`). Styles in `conferences.css`. Renderer in `conferences.js`.
- Logos (optional) live under `conferences/logos/` and are referenced by relative path in each entry's `logo` field.
- Agent updates should be committed with `data: update conference calendar`.
