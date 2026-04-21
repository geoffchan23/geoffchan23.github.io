---
name: maintaining-conference-calendar
description: Research, validate, and write entries for the /conferences page. Use when asked to "update the conferences page", "add a conference", "refresh the calendar", or when auditing existing entries for stale dates or low signal.
---

# Maintaining the Conference Calendar

You maintain `data/conferences.json`, the source of truth for the `/conferences` page on geoffchan23.github.io. Your job is to keep entries current, high-signal, and honest. Low signal is worse than no entry.

## When to use this skill

- User asks to update, refresh, or audit the conferences page
- User asks to add a specific conference
- A scheduled run invokes this workflow
- You spot a conference in the data with dates in the past or a `lastReviewed` older than six months

## Inputs you work from

- `data/conferences.json` — current state. Read it before doing anything.
- `docs/superpowers/specs/2026-04-21-conference-calendar-design.md` — the design spec defines the data model, quality bar, and inclusion rules. Re-read if uncertain.
- Web search, for each candidate conference

## Output

- An updated `data/conferences.json`, sorted by `startDate`, with `generatedAt` set to now (UTC, ISO 8601)
- A commit with message `data: update conference calendar`

## Quality bar (strict)

A conference is eligible only if it meets **all** of these:

1. **Dates are announced.** No placeholder dates. If next edition is unannounced, skip.
2. **Practitioner-driven program.** Named engineers speaking, not only vendor staff or marketing.
3. **Independent positive signal.** At least two of:
    - A Reddit thread from a relevant subreddit with substantive positive discussion
    - A practitioner blog or write-up recapping a recent edition
    - LinkedIn or X/Twitter posts from named practitioners recommending it
4. **Not vendor-sales-driven.** Exclude events that are structurally pitch sessions or pay-to-speak.

Assign a rating:
- `high` — all three signal sources are strong
- `medium` — signal is present but niche; include with a note
- `low` — do not write the entry; explain the exclusion in the commit body

## Research workflow (per candidate)

1. **Web search** for the next edition: `"<conference name> <likely year>"`, look for the official site and dates.
2. **Reddit signal search:** query site:reddit.com with the conference name and the prior year. Useful subreddits include `r/ExperiencedDevs`, `r/programming`, `r/MachineLearning`, `r/LocalLLaMA`, `r/webdev`, `r/devops`, `r/reactjs`, `r/Python`. Look for threads with multiple upvoted comments, not a single promotional post.
3. **Blog / write-up search:** query `<conference> <year> recap` or `<conference> <year> thoughts` or `what I learned at <conference> <year>`. Prefer engineer-written posts on personal blogs over corporate marketing.
4. **Social signal:** search X/Twitter and LinkedIn for posts by named engineers recommending or reflecting on the event.
5. **Capture 2–5 source URLs** with a one-line note each. Do not inflate the count — fewer strong sources beats many weak ones.
6. **Write the entry** with fields per the schema below. Set `source: "agent"` and `signal.lastReviewed` to today.

## Data model

Each entry must have all of these fields:

```json
{
  "id": "<slug>-<year>",
  "series": "<slug shared across editions>",
  "name": "<official conference name>",
  "edition": "<city or distinguishing label, or empty string>",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "city": "<city>",
  "country": "<country>",
  "region": "north-america | europe | asia-pacific | latam | global-virtual",
  "format": "in-person | hybrid | virtual",
  "url": "<official site>",
  "topics": ["<one or more of: ai-engineering, ml-research, web, systems, languages, security, general>"],
  "logo": "logos/<slug>.svg | null",
  "signal": {
    "rating": "high | medium",
    "summary": "<one to two sentences on why it's worth including>",
    "sources": [
      { "type": "reddit | blog | linkedin | x | other", "url": "...", "note": "<one line>" }
    ],
    "lastReviewed": "YYYY-MM-DD"
  },
  "source": "agent"
}
```

## Multi-location series

Conferences like **AI Engineer World's Fair** run multiple editions per year (SF flagship, official NYC / London / Singapore, plus partner-run regionals). Each edition is its own entry with:

- A unique `id` that includes the city slug, e.g. `ai-engineer-worlds-fair-nyc-2026`
- A shared `series` value, e.g. `ai-engineer-worlds-fair`
- An `edition` label that distinguishes it, e.g. `"NYC"`, `"Community — Toronto"`

Official editions → `rating: "high"` is typical. Partner-run regionals require independent signal on top of the AI Engineer brand; be stricter.

## Exclusions (always skip)

- Vendor summits that are structurally product pitches (common pattern: single-vendor "AI Summit", full keynote lineup from the same company)
- Pay-to-speak conferences
- Virtual-only webinar series without a distinct practitioner community around them
- Trade shows where the tech track is a sidecar

## What NOT to overwrite

- Any entry with `"source": "manual"` — leave it alone unless the user explicitly asks for an update. A human put it there for a reason.
- An entry whose `lastReviewed` is within the last 30 days, unless you have new information.

## Writing back

1. Read `data/conferences.json` fully.
2. Make your changes to the in-memory JS/JSON object.
3. Sort `conferences` by `startDate` ascending.
4. Set `generatedAt` to the current UTC time in ISO 8601 (e.g. `2026-04-21T17:00:00Z`).
5. Write the file back with 2-space indentation.
6. Validate: `python3 -c "import json; json.load(open('data/conferences.json')); print('ok')"`.
7. Commit with message `data: update conference calendar`. In the commit body, list conferences added, updated, or excluded (with one-line reason for exclusions).

## When the list should shrink

If an included conference has become low-signal on re-review (declining discussion, departure of key organizers, quality complaints in recent threads), remove it. Note the removal and reason in the commit body. Growing the list is not a goal; calibration is.

## Final sanity check before committing

- Every `high` entry has at least two distinct non-vendor sources
- Every `startDate` / `endDate` is a real announced date, not a guess
- No duplicate `id`s
- Every `region`, `topic`, `format` uses the allowed slugs listed above
- `generatedAt` is updated
