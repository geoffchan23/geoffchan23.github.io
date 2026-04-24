# Comic Factory — Foundation (Plan 1 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up all Jekyll + GitHub-metadata plumbing for the Comic Factory so future plans can focus purely on generation/workflow logic.

**Architecture:** Add a `_comics/` Jekyll collection (parallels `_art/`), a `/comics/` listing page (replaces the existing redirect), a per-post layout, an RSS feed, and a homepage link. Configure GitHub labels for the state machine. Exclude draft folders from Jekyll builds. No external API calls, no runtime code — pure static-site groundwork.

**Tech Stack:** Jekyll 4.x, Liquid templates, GitHub CLI (`gh`), bash.

**User preferences baked in (from CLAUDE.md and memory):**
- Commit locally as each task's verification passes; **do not push to main** without explicit confirmation from Geoff (pushing = deploying)
- Never stage `data/usage.json` (owned by a different agent)
- Use `git add <explicit-paths>` — never `git add -A`

**Spec reference:** `docs/superpowers/specs/2026-04-24-comic-factory-design.md`

**Follow-on plans** (not in scope here):
- Plan 2 — Generator: gpt-image-2 verification + Python script + Phase 2 workflow
- Plan 3 — Review pipeline: regen, approve, publisher workflows
- Plan 4 — Ideation skill: `.claude/skills/comic-factory/`

---

## Task 1: Register the `_comics/` collection in `_config.yml` + allowlist comic images in `.gitignore`

**Files:**
- Modify: `_config.yml`
- Modify: `.gitignore`

- [ ] **Step 1: Read the current `_config.yml` to locate the `collections:`, `defaults:`, and `exclude:` sections**

Run: `cat _config.yml`
Expected: see existing `collections:` block with `art:` and `defaults:` block scoping `type: art` to `layout: art`.

- [ ] **Step 2: Edit `_config.yml` to add the `comics` collection and defaults, plus exclusions for draft folders**

Replace the `collections:` block:

```yaml
collections:
  art:
    output: true
    permalink: /art/:title/
  comics:
    output: true
    permalink: /comics/:title/
```

Replace the `defaults:` block:

```yaml
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
```

Append to the `exclude:` block (add these lines alongside existing entries):

```yaml
exclude:
  - docs/
  - README.md
  - _art/README.md
  - _comics/README.md
  - CLAUDE.md
  - .claude/
  - Gemfile
  - Gemfile.lock
  - _comic_drafts/
  - scripts/
```

(Note: `_comic_drafts/` is underscore-prefixed so Jekyll would exclude it by default, but explicit is better. `scripts/` will hold Python helpers we introduce in Plan 2 — excluding now means no later churn.)

- [ ] **Step 3: Run `jekyll build` and verify no errors**

Run: `bundle exec jekyll build`
Expected: `done in X.XXX seconds.` with no warnings about unknown collections.
Failure mode: if you see "Warning: unrecognised property `comics`", check YAML indentation.

- [ ] **Step 4: Verify `_site/comics/` exists but is empty (no posts yet)**

Run: `ls _site/comics/ 2>&1 || echo "not present"`
Expected: either "not present" or an empty directory (the collection is registered but has no entries). Either is acceptable at this stage.

- [ ] **Step 5: Update `.gitignore` to allowlist comic images**

The repo has `*.png` gitignored with explicit allowlist entries for art images. Add equivalent entries for the three comic image locations: published comic panels, per-comic references, and generator drafts.

Read current contents:
```bash
cat .gitignore
```

Expected:
```
_site/
.jekyll-cache/
.jekyll-metadata
.playwright-mcp/
Gemfile.lock
vendor/
*.png
!favicon-*.png
!art/images/**/*.png
!art/images/**/*.jpg
!art/images/**/*.webp
```

Replace `.gitignore` with:
```
_site/
.jekyll-cache/
.jekyll-metadata
.playwright-mcp/
Gemfile.lock
vendor/
*.png
!favicon-*.png
!art/images/**/*.png
!art/images/**/*.jpg
!art/images/**/*.webp
!comics/images/**/*.png
!comics/images/**/*.jpg
!comics/images/**/*.webp
!comics/references-draft/**/*.png
!comics/references-draft/**/*.jpg
!comics/references-draft/**/*.webp
!_comic_drafts/**/*.png
!_comic_drafts/**/*.jpg
!_comic_drafts/**/*.webp
```

