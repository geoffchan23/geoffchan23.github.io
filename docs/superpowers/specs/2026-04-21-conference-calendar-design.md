# Conference Calendar Design

**Date:** 2026-04-21
**Status:** Approved — ready for implementation plan

## Goal

A `/conferences` page on geoffchan23.github.io that shows high-signal software engineering conferences (with an AI engineering bias) on a monthly calendar. Data lives in a committed JSON file and is maintained by a Claude Code skill that researches and validates each entry. Humans can hand-edit the JSON too.

## Non-goals

- No backend, no auth, no database — static Jekyll only
- No user-facing watchlist, ratings, or accounts
- No ingestion of low-signal vendor summits or pay-to-play events
- No spanning-bar calendar UI, no dedicated per-conference routes (v1)

## Scope & quality bar

**Include:** High-signal SWE/AI engineering conferences with independent, practitioner-driven endorsement.

**Quality criteria the agent enforces:**
- Multiple independent positive mentions within the last 1–2 editions (Reddit, practitioner blogs, LinkedIn, X/Twitter)
- Named practitioners on the program (not only vendor speakers)
- Not vendor-sales-driven
- Established series, or newer events with clear community backing

**Representative launch set:** AI Engineer World's Fair (SF flagship + official NYC/London/Singapore + partner regionals), NeurIPS, ICML, KubeCon, QCon, GOTO, PyCon, React Conf, ConFoo, NDC Toronto, Web Summit Vancouver. Final list determined by the agent's first research pass against the quality bar.

## User experience

### Page: `/conferences`

Light theme, consistent with the rest of the site (Libre Baskerville, `#f9f9f9` bg, `#333` text, orange accent `rgb(217, 119, 87)`). Uses the existing `default.html` layout for the header; page-scoped CSS for the calendar area.

### Calendar view (default)

- Month grid, Sun–Sat, one cell per day
- Prev/next-month buttons and a centered month label
- "Today" cell subtly highlighted
- Each cell shows a card for every conference **running** that day (multi-day conferences appear on every day they run)
- Card contents: **logo + conference name**. Small city line under the name. Optional topic tag.
- Overflow handling: if a day has more than 3 cards, show "+M more" that opens a day-detail modal listing all conferences active that day
- Clicking a card opens an on-page modal with: full name, edition label, dates, city + country, format, topics, official URL, signal summary, and the agent's source links

### List view (toggle)

- Flat chronological list, grouped by month
- One row per conference edition: logo, name, dates, city, topic tags
- Click opens the same modal as the calendar

### Filters

- **Region**: `north-america`, `europe`, `asia-pacific`, `latam`, `global-virtual`
- **Topic**: `ai-engineering`, `ml-research`, `web`, `systems`, `languages`, `security`, `general`
- Filters match exactly against the `region` field and membership in the `topics` array
- Filters are applied client-side against `data/conferences.json`
- Region/topic UI labels are title-cased versions of the slugs

### Mobile

- On narrow viewports (under ~640px), the page defaults to list view regardless of the toggle state
- Calendar view still available via toggle but is acknowledged to be dense on mobile — acceptable for v1

## Data model

File: `data/conferences.json`. Committed, human-editable, sorted by `startDate` ascending.

```json
{
  "generatedAt": "2026-04-21T17:00:00Z",
  "conferences": [
    {
      "id": "ai-engineer-worlds-fair-sf-2026",
      "series": "ai-engineer-worlds-fair",
      "name": "AI Engineer World's Fair",
      "edition": "SF (flagship)",
      "startDate": "2026-06-03",
      "endDate": "2026-06-05",
      "city": "San Francisco",
      "country": "USA",
      "region": "North America",
      "format": "in-person",
      "url": "https://ai.engineer",
      "topics": ["ai-engineering"],
      "logo": "logos/ai-engineer.svg",
      "signal": {
        "rating": "high",
        "summary": "Premier AI engineering conference; consistently high-quality speaker lineup and practitioner-heavy attendance.",
        "sources": [
          { "type": "reddit", "url": "https://reddit.com/r/...", "note": "Post-event recap with positive sentiment" },
          { "type": "blog", "url": "https://example.com/...", "note": "Engineer's detailed write-up" },
          { "type": "x", "url": "https://x.com/...", "note": "Named practitioner recommendation" }
        ],
        "lastReviewed": "2026-04-21"
      },
      "source": "agent"
    }
  ]
}
```

