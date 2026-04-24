# Comic Factory — Design Spec

**Date:** 2026-04-24
**Status:** Approved for planning
**Owner:** Geoff Chan (@geoffchan23)

## Goal

Build a pipeline that turns Geoff's comic scripts into posted comics on a new `/comics/` page of geoffreychan.com. Generation uses OpenAI's `gpt-image-2` model. Ideation is collaborative (Geoff + Claude, locally); generation, review, and publishing are automated via GitHub Actions. Every comic passes through Geoff's approval before going live.

The page is labeled `slop` + `experiment` on the homepage — framing matters; this is not Geoff's real art.

## Success criteria

- Geoff can go from "raw idea" to "comic posted" without leaving GitHub + Claude Code
- Review and regeneration happen in a single GitHub issue thread
- Nothing publishes without explicit approval
- Approved comics can be queued for a future publish date or go live immediately
- The system degrades gracefully: if the queue is empty, the page simply doesn't update that day

## Architecture overview

Four phases, three runtimes, state machine driven by GitHub issue labels.

```
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1 — IDEATION (local Claude Code, skill-driven)            │
│   Geoff invokes the comic-factory skill                         │
│   Iterates on script + refs with Claude                         │
│   Skill writes final gpt-image-2-ready prompts                  │
│   Skill creates GH issue with label `comic:draft`               │
└─────────────────────────────────────────────────────────────────┘
                              │
                   Geoff adds `comic:generate`
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 2 — GENERATION (GitHub Actions, no Claude)                │
│   Trigger: label `comic:generate` added                         │
│   Plain script (Node or Python) calls gpt-image-2               │
│   Commits drafts to `_comic_drafts/<issue#>/` on main           │
│   Comments on issue with @mention + inline previews             │
│   Swaps label → `comic:review`                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                     ┌────────┴────────┐
                regenerate          approve
                     │                  │
                     ▼                  ▼
┌─────────────────────────┐   ┌────────────────────────────────┐
│ PHASE 3a — REGEN        │   │ PHASE 3b — APPROVE              │
│ Trigger: comment        │   │ Trigger: comment                │
│ matching `/regen ...`   │   │ matching `/approve [date]`      │
│ Re-runs Phase 2 w/      │   │ Writes publish date to issue    │
│ updated prompt(s)       │   │ Swaps label → `comic:queued`    │
└─────────────────────────┘   │ If `immediate` → dispatches     │
                              │ publisher immediately           │
                              └────────────────────────────────┘
                                          │
                                          ▼
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 4 — PUBLISHER (GitHub Actions, daily cron + dispatch)     │
│   Finds issues labeled `comic:queued` with date ≤ today         │
│   Moves files from `_comic_drafts/` → `comics/images/<slug>/`   │
│   Writes `_comics/<slug>.md` Jekyll post                        │
│   Closes issue, swaps label to `comic:published`                │
│   Jekyll rebuilds via GH Pages; /comics/<slug>/ goes live       │
└─────────────────────────────────────────────────────────────────┘
```

**State machine (labels on the issue):**

```
comic:draft  →  comic:generate  →  comic:review  →  comic:queued  →  comic:published
                      ↑                  │
                      └──────────────────┘
                         (regen loop)
```

**Single source of truth:** the GitHub issue. Labels drive state; comments capture the full conversation; the `_comic_drafts/<issue#>/` folder holds in-flight artifacts.

## Storage & data model

### Folders

```
_comics/                              # Jekyll collection (published posts)
  2026-04-25-dog-taxes.md
_comic_drafts/                        # Generated drafts awaiting approval (gitignored? no — committed for GHA reuse)
  42/
    01.png, 02.png, 03.png
    meta.json                         # model, prompt hashes, timestamp, cost
comics/
  images/                             # Published post images
    2026-04-25-dog-taxes/
      01.png, 02.png, 03.png
  references-draft/                   # Per-comic reference images (see Phase 1)
    42/
      ref-01.png, ref-02.jpg
  index.html                          # /comics/ listing page (replaces redirect)
  feed.xml                            # RSS feed
comics.css                            # page styling (may reuse art.css patterns)
```

### Published-post front-matter (`_comics/YYYY-MM-DD-slug.md`)

