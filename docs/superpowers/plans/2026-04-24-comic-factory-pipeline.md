# Comic Factory — Pipeline (Plans 2, 3, 4 Combined)

> **Scope note:** This combines the generator, review pipeline, and ideation skill into one plan document. The spec at `docs/superpowers/specs/2026-04-24-comic-factory-design.md` is the authoritative source for details; this plan is the execution checklist.

**Goal:** Complete the comic factory pipeline end-to-end so Geoff can go from raw idea → GitHub issue → auto-generated drafts → review/regen loop → approved queue → scheduled publish.

**Architecture:**
- Python generator runs in GitHub Actions, calls gpt-image-2 edits endpoint
- Three additional GHA workflows: regen (on `/regen` comment), approve (on `/approve` comment), publish (cron + dispatch)
- Local skill in `.claude/skills/comic-factory/` for Phase 1 ideation

**Tech Stack:** Python 3.12, OpenAI SDK 1.x+, PyYAML, GitHub CLI, GitHub Actions.

**Verified gpt-image-2 API contract (from 2026-04-21 launch docs):**
- Python: `client.images.edit(model="gpt-image-2", image=[...], prompt="...", size="...", quality="...")`
- `image` accepts a file OR list of file handles for multi-reference editing
- `size`: `"1024x1024"`, `"1536x1024"`, `"1024x1536"`, `"2048x2048"`, `"3840x2160"`, `"auto"`
- `quality`: `"low"`, `"medium"`, `"high"`, `"auto"`
- Response: `result.data[0].b64_json` (base64-encoded PNG by default)

**User preferences (from CLAUDE.md + memory):**
- Commit locally; do not push to main without explicit confirmation
- Never stage `data/usage.json`
- Use explicit `git add <path>`, never `-A`
- Commit messages include `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` trailer

---

## Plan 2 — Generator

### P2-1: Python package scaffold

**Files:**
- Create: `scripts/comic_factory/__init__.py` (empty)
- Create: `scripts/requirements.txt`
- Create: `scripts/README.md` (brief overview)

**Steps:**
1. `mkdir -p scripts/comic_factory`
2. `touch scripts/comic_factory/__init__.py`
3. Write `scripts/requirements.txt`:
   ```
   openai>=1.50.0
   PyYAML>=6.0
   ```
4. Write `scripts/README.md` describing the package's purpose and how it's run (inside GHA, entry points, env vars).
5. Commit: `comics: scaffold comic_factory Python package`

---

### P2-2: Issue body parser

**File:** `scripts/comic_factory/issue_parser.py` and test `scripts/comic_factory/test_issue_parser.py`

**Interface:**
```python
def parse_issue_body(body: str) -> dict:
    """Returns {"summary", "script": [str], "prompts": [str], "style_notes": [str], "references": [{"path", "description"}], "publish": str}"""
```

**Parsing rules:**
- Sections delimited by `## Summary`, `## Script`, `## Prompts`, `## Style notes`, `## References`, `## Publish`
- `Script` and `Prompts`: one line per panel (`Panel N: ...`). Strip the `Panel N:` prefix.
- `Prompts` must have the same count as `Script`
- `Style notes`: list items
- `References`: split into two sub-sections. For per-comic refs, each item has format `- ref-XX.png — description`. Extract both parts.
- `Publish`: raw string (`immediate`, `TBD`, or ISO date)

**TDD steps:**
1. Write failing test covering a well-formed issue body with 3 panels, 2 references, and a future-date publish field
2. Run test, verify it fails (function undefined)
3. Implement minimal parser
4. Verify test passes
5. Add tests for edge cases: missing sections (return empty defaults), prompt/panel mismatch (raise `ValueError`), malformed `## Publish` string
6. Implement handling
7. All tests pass
8. Commit: `comics: add issue body parser with tests`

---

### P2-3: Style references scanner

**File:** `scripts/comic_factory/style_refs.py` and test

**Interface:**
```python
def find_style_refs(art_dir: pathlib.Path = Path("_art"), cap: int = 6) -> list[pathlib.Path]:
    """Scans _art/*.md for comic_style_reference: true front-matter.
    Returns absolute paths to the first image of each flagged post, sorted by date desc, capped at `cap`."""
```

**TDD steps:**
1. Create fixture directory in test: 3 mock `_art/*.md` files (2 flagged, 1 not) + matching image files
2. Write test expecting function to return 2 image paths
3. Implement using PyYAML front-matter parsing + Path traversal
4. Test edge cases: empty `_art/`, more than cap flagged posts, posts with flag but missing image files
5. Commit: `comics: add style ref scanner with tests`

---

### P2-4: gpt-image-2 API wrapper

**File:** `scripts/comic_factory/generator.py` and test