### Field notes

- `id`: stable, URL-safe, includes year and edition suffix for multi-location series
- `series`: shared across editions of the same conference series; used to group
- `edition`: human label like `"SF (flagship)"`, `"NYC"`, `"Community — Toronto"`
- `region`: one of the allowed values in the filter list
- `format`: `in-person` | `hybrid` | `virtual`
- `topics`: one or more short slugs from the filter list
- `logo`: optional; relative path under `conferences/logos/`. Text-only card renders if absent.
- `signal.rating`: `high` | `medium`. `low` entries are not written to the file.
- `signal.sources`: 2–5 entries. At least two independent sources required for `high` rating.
- `source`: `agent` if the agent wrote the entry, `manual` if a human added it. The agent must not overwrite `manual` entries without explicit instruction.

### Logos

- Stored at `conferences/logos/<slug>.svg` or `.png`
- SVG preferred. Simple wordmark extraction is fine.
- Text-only fallback card is used if `logo` is unset or the file is missing.

## The skill

**Location:** `.claude/skills/maintaining-conference-calendar/SKILL.md`

**Triggers:** invoked explicitly ("update the conferences page", "add X conference", "refresh the calendar"), or by a future scheduled task.

**The skill guides the agent through:**

1. **Decide scope of this run** — full refresh, add one conference, update one, or prune stale entries.
2. **Research loop per conference:**
   - Web search for the next edition's dates, location, and official URL
   - Confirm dates are announced (if not, skip — do not write `TBD`)
3. **Validation loop (required before inclusion):**
   - Search Reddit for discussion (suggested subreddits documented in the skill)
   - Search for practitioner blog write-ups / recaps
   - Search LinkedIn / X for named practitioners attending or recommending
   - Capture 2–5 representative URLs with a one-line note each
4. **Rate signal:** `high` (multiple strong positive signals), `medium` (some signal, niche but legit), `low` (exclude; note reason in commit message).
5. **Write back** to `data/conferences.json`, re-sort by `startDate`, update `generatedAt`.
6. **Commit** with message `data: update conference calendar` (matches existing `data: …` style in git history).

**The skill also documents:**
- Exclusion rules (vendor summits, virtual-only webinars without independent signal, pay-to-speak programs)
- How to handle multi-location series (one entry per edition, shared `series` id)
- How to treat `manual` vs `agent` entries (don't overwrite `manual` without instruction)
- Where logos go and how to add one

## Human admin workflow

- `data/conferences.json` is readable and hand-editable
- Each entry's `signal.summary` and `signal.sources` make the agent's reasoning auditable at a glance
- To add a conference by hand: copy an existing entry, fill fields, set `source: "manual"`, commit
- To remove: delete the entry, commit. Skill will not re-add unless explicitly re-researched.

## Architecture

Mirrors the existing `/tokens` pattern exactly.

```
conferences.html           # Jekyll page, uses default layout
conferences.css            # page-scoped styles
conferences.js             # fetches data/conferences.json, renders calendar + list
conferences/logos/*.svg    # optional logos
data/conferences.json      # source of truth, committed
.claude/skills/maintaining-conference-calendar/SKILL.md
```

Loaded by adding a conditional stylesheet link in `_layouts/default.html`, matching the existing `/tokens` pattern:

```liquid
{% if page.url contains '/conferences' %}
<link rel="stylesheet" href="/conferences.css">
{% endif %}
```

Homepage `index.html` gets a new entry under `Work`:

```html
<li><a href="/conferences">Conferences</a> <span class="tag">meta</span> high-signal software engineering conference calendar</li>
```

## Testing

- Manual: `jekyll serve`, load `/conferences`, verify calendar renders, filters work, modal opens, month nav works, list toggle works, mobile viewport is usable
- Data: if `data/conferences.json` is empty or malformed, page renders an empty state rather than crashing
- No automated test suite for this static site — manual verification in the browser is the bar

## Open items deferred to v2

- Scheduled agent run (cron) — for now, the skill is invoked ad hoc
- Dedicated per-conference routes
- Spanning-bar multi-day UI (only if card-per-day ends up too noisy)
- Search box
- RSS / iCal export

## Success criteria

- Page renders with at least one month of populated conference data at launch
- A fresh Claude Code instance opening this repo can invoke the skill and successfully add or update a conference end-to-end
- A human reviewer can open `data/conferences.json` and understand, per entry, why it's included