```yaml
---
title: Dog Taxes
date: 2026-04-25
issue: 42
images:
  - 01.png
  - 02.png
  - 03.png
script: |
  Panel 1: Dog at kitchen table staring at a 1040 form.
  Panel 2: Dog holds pen in mouth, looking confused.
  Panel 3: Dog has scribbled "bark" in every field.
model: gpt-image-2
generated: 2026-04-23T14:12:09Z
---
Optional caption/thoughts.
```

(Field is `images` — matches `_art/` convention so the `/comics/` layout can be a direct port of the art layout. Carousel, RSS feed, and OG image all read from `images`.)

### Art-post flag for style references

Geoff adds `comic_style_reference: true` to the front-matter of any `_art/*.md` post he wants used as a visual anchor:

```yaml
---
title: Happy Birthday Guineas
date: 2026-04-09
images: [01.png]
comic_style_reference: true
---
```

During generation, the script scans `_art/*.md` for this flag, takes the first image from each match, and caps the total at **6 images** (most recent first) to bound cost and prompt complexity.

### GitHub issue body template

Phase 1 writes this exact structure; Phase 2 parses it deterministically.

```markdown
## Summary
<one-line hook>

## Script
Panel 1: <description>
Panel 2: <description>
...

## Prompts
Panel 1: <full gpt-image-2 prompt, ready to submit verbatim>
Panel 2: <full gpt-image-2 prompt>
...

## Style notes
- <any global style directives>
- <aspect ratio, quality setting, etc.>

## References
- Style anchors (from /art, comic_style_reference=true): auto-picked at gen time
- Per-comic references (committed to comics/references-draft/<issue#>/):
  - ref-01.png — <what this is / how to use it>
  - ref-02.jpg — <...>

## Publish
<YYYY-MM-DD | immediate | TBD>
```

The parser for Phase 2 is strict about section headers (`## Prompts`, `## References`, `## Publish`) and tolerant inside them.

### Labels (created once, manually or via setup script)

- `comic:draft` — created by Phase 1, pre-generation
- `comic:generate` — Geoff adds this to trigger Phase 2
- `comic:review` — set by Phase 2 after generation
- `comic:queued` — set by Phase 3b after approval
- `comic:published` — set by Phase 4 after publishing

## Phase 1 — Ideation skill

**Location:** `.claude/skills/comic-factory/SKILL.md`

**Skill frontmatter (`description` field) triggers:** phrases like "comic idea", "new comic", "comic factory", plus direct `/comic-factory` invocation.

**Session flow:**

1. **Capture the blurt.** Geoff dumps the raw idea. Claude asks only essential questions: number of panels, punchline clarity, tone.

2. **Iterate the script** into the canonical format:
   ```
   Panel 1: [setting] — [action] — [dialogue/caption]
   ```
   Panel count variable, 1–6. Claude proposes revisions; Geoff approves.

3. **Surface style references.** Claude runs a scan of `_art/*.md` for `comic_style_reference: true` and shows Geoff the current list. Geoff can suggest flagging/unflagging additional posts — Claude can edit those art-post front-matters directly in the same session.

4. **Capture per-comic references.** Geoff drops reference images into the conversation. Claude stages them in a session tempdir (`/tmp/comic-factory-<session-id>/`) — the final committed location uses the issue number, which isn't known until after creation (see step 9 for the chicken-and-egg handling).

5. **Style notes.** Claude captures any directives ("watercolor wash", "heavy outlines", "no text in panels", aspect ratio) into a structured block.