**Interface:**
```python
def generate_panel(
    prompt: str,
    reference_images: list[pathlib.Path],
    client: openai.Client,
    size: str = "1024x1024",
    quality: str = "high",
) -> bytes:
    """Calls gpt-image-2 edits endpoint. Returns decoded PNG bytes."""
```

**Implementation:**
- Open each reference path as binary, pass to `client.images.edit(image=[...])`
- Decode `result.data[0].b64_json` → raw bytes
- Close file handles
- Retry 3× on `openai.APIError` (5xx + rate limit) with exponential backoff (10s, 30s, 90s)
- Raise on final failure

**TDD steps:**
1. Write test using a mock `openai.Client` that returns a known base64 payload
2. Verify decoded bytes match expected
3. Write test for retry logic (mock raises 429 twice then succeeds)
4. Write test for final failure (mock raises 500 three times → function raises)
5. Commit: `comics: add gpt-image-2 API wrapper with retry`

---

### P2-5: GitHub operations wrapper

**File:** `scripts/comic_factory/gh.py` and test

**Interface:**
```python
def fetch_issue_body(issue_number: int) -> tuple[str, str]:
    """Returns (title, body). Uses gh issue view."""

def comment_on_issue(issue_number: int, body: str) -> None:
    """Posts a comment using gh issue comment."""

def swap_label(issue_number: int, remove: str, add: str) -> None:
    """Atomic label change via gh issue edit --remove-label X --add-label Y."""

def commit_and_push(paths: list[str], message: str) -> None:
    """git add <paths>; git commit -m ...; git push. Must not touch data/usage.json."""
```

**Implementation:** shells out to `gh` and `git` via `subprocess.run(..., check=True, capture_output=True)`.

**TDD steps:**
1. Tests mock `subprocess.run` and assert correct CLI invocations
2. Verify `commit_and_push` refuses if `paths` contains `data/usage.json` (raises `ValueError`)
3. Commit: `comics: add GH/git operations wrapper with tests`

---

### P2-6: Main entrypoint

**File:** `scripts/comic_generate.py` (executable)

**CLI:**
```
usage: comic_generate.py --issue N [--panels 1,2,3]
```

**Flow:**
1. Load env: `OPENAI_API_KEY`, `GITHUB_TOKEN`
2. Fetch issue body
3. Parse body
4. Scan `_art/` for style refs
5. For each panel (or only `--panels` subset): call `generate_panel`, save to `_comic_drafts/<N>/0K.png`
6. Write `_comic_drafts/<N>/meta.json`
7. Commit `_comic_drafts/<N>/`
8. Comment on issue with @mention + inline previews via `raw.githubusercontent.com` URLs
9. Swap label from `comic:generate` → `comic:review` (or keep `comic:review` if called from regen)

**Error handling:**
- Parse failure → comment with specific section, remove label
- API final failure → comment with error, remove label
- Keep it simple; no test for the entrypoint itself (integration test is the live run)

**Commit:** `comics: add main generator entrypoint`

---

### P2-7: Generator GHA workflow

**File:** `.github/workflows/comic-generate.yml`

Trigger: `on: issues: types: [labeled]`, gated `if: github.event.label.name == 'comic:generate'`.

Steps:
1. `actions/checkout@v4` with full history
2. `actions/setup-python@v5` with Python 3.12
3. `pip install -r scripts/requirements.txt`
4. Run `python scripts/comic_generate.py --issue ${{ github.event.issue.number }}`

Env: `OPENAI_API_KEY` from secret, `GITHUB_TOKEN` from built-in.

Concurrency: `group: comic-${{ github.event.issue.number }}`, `cancel-in-progress: false`.

Commit: `comics: add Phase 2 generator workflow`

---

## Plan 3 — Review pipeline

### P3-1: Regen workflow

**File:** `.github/workflows/comic-regen.yml`

Trigger: `issue_comment: [created]`. Gate:
- Comment body starts with `/regen`
- Issue has label `comic:review`
- Comment author is repo owner

Logic:
- Parse command (`/regen`, `/regen panel N`, `/regen panel N: additional text`)
- If "append" mode: edit issue body's `## Prompts` section, update panel N line
- Run `comic_generate.py --issue N [--panels K]` to regenerate affected panels only
- Label stays at `comic:review`

Needs small helper in `scripts/comic_factory/regen.py` to update issue body's Prompts section. TDD this helper.

Commit: `comics: add Phase 3 regen workflow + body updater`

---

### P3-2: Approve workflow

**File:** `.github/workflows/comic-approve.yml`

Trigger: `issue_comment: [created]`. Gate:
- Comment body starts with `/approve`
- Issue has label `comic:review`
- Comment author is repo owner

Logic:
- Parse `/approve [immediate|YYYY-MM-DD]`
- Update issue body's `## Publish` section with the decision
- Swap label `comic:review` → `comic:queued`
- If `immediate`: `gh workflow run comic-publish.yml`
- Comment confirming queued state