- [ ] **Step 6: Verify the allowlist works**

Create a temporary test PNG in each target path and confirm `git status` would track it (don't actually commit it):

```bash
mkdir -p comics/images/test _comic_drafts/test comics/references-draft/test
touch comics/images/test/x.png _comic_drafts/test/x.png comics/references-draft/test/x.png
git check-ignore -v comics/images/test/x.png _comic_drafts/test/x.png comics/references-draft/test/x.png 2>&1 || echo "all three PATHS are trackable (good)"
```

Expected: "all three PATHS are trackable (good)" — `git check-ignore` exits non-zero when paths are NOT ignored, which is what we want.

Clean up the test files:
```bash
rm -rf comics/images/test _comic_drafts/test comics/references-draft/test
```

- [ ] **Step 7: Commit**

```bash
git add _config.yml .gitignore
git commit -m "comics: register Jekyll collection + allowlist images in gitignore"
```

---

## Task 2: Create `_layouts/comic.html` from `_layouts/art.html`

**Files:**
- Create: `_layouts/comic.html`
- Reference: `_layouts/art.html` (copy source)

- [ ] **Step 1: Copy `_layouts/art.html` to `_layouts/comic.html`**

Run: `cp _layouts/art.html _layouts/comic.html`

- [ ] **Step 2: Edit `_layouts/comic.html` to swap the art-specific bits for comic-specific ones**

Open `_layouts/comic.html` and make these changes:

Change the page title (line ~11):
```html
<title>{{ page.title }} — Comic Factory by Geoff Chan</title>
```

Change OG title (line ~14):
```html
<meta property="og:title" content="{{ page.title }} — Comic Factory by Geoff Chan">
```

Change description fallback block (lines ~8-10) to:
```html
{% assign art_description = page.content | strip_html | strip_newlines | truncate: 155 %}
{% if art_description == '' %}
  {% assign art_date = page.date | date: '%B %-d, %Y' %}
  {% capture art_description %}An AI-generated gag comic by Geoff Chan titled "{{ page.title }}", posted {{ art_date }}. Part of the Comic Factory experiment at geoffreychan.com.{% endcapture %}
{% endif %}
```

Change the og:image path (line ~20) — images now live under `/comics/images/` not `/art/images/`:
```html
<meta property="og:image" content="{{ site.url }}/comics/images/{{ slug }}/{{ page.images.first }}">
```

Also update the Twitter image path (line ~22):
```html
<meta name="twitter:image" content="{{ site.url }}/comics/images/{{ slug }}/{{ page.images.first }}">
```

Change the Twitter title (line ~24):
```html
<meta name="twitter:title" content="{{ page.title }} — Comic Factory by Geoff Chan">
```

Change the RSS feed link (line ~28):
```html
<link rel="alternate" type="application/rss+xml" title="Geoff Chan's Comics" href="/comics/feed.xml">
```

Change the header block (lines ~38-47):
```html
<header>
    <div>
        <a href="/comics/"><h1>comic factory</h1></a>
        <span>AI slop from geoff's scripts</span>
    </div>
    <nav>
        <a href="/">Home</a>
        <a href="/comics/">Grid</a>
    </nav>
</header>
```

Change the main loop — replace `site.art` with `site.comics`, and swap the image path from `/art/images/...` to `/comics/images/...`:

```html
<main>
    {% assign all_comics = site.comics | sort: 'date' | reverse %}

    {% if all_comics.size == 0 %}
    <p class="empty-state">No comics yet. Check back soon.</p>
    {% endif %}

    {% for comic in all_comics %}
    {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
    <article class="comic-post" id="post-{{ slug }}">
        <div class="comic-carousel" data-post="{{ slug }}">
            {% for image in comic.images %}
            <div class="carousel-slide{% if forloop.first %} active{% endif %}">
                <img src="/comics/images/{{ slug }}/{{ image }}" alt="{{ comic.title }}{% if comic.images.size > 1 %} - panel {{ forloop.index }} of {{ comic.images.size }}{% endif %}" loading="lazy">
            </div>
            {% endfor %}

            {% if comic.images.size > 1 %}
            <button class="carousel-btn carousel-prev" aria-label="Previous panel">&lsaquo;</button>
            <button class="carousel-btn carousel-next" aria-label="Next panel">&rsaquo;</button>
            <div class="carousel-dots">
                {% for image in comic.images %}
                <span class="carousel-dot{% if forloop.first %} active{% endif %}" data-index="{{ forloop.index0 }}"></span>
                {% endfor %}
            </div>
            {% endif %}
        </div>

        <div class="comic-caption">
            <time class="comic-date" datetime="{{ comic.date | date: '%Y-%m-%d' }}">{{ comic.date | date: "%B %-d, %Y" }}</time>
            {% if comic.content != "" %}
            <div class="comic-text">{{ comic.content }}</div>
            {% endif %}
            {% if comic.script %}
            <details class="comic-script">
                <summary>Script</summary>
                <pre>{{ comic.script }}</pre>
            </details>
            {% endif %}
            {% if comic.model %}
            <p class="comic-meta">Generated with {{ comic.model }}{% if comic.generated %} on <time datetime="{{ comic.generated }}">{{ comic.generated | date: "%Y-%m-%d" }}</time>{% endif %}</p>
            {% endif %}
        </div>
    </article>
    {% endfor %}
</main>
```

Leave the `<script>` block (carousel logic) unchanged — it works the same.

- [ ] **Step 3: Verify `jekyll build` still succeeds**

Run: `bundle exec jekyll build`
Expected: clean build.

- [ ] **Step 4: Commit**

```bash
git add _layouts/comic.html
git commit -m "comics: add per-post layout mirroring art layout"
```

---

## Task 3: Extend `art.css` for the new script/meta blocks (or create `comics.css`)

**Files:**
- Modify: `art.css`

Decision: reuse `art.css` since the carousel + post styles are identical. Add new rules for the `<details>` script block and `.comic-meta` line. `art.css` is already loaded by `_layouts/art.html`, so we need to link it from `_layouts/comic.html` too.

- [ ] **Step 1: Verify `_layouts/comic.html` already loads `art.css`**

Run: `grep 'art.css' _layouts/comic.html`
Expected: one match (copied over from the art layout in Task 2).

If missing, add inside the `<head>`:
```html
<link rel="stylesheet" href="/art.css">
```

- [ ] **Step 2: Append the new styles to `art.css`**

Open `art.css` and append at the bottom:

```css
/* Comic script + meta (comic layout only) */
.comic-script {
    margin-top: 1rem;
    font-size: 0.75em;
    opacity: 0.7;
}

.comic-script summary {
    cursor: pointer;
    user-select: none;
}

.comic-script pre {
    white-space: pre-wrap;
    margin-top: 0.5rem;
    padding: 0.75rem;
    background: #f0f0f0;
    border-radius: 4px;
    font-family: "Libre Baskerville", serif;
}

.comic-meta {
    font-size: 0.7em;
    opacity: 0.4;
    margin-top: 1rem;
}

.empty-state {
    text-align: center;
    padding: 3rem 1rem;
    opacity: 0.5;
    font-style: italic;
}
```

- [ ] **Step 3: Verify `jekyll build` succeeds**

Run: `bundle exec jekyll build`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add art.css
git commit -m "comics: add script + meta styles (shared with art.css)"
```

---

## Task 4: Create a placeholder comic post to verify the layout renders

**Files:**
- Create: `_comics/2026-04-24-placeholder.md`
- Create: `comics/images/2026-04-24-placeholder/01.png` and `02.png`

This is a throwaway — Task 9 will delete it. We need it temporarily to validate the layout end-to-end.

- [ ] **Step 1: Create the image folder and drop in two placeholder images**

Run:
```bash
mkdir -p comics/images/2026-04-24-placeholder
# Generate two simple solid-color PNGs using ImageMagick if available,
# otherwise copy any two existing art images as stand-ins
cp art/images/2026-04-09-happy-birthday-guineas/01.png comics/images/2026-04-24-placeholder/01.png
cp art/images/2026-04-09-happy-birthday-guineas/01.png comics/images/2026-04-24-placeholder/02.png
```

Expected: two `.png` files present.

- [ ] **Step 2: Create the markdown post file**

Create `_comics/2026-04-24-placeholder.md` with exactly this content:

```markdown
---
title: Placeholder
date: 2026-04-24
issue: 0
images:
  - 01.png
  - 02.png
script: |
  Panel 1: Test panel one.
  Panel 2: Test panel two.
model: gpt-image-2
generated: 2026-04-24T00:00:00Z
---
This is a placeholder post used to verify layout rendering. It will be deleted.
```

(The front-matter uses `images:` — same field name as `_art/` posts — so the `/comics/` layout can share the carousel/RSS logic. The spec was updated to reflect this.)

- [ ] **Step 3: Run `jekyll serve` and verify in browser**

Run: `bundle exec jekyll serve --port 4000`

Open in browser:
- `http://localhost:4000/comics/placeholder/` → should render the carousel with two panels, date, caption, and metadata line

Expected: page renders cleanly, both panels visible via carousel arrows, script in a collapsible `<details>`, meta line shows "Generated with gpt-image-2 on 2026-04-24".

If broken: check the browser console for 404s on image paths. Verify the image files actually exist.

- [ ] **Step 4: Kill the jekyll server (Ctrl+C) once verified**

- [ ] **Step 5: Commit**

```bash
git add _comics/2026-04-24-placeholder.md comics/images/2026-04-24-placeholder/
git commit -m "comics: add temporary placeholder post for layout verification"
```

---

## Task 5: Create `/comics/index.html` listing (grid view)

**Files:**
- Modify: `comics/index.html` (currently a redirect)

- [ ] **Step 1: Read the current `comics/index.html`**

Run: `cat comics/index.html`
Expected: the 4-line redirect to `/art/`.

- [ ] **Step 2: Replace the redirect with a grid listing mirroring `art/index.html`**

Overwrite `comics/index.html` with:

```html
---
layout: default
title: Comic Factory by Geoff Chan
description: AI-generated gag comics from Geoff Chan's scripts. An experiment in using gpt-image-2 to execute pre-written comic scripts.
---
<header>
    <div>
        <a href="/comics/"><h1>comic factory</h1></a>
        <span>AI slop from geoff's scripts</span>
    </div>
    <nav>
        <a href="/">Home</a>
    </nav>
</header>
<main>
    {% assign all_comics = site.comics | sort: 'date' | reverse %}
    {% if all_comics.size == 0 %}
    <p class="empty-state">No comics yet. Check back soon.</p>
    {% else %}
    <div class="comics-grid">
        {% for comic in all_comics %}
        {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
        <a href="{{ comic.url }}" class="grid-item">
            <img src="/comics/images/{{ slug }}/{{ comic.images.first }}" alt="{{ comic.title }}" loading="lazy">
        </a>
        {% endfor %}
    </div>
    {% endif %}
</main>
```

- [ ] **Step 3: Run `jekyll serve` and verify**

Run: `bundle exec jekyll serve --port 4000`

Open `http://localhost:4000/comics/` → should show a grid with one tile (the placeholder).

Expected: grid item visible, clicking it navigates to the placeholder post.

- [ ] **Step 4: Kill the server, commit**

```bash
git add comics/index.html
git commit -m "comics: replace redirect with grid listing page"
```

---

## Task 6: Create `comics/feed.xml` RSS feed

**Files:**
- Create: `comics/feed.xml`
- Reference: `art/feed.xml`

- [ ] **Step 1: Copy `art/feed.xml` as a starting point**

Run: `cp art/feed.xml comics/feed.xml`

- [ ] **Step 2: Edit `comics/feed.xml` to swap art → comics paths and titles**

Overwrite `comics/feed.xml` with:

```xml
---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Geoff Chan's Comic Factory</title>
        <description>AI-generated gag comics by Geoff Chan</description>
        <link>{{ site.url }}/comics</link>
        <atom:link href="{{ site.url }}/comics/feed.xml" rel="self" type="application/rss+xml"/>
        <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
        {% assign all_comics = site.comics | sort: 'date' | reverse %}
        {% for comic in all_comics %}
        {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
        <item>
            <title>{{ comic.title | xml_escape }}</title>
            <link>{{ site.url }}{{ comic.url }}</link>
            <guid isPermaLink="true">{{ site.url }}{{ comic.url }}</guid>
            <pubDate>{{ comic.date | date_to_rfc822 }}</pubDate>
            {% if comic.content != "" %}
            <description>{{ comic.content | strip_html | xml_escape | truncate: 500 }}</description>
            {% endif %}
            {% if comic.images %}
            <enclosure url="{{ site.url }}/comics/images/{{ slug }}/{{ comic.images.first }}" type="image/png"/>
            {% endif %}
        </item>
        {% endfor %}
    </channel>
</rss>
```

- [ ] **Step 3: Build and verify the feed renders**

Run: `bundle exec jekyll build && cat _site/comics/feed.xml`
Expected: valid XML with one `<item>` block (the placeholder).

- [ ] **Step 4: Commit**

```bash
git add comics/feed.xml
git commit -m "comics: add RSS feed"
```

---

## Task 7: Add homepage link with `slop` + `experiment` tags

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Read the current Work section of `index.html`**

Run: `grep -n '<li>' index.html`
Expected: a list of existing work items (Tokens, Conferences, Art, Stack Five, Viyo, React Libraries).

- [ ] **Step 2: Edit `index.html` to add a new `<li>` for Comic Factory**

Open `index.html`. Inside the `<section class="work">` `<ul>`, insert the new item **immediately after the Art line** (so it sits next to Art in the list, since they're related):

```html
<li><a href="/comics/">Comic Factory</a> <span class="tag">slop</span> <span class="tag">experiment</span> AI-generated gag comics from my scripts</li>
```

The surrounding context should look like:
```html
<li><a href="/art/">Art</a> <span class="tag">art</span> my art and sketchbook</li>
<li><a href="/comics/">Comic Factory</a> <span class="tag">slop</span> <span class="tag">experiment</span> AI-generated gag comics from my scripts</li>
<li><a href="https://stackfive.io">Stack Five</a> ...
```

- [ ] **Step 3: Run `jekyll serve` and verify on homepage**

Run: `bundle exec jekyll serve --port 4000`

Open `http://localhost:4000/` → the Work section should now show "Comic Factory" with two tags.

Expected: link visible, tags rendered with the existing `.tag` styling.

- [ ] **Step 4: Kill server, commit**

```bash
git add index.html
git commit -m "home: link Comic Factory from work section"
```

---

## Task 8: Verify `_comic_drafts/` is excluded from Jekyll output

**Files:**
- Create (temporary): `_comic_drafts/test/dummy.txt`

- [ ] **Step 1: Create a throwaway file inside `_comic_drafts/` and build**

Run:
```bash
mkdir -p _comic_drafts/test
echo "should not be served" > _comic_drafts/test/dummy.txt
bundle exec jekyll build
```

- [ ] **Step 2: Verify the file was NOT copied to `_site/`**

Run: `ls _site/_comic_drafts/ 2>&1 || echo "correctly excluded"`
Expected: "correctly excluded"

If `_site/_comic_drafts/` DOES exist, the exclusion failed — double-check the `exclude:` list in `_config.yml`.

- [ ] **Step 3: Also verify the underscore-prefixed path isn't served at a renamed path**

Run: `find _site -name dummy.txt`
Expected: (no output)

- [ ] **Step 4: Remove the throwaway file**

Run: `rm -rf _comic_drafts/`

- [ ] **Step 5: No commit needed** — this was a verification-only task, nothing to stage.

---

## Task 9: Remove the placeholder post and verify empty-state rendering

**Files:**
- Delete: `_comics/2026-04-24-placeholder.md`
- Delete: `comics/images/2026-04-24-placeholder/`

- [ ] **Step 1: Remove the placeholder files**

Run:
```bash
git rm _comics/2026-04-24-placeholder.md
git rm -r comics/images/2026-04-24-placeholder
```

- [ ] **Step 2: Build and verify empty state**

Run: `bundle exec jekyll serve --port 4000`

Open in browser:
- `http://localhost:4000/comics/` → should show "No comics yet. Check back soon." (from the `empty-state` block in `comics/index.html`)
- `http://localhost:4000/comics/feed.xml` → should be a valid RSS with zero `<item>` blocks
- `http://localhost:4000/` → homepage still shows the Comic Factory link

Expected: all three render cleanly with no errors, empty-state copy visible on the grid page.

- [ ] **Step 3: Kill server, commit the deletions**

```bash
git commit -m "comics: remove layout-verification placeholder"
```

---

## Task 10: Create the 5 `comic:*` labels on GitHub

**Files:**
- Create: `scripts/setup_comic_labels.sh`

The labels drive the Phase 2/3/4 state machine (see spec). We create them idempotently via a shell script so the setup is reproducible (and re-runnable on forks).

- [ ] **Step 1: Verify `gh` CLI is installed and authenticated**

Run: `gh auth status`
Expected: "Logged in to github.com as geoffchan23"

If not authenticated: `gh auth login` (manual step; follow prompts).

- [ ] **Step 2: Create `scripts/setup_comic_labels.sh`**

```bash
mkdir -p scripts
```

Write to `scripts/setup_comic_labels.sh`:

```bash
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
```

Make it executable:
```bash
chmod +x scripts/setup_comic_labels.sh
```

- [ ] **Step 3: Run the script**

Run: `./scripts/setup_comic_labels.sh`
Expected: five lines of output like `✓ Label "comic:draft" created/updated in geoffchan23/geoffchan23.github.io`.

- [ ] **Step 4: Verify labels exist**

Run: `gh label list | grep 'comic:'`
Expected: five lines, one per label, with colors.

- [ ] **Step 5: Commit the script**

```bash
git add scripts/setup_comic_labels.sh
git commit -m "comics: add idempotent script to create comic:* labels"
```

---

## Task 11: Add `OPENAI_API_KEY` as a repo secret (manual step)

**This is a manual step — no code to write. Document it for completeness.**

- [ ] **Step 1: Navigate to repo secrets page**

Open in browser: `https://github.com/geoffchan23/geoffchan23.github.io/settings/secrets/actions`

Alternatively, use the CLI:
```bash
gh secret set OPENAI_API_KEY
# then paste the key when prompted
```

- [ ] **Step 2: Verify the secret was saved**

Run: `gh secret list`
Expected: `OPENAI_API_KEY   Updated 2026-04-24` (or whatever today's date is).

- [ ] **Step 3: Note for later plans**

The key isn't used until Plan 2 (generator). This step just ensures Plan 2 can fire without a setup detour.

- [ ] **Step 4: No commit needed** — secrets live on GitHub, not in the repo.

---

## Task 12: Final local verification + optional deploy

- [ ] **Step 1: Full local build**

Run: `bundle exec jekyll build`
Expected: clean build, no warnings.

- [ ] **Step 2: Spin up `jekyll serve` one more time and click through**

Run: `bundle exec jekyll serve --port 4000`

Walk through:
- `/` → homepage, see Comic Factory link with two tags
- `/comics/` → empty-state page ("No comics yet. Check back soon.")
- `/comics/feed.xml` → valid empty RSS
- `/art/` → unchanged, still works

Expected: everything renders; no regressions to `/art/`.

- [ ] **Step 3: Kill server**

- [ ] **Step 4: Check commit history for this plan**

Run: `git log --oneline origin/main..HEAD`
Expected: ~8 commits (one per code task).

- [ ] **Step 5: Check in with Geoff before pushing**

This plan produces visible changes on the live site (homepage link, new `/comics/` page). **Do not push to main without Geoff's explicit go-ahead** (memory: "Work locally, deploy on confirm").

When Geoff confirms: `git push origin main`.

---

## Plan Self-Review Summary

- **Spec coverage:** Plan 1 implements "Storage & data model (Jekyll collection parts)", "/comics/ page + homepage", and "Labels" sections of the spec. Phase 2/3/4 implementation and the ideation skill are deferred to Plans 2-4.
- **Deferred verification tasks from spec** (picked up in later plans): gpt-image-2 API shape (Plan 2, Task 1), `gh` issue attachment handling (Plan 4, ideation skill design).
- **Dependencies:** none; this plan stands alone.
- **Ship criteria:** `/comics/` renders the empty state; homepage link works; labels exist on GitHub; `OPENAI_API_KEY` secret set.