6. **Generate gpt-image-2 prompts.** For each panel, Claude writes a full, detailed image-edit prompt that:
   - Describes the panel (setting, composition, characters, action, mood)
   - References the style anchors (by phrase, e.g., "in the style of the attached reference images")
   - References per-comic refs by filename (e.g., "use pose from ref-01.png")
   - Includes text/dialogue if any (gpt-image-2 renders text well per OpenAI's launch claims)

7. **Set target publish.** Geoff says "immediate" or a date; Claude records it in the `## Publish` block.

8. **Dry-run confirm.** Claude shows Geoff the full rendered issue body (all sections) and asks for final approval.

9. **Create the issue + commit references.** Because the issue body needs to reference the committed ref paths (which include the issue number), Claude runs this in order:
   1. Write the issue body to a tempfile, using the literal placeholder `{{ISSUE_NUMBER}}` wherever the number appears (ref paths, self-links)
   2. `gh issue create --title "Comic: <slug>" --body-file <tmpfile> --label comic:draft` — capture the returned issue number N
   3. Move staged refs: `mv /tmp/comic-factory-<session>/* comics/references-draft/<N>/`
   4. Substitute `{{ISSUE_NUMBER}}` → `<N>` in the tempfile
   5. `gh issue edit <N> --body-file <tmpfile>` to update the body with real paths
   6. `git add comics/references-draft/<N>/` and commit: `comics: add refs for issue #<N>`
   7. `git push` to main

10. **Hand-off.** Claude tells Geoff: "To kick off generation, I can add the `comic:generate` label now, or you can do it from the issue." Default: Claude adds it unless Geoff says "wait."

**Skill does NOT:**
- Call gpt-image-2 itself (that's Phase 2's job)
- Publish anything to `_comics/`
- Touch `data/usage.json` or other agent-owned files

**Skill guardrails:**
- Before creating an issue, refuse if `## Prompts` has fewer prompts than `## Script` has panels — they must match 1:1
- Never commit to `data/usage.json` (Geoff's existing rule)
- Use `git add` with explicit file paths, never `git add -A`

## Phase 2 — Generator workflow

**File:** `.github/workflows/comic-generate.yml`

**Trigger:**
```yaml
on:
  issues:
    types: [labeled]
```

**Top-level gate:**
```yaml
jobs:
  generate:
    if: github.event.label.name == 'comic:generate'
```

**Concurrency:**
```yaml
concurrency:
  group: comic-${{ github.event.issue.number }}
  cancel-in-progress: false
```
One generation at a time per issue; regen requests queue.

**Job steps:**

1. Checkout repo with full history
2. Set up Python 3.12
3. Install the OpenAI Python SDK (`pip install openai`) and PyYAML (for front-matter parsing)
4. Run `scripts/comic_generate.py` with env vars:
   - `GITHUB_TOKEN` (built-in)
   - `OPENAI_API_KEY` (repo secret)
   - `ISSUE_NUMBER` (from event payload)

Python chosen over Node for this pipeline because (a) multipart binary uploads for `/v1/images/edits` are cleaner with Python's `requests`/`openai` SDK, (b) PyYAML handles Jekyll front-matter parsing out of the box, (c) the ecosystem matches Geoff's smart-home agent patterns.

**Script logic:**
- Fetch issue via `gh issue view $ISSUE_NUMBER --json body,title`
- Parse body: extract `## Script`, `## Prompts`, `## Style notes`, `## References`, `## Publish`
- Validate: number of prompts == number of script panels
- Scan `_art/*.md` for `comic_style_reference: true`, pick first image from each, cap at 6, sort by date descending
- Build the reference image list for each panel:
  - Global style anchors (6 max from `_art/`)
  - Per-comic references from `comics/references-draft/<issue#>/`
- For each panel, call `POST /v1/images/edits`:
  - `model: "gpt-image-2"`
  - `image: [<style-anchor paths>, <per-comic ref paths>]` (multi-image edit)
  - `prompt: <the panel prompt from ## Prompts>`
  - `size: "1024x1024"` (or aspect-ratio-appropriate; allow override in style notes)
  - `quality: "high"` (default; allow override)
- Save response image to `_comic_drafts/<issue#>/0N.png`
- Write `_comic_drafts/<issue#>/meta.json`:
  ```json
  {
    "model": "gpt-image-2",
    "model_snapshot": "gpt-image-2-2026-04-21",
    "generated_at": "2026-04-23T14:12:09Z",
    "issue": 42,
    "panels": [
      {"index": 1, "prompt_sha256": "...", "refs": ["_art/.../01.png", "comics/references-draft/42/ref-01.png"], "size": "1024x1024"}
    ],
    "cost_usd_estimate": 0.48
  }
  ```
- `git add _comic_drafts/<issue#>/` and commit: `comics: generate drafts for issue #<N>`
- Push to main
- Post comment on issue using `gh issue comment`:
  ```
  @geoffchan23 draft ready for review.

  ![Panel 1](https://raw.githubusercontent.com/geoffchan23/geoffchan23.github.io/main/_comic_drafts/42/01.png)
  ...

  To approve: comment `/approve` or `/approve YYYY-MM-DD`.
  To regenerate all panels: comment `/regen`.
  To regenerate one panel: comment `/regen panel N: <new prompt or additional guidance>`.
  ```
- Swap label: `gh issue edit $ISSUE_NUMBER --remove-label comic:generate --add-label comic:review`

**Error handling:**
- On API error (rate limit, 5xx): retry up to 3 times with exponential backoff (10s, 30s, 90s). On final failure, post comment `@geoffchan23 generation failed: <error>. Add label \`comic:generate\` again to retry.` and remove the label.
- On parse error (malformed issue body): post comment with the specific section that failed to parse. Remove the label.
- On prompt/panel count mismatch: same — fail loud with a specific comment.

**Secrets required:**
- `OPENAI_API_KEY` — in repo settings → Secrets → Actions

## Phase 3 — Review, regen, approval workflows

Two workflows, both triggered by issue comments.

### `.github/workflows/comic-regen.yml`

**Trigger:**
```yaml
on:
  issue_comment:
    types: [created]
```

**Gate:**
- Comment starts with `/regen`
- Issue has label `comic:review`
- Comment author is repo owner (`github.event.comment.user.login == github.repository_owner`)

**Logic:**
- Parse the command:
  - `/regen` — regenerate all panels using the current prompts from the issue body
  - `/regen panel N` — regenerate just panel N with existing prompt
  - `/regen panel N: <additional text>` — append `<additional text>` to panel N's prompt and regenerate
- If "append" mode: edit the issue body's `## Prompts` section, updating the relevant panel line (use `gh issue edit --body-file`)
- Delete existing `_comic_drafts/<issue#>/0N.png` for affected panels
- Call the same script as Phase 2 but with a `--panels N,M` filter for targeted regen
- Update `meta.json` to reflect the regen (increment a `revision` counter per panel)
- Commit, push, comment with new previews (same format as Phase 2)
- Label stays at `comic:review`

### `.github/workflows/comic-approve.yml`

**Trigger:** `issue_comment` (same as above)

**Gate:**
- Comment starts with `/approve`
- Issue has label `comic:review`
- Author is repo owner

**Logic:**
- Parse target date:
  - `/approve` → `immediate`
  - `/approve immediate` → `immediate`
  - `/approve 2026-04-30` → parse as ISO date
- Edit the issue body's `## Publish` section to record the decision (so the publisher can read it)
- Swap label: `comic:review` → `comic:queued`
- If `immediate`: dispatch the publisher workflow via `gh workflow run comic-publish.yml` (same job will then run within ~1 minute)
- Comment: `Queued for <date|today>. Publisher will pick it up.`

## Phase 4 — Publisher workflow

**File:** `.github/workflows/comic-publish.yml`

**Triggers:**
```yaml
on:
  schedule:
    - cron: '15 13 * * *'   # 09:15 ET daily (13:15 UTC DST)
  workflow_dispatch:         # manual/immediate trigger from approve workflow
```

**Concurrency:**
```yaml
concurrency:
  group: publish-comics
  cancel-in-progress: false
```

**Job logic:**

1. Checkout repo
2. `gh issue list --label 'comic:queued' --state open --json number,body,title`
3. For each queued issue:
   - Parse `## Publish` → `immediate` or `YYYY-MM-DD`
   - If `immediate` OR date ≤ today (in America/New_York): process
   - Otherwise skip
4. For each to-process issue:
   - Compute slug: today's date in ET + kebab-cased title (e.g., `2026-04-25-dog-taxes`)
   - `mkdir -p comics/images/<slug>/`
   - Copy `_comic_drafts/<issue#>/*.png` → `comics/images/<slug>/`
   - Write `_comics/<slug>.md`:
     - Front-matter from issue body's `## Script` + metadata + list of panels
   - `git rm -r _comic_drafts/<issue#>/`
   - Commit (one commit per comic): `comics: publish <slug>`
5. Push all commits to main
6. For each published issue:
   - `gh issue edit <N> --remove-label comic:queued --add-label comic:published`
   - `gh issue close <N>`
7. If no issues were due, exit clean with no commit

**Error handling:**
- If a single issue's processing fails (parse error, missing draft files), comment on that issue, skip it, and continue with others. Don't let one bad issue block the queue.
- Log all actions to the job summary for visibility.

## `/comics/` page + homepage

### Replace the redirect

`comics/index.html` currently redirects to `/art/`. Replace with a Jekyll listing page that mirrors `_layouts/art.html` behavior:
- Pulls `site.comics` sorted by `date` descending
- Renders carousel per post (1–6 images)
- Shows date + optional caption
- Reuses `art.css` carousel/layout styles — rename to shared `gallery.css` if needed, or create `comics.css` that imports the shared pieces

### `_config.yml` updates

```yaml
collections:
  art:
    output: true
    permalink: /art/:title/
  comics:
    output: true
    permalink: /comics/:title/

defaults:
  - scope:
      path: ""
      type: art
    values:
      layout: art
  - scope:
      path: ""
      type: comics
    values:
      layout: comic

exclude:
  # ...existing...
  - _comic_drafts/        # never publish drafts via Jekyll
```

### New layout: `_layouts/comic.html`

Parallels `_layouts/art.html`. Differences:
- Header reads "comic factory" / "AI-generated from geoff's scripts"
- Renders `script` from front-matter below the carousel (collapsible `<details>`)
- Renders `model` + `generated` timestamp as fine-print metadata
- Nav links to `/` and `/art/`

### Homepage link (`index.html`)

Add to the Work section, above or below `/art/`:

```html
<li><a href="/comics/">Comic Factory</a> <span class="tag">slop</span> <span class="tag">experiment</span> AI-generated gag comics from my scripts</li>
```

### RSS feed

`comics/feed.xml` mirroring `art/feed.xml` structure. Link from the `<head>` of the comic layout.

## Verification tasks (before coding)

These are things the implementation plan must verify in its first tasks, not design decisions:

1. **gpt-image-2 edits endpoint shape.** Confirm `v1/images/edits` accepts multiple reference images in a single call with `gpt-image-2`, and confirm the exact request format (multipart vs JSON, how the image array is structured). Check OpenAI's official API docs at time of implementation.

2. **`gh issue create` attachment handling.** The `gh` CLI can't upload arbitrary image attachments to issue bodies. This design sidesteps the problem by committing per-comic references to `comics/references-draft/<issue#>/` and linking them from the issue body. Confirm the issue body's `## References` section resolves correctly to raw.githubusercontent.com URLs once committed.

3. **Claude Code GH Action availability.** *Not needed* — Phase 2 and 3 workflows are plain scripts, not Claude Code actions. Only Phase 1 uses Claude, and that runs locally. Flagging for clarity: no `anthropics/claude-code-action` dependency.

4. **Rate limits.** Verify OpenAI tier rate limit (5/min at Tier 1, up to 250/min at Tier 5). A 6-panel comic with targeted regen could hit 5/min briefly — add a panel-level rate limiter with small sleeps between calls.

## Cost estimate

Per the OpenAI launch post (2026-04-21):
- gpt-image-2 pricing: $8/1M input tokens, $30/1M output tokens
- Per-image cost depends on resolution and token usage; estimates from launch coverage suggest $0.10–$0.40 per 1024x1024 high-quality image

**Budget estimate:**
- Average comic: 4 panels × ~$0.25/image = ~$1/comic
- With regeneration (~2 revisions/comic on average): ~$2/comic
- 5 comics/week × 4 weeks = 20 comics/month × $2 = **~$40/month**

Treat as an upper bound. Real usage will be bursty; the skill can surface running cost from `meta.json` in the publish comment.

## Out of scope (not in this spec)

- Social media cross-posting (X, Bluesky, Instagram)
- Analytics / view tracking beyond what Jekyll default provides
- Comments or reader interaction on the comics page
- Automated thumbnail generation for social previews
- Style training / fine-tuning (we're reference-image-based, not fine-tuned)
- Multiple simultaneous in-flight comics (the state machine supports it, but we're not optimizing for it; treat as sequential in practice)
- A CLI/web UI for managing the queue — GitHub issues view is the UI
- Migration path for existing art posts into `_comics/` — these stay separate

## Open questions for future

- Should published comics appear in the RSS feed at `/feed.xml` (homepage), or only the per-collection `/comics/feed.xml`? Probably only the per-collection one, to keep slop out of the main feed. Confirm in planning.
- If Geoff wants to withdraw a published comic, is there a workflow for that? Not in v1; manual `git rm` + commit.
- Should `comic_style_reference: true` posts get any visual indication on `/art/`? Not in v1.

## References to existing code

- `_layouts/art.html` — pattern to mirror for `_layouts/comic.html`
- `_art/README.md` — pattern for the eventual `_comics/README.md`
- Smart-home agent's hourly commit pattern (referenced in CLAUDE.md) — same external-agent model, different runtime (our agent is GHA, not local cron)
- `data/conferences.json` skill at `.claude/skills/maintaining-conference-calendar/` — sibling pattern for the ideation skill