Implementation: small inline shell + a Python helper for body editing (reuse `regen.py` or a shared body-editor module).

Commit: `comics: add Phase 3 approve workflow`

---

### P3-3: Publisher script

**Files:**
- `scripts/comic_publish.py` + tests in `scripts/comic_factory/test_publish.py`
- Helper `scripts/comic_factory/publisher.py`

**Interface:**
```python
def list_queued_issues() -> list[dict]:
    """Returns list of {number, title, body} for issues with comic:queued label."""

def is_due(publish_field: str, today: date) -> bool:
    """True if publish_field is 'immediate' or an ISO date ≤ today (America/New_York)."""

def publish_one(issue: dict, today: date) -> None:
    """Moves drafts, writes Jekyll post, closes issue, swaps label."""
```

**Entry point** `scripts/comic_publish.py`:
1. Compute today in `America/New_York` (using `zoneinfo`)
2. List queued issues
3. For each due issue, `publish_one(...)`
4. Exit clean if none due

**Draft → post transformation:**
- Slug = `<YYYY-MM-DD>-<kebab-cased title>`
- `mkdir -p comics/images/<slug>/`
- Copy `_comic_drafts/<N>/*.png` → `comics/images/<slug>/`
- Write `_comics/<slug>.md` with front-matter (title, date, issue, images, script, model, generated)
- `git rm -r _comic_drafts/<N>/`
- Commit per comic: `comics: publish <slug>`
- Close issue + swap label

**TDD:**
- Test `is_due` with various date inputs across DST boundaries
- Test `publish_one` on a mock filesystem: verify files moved, post written, front-matter correct

Commit: `comics: add publisher script with tests`

---

### P3-4: Publisher GHA workflow

**File:** `.github/workflows/comic-publish.yml`

Triggers:
- `schedule: - cron: '15 13 * * *'` (09:15 ET during DST)
- `workflow_dispatch`

Steps:
1. Checkout
2. Setup Python 3.12 + install `scripts/requirements.txt`
3. Run `python scripts/comic_publish.py`

Concurrency: `group: publish-comics`, `cancel-in-progress: false`.

Commit: `comics: add Phase 4 publisher workflow`

---

## Plan 4 — Ideation skill

### P4-1: SKILL.md

**File:** `.claude/skills/comic-factory/SKILL.md`

Format follows existing skills in `.claude/skills/` (frontmatter + body).

**Frontmatter:**
```yaml
---
name: comic-factory
description: Use when Geoff has a comic idea to develop — iterate on a script, capture references, and create a GitHub issue ready for the generator. Triggers on phrases like "comic idea", "new comic", "comic factory", or direct invocation via /comic-factory.
---
```

**Body sections:**
1. **When to invoke** — the trigger phrases + what the skill does
2. **Session flow** (the 10-step flow from the spec)
3. **Issue body template** (literal template to paste into GH issue)
4. **Reference handling** — chicken-and-egg: stage in `/tmp/comic-factory-<session-id>/`, then move after issue creation
5. **Hand-off** — when complete, instruct user to add `comic:generate` label (or do it automatically if user permits)
6. **Anti-patterns** — what NOT to do (don't call gpt-image-2 locally, don't touch `data/usage.json`, don't `git add -A`)

Commit: `comics: add ideation skill`

---

### P4-2: Skill helpers

**File:** `.claude/skills/comic-factory/issue-template.md`

Literal template for the issue body, so Claude in the skill can `cat` it + substitute rather than regenerate structure.

```markdown
## Summary
<one-line hook>

## Script
Panel 1: <description>
...

## Prompts
Panel 1: <full gpt-image-2 prompt>
...

## Style notes
- <global style directive>

## References
- Style anchors: auto-picked at gen time from _art/ (comic_style_reference=true)
- Per-comic: committed to `comics/references-draft/{{ISSUE_NUMBER}}/`
  - ref-01.png — <description>

## Publish
<immediate | YYYY-MM-DD>
```

Also a small helper `README.md` explaining directory structure and the relationship between skill + Phase 2 workflow.

Commit: `comics: add skill issue template + README`

---

## Testing Plan (end of Plan 4)

**Unit tests:** Run `cd scripts && pytest` — all tests in `scripts/comic_factory/test_*.py` must pass.

**Live smoke test (requires `OPENAI_API_KEY` set + first real comic idea):**
1. In a local Claude Code session, invoke `/comic-factory` with a test idea
2. Verify skill creates an issue with the right body structure
3. Verify refs committed to `comics/references-draft/<N>/`
4. Add `comic:generate` label to the issue
5. Confirm GHA workflow runs, generates panels, comments with previews
6. Reply `/regen panel 1: simpler background` and verify targeted regen
7. Reply `/approve immediate` and verify publisher runs
8. Open `/comics/` on the live site and verify the post renders

**Explicit ship gate:** Do not push any of this to main until Geoff has reviewed the full build and explicitly approves.
