# Funnies — Daily Comic Digest Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a daily comic digest at `/funnies/`. A GitHub Action runs once a day, fetches each subscribed comic's feed, and — for any comic that posted yesterday (ET) — writes a Jekyll collection doc `_funnies/YYYY-MM-DD.md`. The site renders one issue page per file, an index of issues, and an Atom feed.

**Architecture:** Static Jekyll site + Python publish script + GitHub Actions cron. All comic images are hotlinked. Subscriptions live in `_data/funnies_subscriptions.yml` and are read by both the Python script and Jekyll templates. No DB, no email, no subscriber state.

**Tech Stack:** Python 3.11 (`feedparser`, `beautifulsoup4`, `requests`, `python-dateutil`, `pyyaml`, `pytest`), Jekyll 4 (collections, Liquid), GitHub Actions.

**Project conventions:** This repo commits and pushes directly to `main` (per `MEMORY.md`). No branches or PRs. Each task ends with a commit; push at the end of the plan.

**Spec:** `docs/superpowers/specs/2026-04-29-funnies-daily-comic-digest-design.md`

---

## File map

Files this plan creates or modifies, with their responsibility:

| File | Status | Responsibility |
|---|---|---|
| `_data/funnies_subscriptions.yml` | new | Hand-curated list of subscribed comics + per-comic config (feed, image strategy, support link). Source of truth for both publish script and Jekyll templates. |
| `scripts/funnies_publish.py` | new | Python entry point. CLI: `python scripts/funnies_publish.py [--date YYYY-MM-DD]`. Pure functions for parsing/extraction, thin orchestration in `main`. |
| `scripts/requirements.txt` | modify | Add `feedparser`, `beautifulsoup4`, `requests`, `python-dateutil`, `pytest`. |
| `tests/funnies/__init__.py` | new | Package marker. |
| `tests/funnies/conftest.py` | new | Path setup so tests can `import funnies_publish`. |
| `tests/funnies/fixtures/*.{xml,html}` | new | Canned feeds and HTML pages used by tests. |
| `tests/funnies/test_funnies_publish.py` | new | All unit tests. |
| `pytest.ini` | new | Minimal pytest config (test paths, quiet mode). |
| `.github/workflows/funnies-publish.yml` | new | Daily cron + `workflow_dispatch`. Runs the script, commits any new issue file. |
| `_config.yml` | modify | Add `funnies` collection + permalink. Exclude `tests/`. |
| `_layouts/funnies-issue.html` | new | One-issue page layout. Custom (not extending `default`) so per-issue OG metadata can include the date and first strip image. |
| `_layouts/default.html` | modify | Add `<link rel="stylesheet" href="/funnies.css">` conditional for `/funnies` URLs. |
| `funnies/index.html` | new | Index of past issues + subscribed-comics section. Uses `layout: default`. |
| `funnies/feed.xml` | new | Hand-rolled Atom feed of issues (Liquid template). |
| `funnies.css` | new | Styling for issue + index pages, matching site typography. |
| `index.html` | modify | Add `/funnies/` row to the Work list. |
| `CLAUDE.md` | modify | Add a `/funnies` section describing the page (mirrors existing `/conferences` and `/tokens` blocks). |

---

## Task 1: Repo prep — tests scaffold + Python deps

**Goal:** A `pytest` test suite that can import the publish script from `scripts/`. No tests yet, just the plumbing.

**Files:**
- Modify: `scripts/requirements.txt`
- Create: `tests/funnies/__init__.py` (empty file)
- Create: `tests/funnies/conftest.py`
- Create: `pytest.ini`
- Modify: `_config.yml` (one-line addition to `exclude:`)

- [ ] **Step 1: Update `scripts/requirements.txt`**

Replace its contents with:

```
openai>=1.50.0
PyYAML>=6.0
feedparser>=6.0.10
beautifulsoup4>=4.12.0
requests>=2.31.0
python-dateutil>=2.8.2
pytest>=8.0.0
```

- [ ] **Step 2: Create the tests package**

Create `tests/funnies/__init__.py` as an empty file.

Create `tests/funnies/conftest.py`:

```python
"""Make scripts/ importable from tests."""
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO_ROOT / "scripts"))
```

- [ ] **Step 3: Create `pytest.ini` at repo root**

```ini
[pytest]
testpaths = tests
addopts = -q
```

- [ ] **Step 4: Exclude `tests/` from Jekyll build**

In `_config.yml`, find the `exclude:` block and add `- tests/` to it.

After this edit the `exclude:` block should look like (showing context):

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
  - tests/
```

- [ ] **Step 5: Install deps locally and verify pytest runs**

```
pip install -r scripts/requirements.txt
pytest
```

Expected output ends with: `no tests ran in <time>s` (and exit code 5, which is "no tests collected" — that's fine for now).

- [ ] **Step 6: Commit**

```
git add scripts/requirements.txt tests/funnies/__init__.py tests/funnies/conftest.py pytest.ini _config.yml
git commit -m "funnies: scaffold pytest suite and add Python deps"
```

---

## Task 2: Subscriptions data file

**Goal:** Hand-curated `_data/funnies_subscriptions.yml` populated with the four starter comics. This file is the single source of truth for which comics the digest follows; it's read by the Python script and the Jekyll templates.

**Files:**
- Create: `_data/funnies_subscriptions.yml`

- [ ] **Step 1: Write the subscriptions file**

Create `_data/funnies_subscriptions.yml`:

```yaml
# Subscribed comics for the daily /funnies digest.
# Schema:
#   id              internal slug, must be unique
#   name            display name
#   artist          display name of the artist (used in attribution)
#   homepage        artist's website root
#   feed            RSS/Atom URL
#   image_strategy  feed | og | scrape
#                     feed   - first <img> in entry description/content
#                     og     - <meta property="og:image"> on the entry's link page
#                     scrape - css selector against the entry's link page
#   image_selector  CSS selector, only used when image_strategy: scrape
#   support
#     label         button label, e.g. "Shop", "Patreon", "Tip jar"
#     url           where the button links to
#   active          true to include in the digest, false to suspend
- id: oatmeal
  name: "The Oatmeal"
  artist: "Matthew Inman"
  homepage: "https://theoatmeal.com"
  feed: "https://theoatmeal.com/feed/rss"
  image_strategy: feed
  image_selector: ""
  support:
    label: "Shop"
    url: "https://theoatmeal.com/store"
  active: true

- id: monkeyuser
  name: "MonkeyUser"
  artist: "MonkeyUser"
  homepage: "https://www.monkeyuser.com"
  feed: "https://www.monkeyuser.com/rss.xml"
  image_strategy: og
  image_selector: ""
  support:
    label: "Patreon"
    url: "https://www.patreon.com/monkeyuser"
  active: true

- id: kohney
  name: "The Other End Comics"
  artist: "Neil Kohney"
  homepage: "https://www.kohney.com"
  feed: "https://www.kohney.com/feed"
  image_strategy: feed
  image_selector: ""
  support:
    label: "Patreon"
    url: "https://www.patreon.com/TheOtherEnd"
  active: true

- id: davecontra
  name: "Davecontra"
  artist: "Dave"
  homepage: "https://davecontra.com"
  feed: "https://davecontra.com/comics?format=rss"
  image_strategy: feed
  image_selector: ""
  support:
    label: "Patreon"
    url: "https://www.patreon.com/davecontra/membership"
  active: true
```

- [ ] **Step 2: Verify YAML parses**

```
python -c "import yaml; print(len(yaml.safe_load(open('_data/funnies_subscriptions.yml'))))"
```

Expected output: `4`

- [ ] **Step 3: Commit**

```
git add _data/funnies_subscriptions.yml
git commit -m "funnies: add starter subscription list"
```

---

## Task 3: `load_subscriptions` (TDD)

**Goal:** Pure function that loads the subscriptions YAML and returns a list of dicts, filtering to `active: true`.

**Files:**
- Create: `scripts/funnies_publish.py` (skeleton + first function)
- Create: `tests/funnies/test_funnies_publish.py`

- [ ] **Step 1: Write the failing test**

Create `tests/funnies/test_funnies_publish.py`:

```python
"""Tests for scripts/funnies_publish.py."""
from pathlib import Path
import textwrap

import funnies_publish as fp


def test_load_subscriptions_returns_only_active(tmp_path: Path) -> None:
    yaml_path = tmp_path / "subs.yml"
    yaml_path.write_text(textwrap.dedent("""\
        - id: a
          name: "A"
          active: true
        - id: b
          name: "B"
          active: false
        - id: c
          name: "C"
          active: true
    """))

    subs = fp.load_subscriptions(yaml_path)

    assert [s["id"] for s in subs] == ["a", "c"]
```

- [ ] **Step 2: Run test, verify failure**

```
pytest tests/funnies/test_funnies_publish.py::test_load_subscriptions_returns_only_active -v
```

Expected: ImportError or `AttributeError: module 'funnies_publish' has no attribute 'load_subscriptions'`.

- [ ] **Step 3: Write minimal implementation**

Create `scripts/funnies_publish.py`:

```python
"""Publish script for the daily /funnies digest.

Reads `_data/funnies_subscriptions.yml`, fetches each comic's feed, and
writes a `_funnies/YYYY-MM-DD.md` Jekyll collection doc for any day that
had at least one new strip published (by ET date).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


def load_subscriptions(path: Path) -> list[dict[str, Any]]:
    """Load subscriptions from YAML, returning only active entries."""
    raw = yaml.safe_load(path.read_text()) or []
    return [entry for entry in raw if entry.get("active", False)]
```

- [ ] **Step 4: Run test, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 1 passed.

- [ ] **Step 5: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py
git commit -m "funnies: load_subscriptions filters to active entries"
```

---

## Task 4: Date utilities (TDD)

**Goal:** `target_date_et(now)` returns yesterday's date in `America/New_York`. `parse_pub_date_et(text)` parses the various date formats found in feeds and returns a `datetime.date` in ET.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
from datetime import date, datetime, timezone


def test_target_date_et_returns_yesterday() -> None:
    # 13:00 UTC on 2026-04-29 == 09:00 ET on 2026-04-29.
    # "Yesterday in ET" should be 2026-04-28.
    now = datetime(2026, 4, 29, 13, 0, tzinfo=timezone.utc)
    assert fp.target_date_et(now) == date(2026, 4, 28)


def test_target_date_et_handles_et_midnight_boundary() -> None:
    # 03:30 UTC on 2026-04-29 == 23:30 ET on 2026-04-28.
    # "Yesterday in ET" should be 2026-04-27.
    now = datetime(2026, 4, 29, 3, 30, tzinfo=timezone.utc)
    assert fp.target_date_et(now) == date(2026, 4, 27)


def test_parse_pub_date_et_rss_format() -> None:
    # RSS pubDate, UTC.
    assert fp.parse_pub_date_et("Wed, 04 Feb 2026 04:03:13 +0000") == date(2026, 2, 3)


def test_parse_pub_date_et_atom_format() -> None:
    assert fp.parse_pub_date_et("2026-04-28T17:58:01+02:00") == date(2026, 4, 28)


def test_parse_pub_date_et_returns_none_on_garbage() -> None:
    assert fp.parse_pub_date_et("not a date") is None
    assert fp.parse_pub_date_et("") is None
    assert fp.parse_pub_date_et(None) is None
```

- [ ] **Step 2: Run, verify failures**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 5 new test failures (`AttributeError`).

- [ ] **Step 3: Implement**

Add to the top of `scripts/funnies_publish.py` (after the existing imports):

```python
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from dateutil import parser as dateutil_parser

ET = ZoneInfo("America/New_York")


def target_date_et(now: datetime | None = None) -> date:
    """Return yesterday's date in America/New_York."""
    if now is None:
        now = datetime.now(timezone.utc)
    et_now = now.astimezone(ET)
    return (et_now - timedelta(days=1)).date()


def parse_pub_date_et(text: str | None) -> date | None:
    """Parse an RSS/Atom date string and return its ET calendar date.

    Returns None for empty input or unparseable strings.
    """
    if not text:
        return None
    try:
        dt = dateutil_parser.parse(text)
    except (ValueError, TypeError, OverflowError):
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(ET).date()
```

- [ ] **Step 4: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 6 passed total.

- [ ] **Step 5: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py
git commit -m "funnies: add ET date utilities for issue scheduling"
```

---

## Task 5: Feed parsing & date filtering (TDD)

**Goal:** `parse_feed(xml_text)` returns a list of `{title, link, pub_date_et, raw_description}` dicts. `entries_published_on(entries, target)` filters to entries whose `pub_date_et == target`.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`
- Create: `tests/funnies/fixtures/oatmeal_feed.xml`

- [ ] **Step 1: Create fixture**

Create `tests/funnies/fixtures/oatmeal_feed.xml`. This is a trimmed, two-entry version of the real Oatmeal RSS feed that's enough to exercise our parser:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns="http://purl.org/rss/1.0/"
         xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel rdf:about="http://theoatmeal.com/feed/rss">
    <title>The Oatmeal - Comics, Quizzes, &amp; Stories</title>
    <link>http://theoatmeal.com/</link>
    <description>The oatmeal tastes better than stale skittles found under the couch cushions</description>
  </channel>
  <item rdf:about="http://theoatmeal.com/comics/finish_drawing?no_popup=1">
    <dc:format>text/html</dc:format>
    <dc:date>2026-04-28T17:58:01+02:00</dc:date>
    <dc:creator>Matthew Inman</dc:creator>
    <title>Finish the drawing. It is NOT a plane!</title>
    <link>http://theoatmeal.com/comics/finish_drawing?no_popup=1</link>
    <description>&lt;a href="http://theoatmeal.com/comics/finish_drawing"&gt;&lt;img src="https://s3.amazonaws.com/theoatmeal-img/thumbnails/finish_drawing_big.png" /&gt;&lt;/a&gt;</description>
  </item>
  <item rdf:about="http://theoatmeal.com/comics/naked_mole_rats?no_popup=1">
    <dc:format>text/html</dc:format>
    <dc:date>2026-02-26T12:00:00+01:00</dc:date>
    <dc:creator>Matthew Inman</dc:creator>
    <title>We need to talk about naked mole rats</title>
    <link>http://theoatmeal.com/comics/naked_mole_rats?no_popup=1</link>
    <description>&lt;a href="http://theoatmeal.com/comics/naked_mole_rats"&gt;&lt;img src="https://s3.amazonaws.com/theoatmeal-img/thumbnails/naked_mole_rats_big.png" /&gt;&lt;/a&gt;</description>
  </item>
</rdf:RDF>
```

- [ ] **Step 2: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
FIXTURES = Path(__file__).parent / "fixtures"


def test_parse_feed_returns_entries_with_expected_fields() -> None:
    xml = (FIXTURES / "oatmeal_feed.xml").read_text()
    entries = fp.parse_feed(xml)

    assert len(entries) == 2
    first = entries[0]
    assert first["title"] == "Finish the drawing. It is NOT a plane!"
    assert first["link"] == "http://theoatmeal.com/comics/finish_drawing?no_popup=1"
    assert first["pub_date_et"] == date(2026, 4, 28)
    assert "finish_drawing_big.png" in first["raw_description"]


def test_entries_published_on_filters_to_target_date() -> None:
    xml = (FIXTURES / "oatmeal_feed.xml").read_text()
    entries = fp.parse_feed(xml)

    matching = fp.entries_published_on(entries, date(2026, 4, 28))
    assert len(matching) == 1
    assert matching[0]["title"].startswith("Finish the drawing")

    none_for_date = fp.entries_published_on(entries, date(2026, 4, 29))
    assert none_for_date == []
```

- [ ] **Step 3: Run, verify failure**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 2 new failures.

- [ ] **Step 4: Implement**

Add to `scripts/funnies_publish.py`:

```python
import feedparser


def parse_feed(xml_text: str) -> list[dict[str, Any]]:
    """Parse RSS/Atom XML and return our normalized entry dicts.

    Each dict has: title, link, pub_date_et (date or None), raw_description.
    Entries with no parseable date are returned with pub_date_et=None;
    callers decide whether to drop them.
    """
    parsed = feedparser.parse(xml_text)
    entries: list[dict[str, Any]] = []
    for e in parsed.entries:
        # feedparser exposes pubDate / dc:date / updated under various keys;
        # `published` / `updated` are the normalized ones it picks for us.
        raw_date = e.get("published") or e.get("updated") or e.get("created")
        # `description` covers RSS <description>; `content` covers Atom and content:encoded.
        raw_description = e.get("description", "") or ""
        if not raw_description and getattr(e, "content", None):
            raw_description = e.content[0].get("value", "") if e.content else ""
        entries.append({
            "title": e.get("title", "").strip(),
            "link": e.get("link", "").strip(),
            "pub_date_et": parse_pub_date_et(raw_date),
            "raw_description": raw_description,
        })
    return entries


def entries_published_on(entries: list[dict[str, Any]], target: date) -> list[dict[str, Any]]:
    """Return entries whose pub_date_et equals target."""
    return [e for e in entries if e["pub_date_et"] == target]
```

- [ ] **Step 5: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 8 passed.

- [ ] **Step 6: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py tests/funnies/fixtures/oatmeal_feed.xml
git commit -m "funnies: parse feeds and filter entries by ET pub date"
```

---

## Task 6: Image extraction — `feed` strategy (TDD)

**Goal:** `extract_image_feed(raw_description)` returns the first `<img src=…>` from the entry's HTML description, or `None` if none found.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
def test_extract_image_feed_pulls_first_img_src() -> None:
    description = (
        '<a href="http://example.com/x"><img src="https://cdn.example.com/x.png" /></a>'
        '<img src="https://cdn.example.com/y.png" />'
    )
    assert fp.extract_image_feed(description) == "https://cdn.example.com/x.png"


def test_extract_image_feed_returns_none_when_no_img() -> None:
    assert fp.extract_image_feed("") is None
    assert fp.extract_image_feed("<p>just text</p>") is None
    assert fp.extract_image_feed("<img>") is None  # no src attr
```

- [ ] **Step 2: Run, verify failure**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 2 new failures.

- [ ] **Step 3: Implement**

Add to `scripts/funnies_publish.py`:

```python
from bs4 import BeautifulSoup


def extract_image_feed(raw_description: str) -> str | None:
    """Return the first <img src=...> URL inside the description, or None."""
    if not raw_description:
        return None
    soup = BeautifulSoup(raw_description, "html.parser")
    img = soup.find("img", src=True)
    return img["src"] if img else None
```

- [ ] **Step 4: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 10 passed.

- [ ] **Step 5: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py
git commit -m "funnies: feed-strategy image extraction"
```

---

## Task 7: Image extraction — `og` and `scrape` strategies + ladder (TDD)

**Goal:** Two more pure functions plus the dispatch ladder. `extract_image_og(html)` reads `<meta property="og:image">`. `extract_image_scrape(html, selector)` returns the first matching element's `src`. `extract_image(comic, entry, fetcher)` runs the configured strategy and falls forward to `og` if it returns nothing.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`
- Create: `tests/funnies/fixtures/monkeyuser_button_page.html`

- [ ] **Step 1: Create the HTML fixture**

Create `tests/funnies/fixtures/monkeyuser_button_page.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Just a button</title>
  <meta property="og:title" content="Just a button" />
  <meta property="og:image" content="https://www.monkeyuser.com/2025/button/justabutton.png" />
</head>
<body>
  <article>
    <h1>Just a button</h1>
    <img class="comic-strip" src="https://www.monkeyuser.com/2025/button/justabutton.png" alt="Just a button">
  </article>
</body>
</html>
```

- [ ] **Step 2: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
def test_extract_image_og_reads_meta_property() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image_og(html) == "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_og_returns_none_when_missing() -> None:
    assert fp.extract_image_og("<html><head></head><body></body></html>") is None


def test_extract_image_scrape_uses_selector() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    url = fp.extract_image_scrape(html, "article img.comic-strip")
    assert url == "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_scrape_returns_none_when_selector_misses() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image_scrape(html, "img.no-such-class") is None


def test_extract_image_uses_feed_strategy_when_configured() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {
        "raw_description": '<img src="https://cdn.example.com/x.png" />',
        "link": "https://example.com/post/x",
    }
    # Fetcher should NOT be called for feed strategy.
    def boom(_url: str) -> str:
        raise AssertionError("fetcher should not be called")
    assert fp.extract_image(comic, entry, fetcher=boom) == "https://cdn.example.com/x.png"


def test_extract_image_uses_og_strategy_via_fetcher() -> None:
    comic = {"image_strategy": "og", "image_selector": ""}
    entry = {"raw_description": "", "link": "https://example.com/post/x"}
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    fetched: list[str] = []
    def fetcher(url: str) -> str:
        fetched.append(url)
        return html
    url = fp.extract_image(comic, entry, fetcher=fetcher)
    assert url == "https://www.monkeyuser.com/2025/button/justabutton.png"
    assert fetched == ["https://example.com/post/x"]


def test_extract_image_falls_forward_to_og_when_feed_empty() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {"raw_description": "<p>no image here</p>", "link": "https://example.com/post/x"}
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image(comic, entry, fetcher=lambda _u: html) == \
        "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_returns_none_when_all_strategies_miss() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {"raw_description": "", "link": "https://example.com/post/x"}
    bare_html = "<html><head></head><body></body></html>"
    assert fp.extract_image(comic, entry, fetcher=lambda _u: bare_html) is None
```

- [ ] **Step 3: Run, verify failures**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 8 new failures.

- [ ] **Step 4: Implement**

Add to `scripts/funnies_publish.py`:

```python
from typing import Callable

Fetcher = Callable[[str], str]


def extract_image_og(html: str) -> str | None:
    """Return the og:image URL from <meta property='og:image'>, or None."""
    soup = BeautifulSoup(html, "html.parser")
    meta = soup.find("meta", attrs={"property": "og:image"})
    if meta and meta.get("content"):
        return meta["content"].strip() or None
    return None


def extract_image_scrape(html: str, selector: str) -> str | None:
    """Return the first matching element's src, or None."""
    if not selector:
        return None
    soup = BeautifulSoup(html, "html.parser")
    el = soup.select_one(selector)
    if el and el.get("src"):
        return el["src"].strip() or None
    return None


def extract_image(
    comic: dict[str, Any],
    entry: dict[str, Any],
    fetcher: Fetcher,
) -> str | None:
    """Run the comic's configured strategy, falling forward to `og` if empty.

    Returns the image URL or None. The script logs failure at the call site.
    """
    strategy = comic.get("image_strategy", "feed")

    # First try the configured strategy.
    if strategy == "feed":
        url = extract_image_feed(entry.get("raw_description", ""))
        if url:
            return url
    elif strategy == "og":
        html = fetcher(entry["link"])
        url = extract_image_og(html)
        if url:
            return url
    elif strategy == "scrape":
        html = fetcher(entry["link"])
        url = extract_image_scrape(html, comic.get("image_selector", ""))
        if url:
            return url

    # Fall forward to og (only if we haven't already tried it).
    if strategy != "og" and entry.get("link"):
        html = fetcher(entry["link"])
        return extract_image_og(html)

    return None
```

- [ ] **Step 5: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 18 passed.

- [ ] **Step 6: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py tests/funnies/fixtures/monkeyuser_button_page.html
git commit -m "funnies: og + scrape image strategies and fall-forward ladder"
```

---

## Task 8: Build strip + write issue (TDD)

**Goal:** `build_strip(comic, entry, image_url)` returns the per-strip dict that ends up in front matter. `write_issue(target_date, strips, funnies_dir)` serializes it to `_funnies/YYYY-MM-DD.md`.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
def test_build_strip_assembles_expected_fields() -> None:
    comic = {
        "id": "oatmeal",
        "name": "The Oatmeal",
        "artist": "Matthew Inman",
        "homepage": "https://theoatmeal.com",
        "support": {"label": "Shop", "url": "https://theoatmeal.com/store"},
    }
    entry = {
        "title": "Finish the drawing",
        "link": "http://theoatmeal.com/comics/finish_drawing",
    }
    strip = fp.build_strip(comic, entry, "https://cdn.example.com/x.png")

    assert strip == {
        "comic_id": "oatmeal",
        "comic_name": "The Oatmeal",
        "artist": "Matthew Inman",
        "homepage": "https://theoatmeal.com",
        "title": "Finish the drawing",
        "image_url": "https://cdn.example.com/x.png",
        "source_url": "http://theoatmeal.com/comics/finish_drawing",
        "support": {"label": "Shop", "url": "https://theoatmeal.com/store"},
    }


def test_build_strip_omits_support_when_missing() -> None:
    comic = {
        "id": "x",
        "name": "X",
        "artist": "Anon",
        "homepage": "https://x.example",
    }
    entry = {"title": "T", "link": "https://x.example/t"}
    strip = fp.build_strip(comic, entry, "https://x.example/t.png")

    assert "support" not in strip


def test_write_issue_creates_file_with_yaml_front_matter(tmp_path: Path) -> None:
    funnies_dir = tmp_path / "_funnies"
    strips = [
        {
            "comic_id": "oatmeal",
            "comic_name": "The Oatmeal",
            "artist": "Matthew Inman",
            "homepage": "https://theoatmeal.com",
            "title": "Finish the drawing",
            "image_url": "https://cdn.example.com/x.png",
            "source_url": "http://theoatmeal.com/comics/finish_drawing",
            "support": {"label": "Shop", "url": "https://theoatmeal.com/store"},
        }
    ]
    out_path = fp.write_issue(date(2026, 4, 28), strips, funnies_dir)

    assert out_path == funnies_dir / "2026-04-28.md"
    contents = out_path.read_text()
    assert contents.startswith("---\n")
    assert "layout: funnies-issue\n" in contents
    assert "date: 2026-04-28\n" in contents
    assert "comic_id: oatmeal" in contents
    assert "image_url: https://cdn.example.com/x.png" in contents
    assert contents.rstrip().endswith("---")


def test_write_issue_overwrites_existing(tmp_path: Path) -> None:
    funnies_dir = tmp_path / "_funnies"
    funnies_dir.mkdir()
    (funnies_dir / "2026-04-28.md").write_text("stale")

    fp.write_issue(date(2026, 4, 28), [
        {
            "comic_id": "x", "comic_name": "X", "artist": "A",
            "homepage": "https://x", "title": "T",
            "image_url": "https://x/t.png", "source_url": "https://x/t",
        }
    ], funnies_dir)

    assert "stale" not in (funnies_dir / "2026-04-28.md").read_text()
```

- [ ] **Step 2: Run, verify failure**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 4 new failures.

- [ ] **Step 3: Implement**

Add to `scripts/funnies_publish.py`:

```python
def build_strip(
    comic: dict[str, Any],
    entry: dict[str, Any],
    image_url: str,
) -> dict[str, Any]:
    """Build the per-strip dict that goes into the issue's front matter."""
    strip: dict[str, Any] = {
        "comic_id": comic["id"],
        "comic_name": comic["name"],
        "artist": comic["artist"],
        "homepage": comic["homepage"],
        "title": entry["title"],
        "image_url": image_url,
        "source_url": entry["link"],
    }
    if comic.get("support"):
        strip["support"] = comic["support"]
    return strip


def write_issue(target: date, strips: list[dict[str, Any]], funnies_dir: Path) -> Path:
    """Write _funnies/YYYY-MM-DD.md with the strip list in front matter."""
    funnies_dir.mkdir(parents=True, exist_ok=True)
    out_path = funnies_dir / f"{target.isoformat()}.md"

    # We hand-construct the front matter (rather than yaml.dump on the whole thing)
    # so the date stays unquoted and key order is stable.
    body_data = {
        "layout": "funnies-issue",
        "date": target.isoformat(),
        "strips": strips,
    }
    front_matter = yaml.safe_dump(
        body_data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    )
    out_path.write_text(f"---\n{front_matter}---\n")
    return out_path
```

- [ ] **Step 4: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 22 passed.

- [ ] **Step 5: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py
git commit -m "funnies: build_strip and write_issue serialization"
```

---

## Task 9: `main` orchestration + CLI (TDD)

**Goal:** `run(target_date, subscriptions_path, funnies_dir, fetcher)` does the full pipeline and returns the path written (or `None` if there was nothing to write). `main(argv)` wires up `argparse` and HTTP, callable from `__main__`.

**Files:**
- Modify: `scripts/funnies_publish.py`
- Modify: `tests/funnies/test_funnies_publish.py`

- [ ] **Step 1: Write failing tests**

Append to `tests/funnies/test_funnies_publish.py`:

```python
import textwrap as _tw


def test_run_writes_issue_with_strips_from_matching_entries(tmp_path: Path) -> None:
    subs = tmp_path / "subs.yml"
    subs.write_text(_tw.dedent("""\
        - id: oatmeal
          name: "The Oatmeal"
          artist: "Matthew Inman"
          homepage: "https://theoatmeal.com"
          feed: "https://theoatmeal.com/feed/rss"
          image_strategy: feed
          image_selector: ""
          support:
            label: "Shop"
            url: "https://theoatmeal.com/store"
          active: true
    """))
    funnies_dir = tmp_path / "_funnies"

    feed_xml = (FIXTURES / "oatmeal_feed.xml").read_text()
    def fetcher(url: str) -> str:
        assert url == "https://theoatmeal.com/feed/rss"
        return feed_xml

    written = fp.run(
        target_date=date(2026, 4, 28),
        subscriptions_path=subs,
        funnies_dir=funnies_dir,
        fetcher=fetcher,
    )

    assert written == funnies_dir / "2026-04-28.md"
    text = written.read_text()
    assert "Finish the drawing" in text
    assert "finish_drawing_big.png" in text


def test_run_writes_nothing_when_no_strips_match(tmp_path: Path) -> None:
    subs = tmp_path / "subs.yml"
    subs.write_text(_tw.dedent("""\
        - id: oatmeal
          name: "The Oatmeal"
          artist: "Matthew Inman"
          homepage: "https://theoatmeal.com"
          feed: "https://theoatmeal.com/feed/rss"
          image_strategy: feed
          image_selector: ""
          support:
            label: "Shop"
            url: "https://theoatmeal.com/store"
          active: true
    """))
    funnies_dir = tmp_path / "_funnies"
    feed_xml = (FIXTURES / "oatmeal_feed.xml").read_text()

    written = fp.run(
        target_date=date(2099, 1, 1),
        subscriptions_path=subs,
        funnies_dir=funnies_dir,
        fetcher=lambda _u: feed_xml,
    )

    assert written is None
    assert not funnies_dir.exists() or list(funnies_dir.iterdir()) == []


def test_run_skips_comic_when_feed_fetch_fails(tmp_path: Path) -> None:
    subs = tmp_path / "subs.yml"
    subs.write_text(_tw.dedent("""\
        - id: oatmeal
          name: "The Oatmeal"
          artist: "Matthew Inman"
          homepage: "https://theoatmeal.com"
          feed: "https://theoatmeal.com/feed/rss"
          image_strategy: feed
          image_selector: ""
          active: true
        - id: working
          name: "Working"
          artist: "X"
          homepage: "https://x.example"
          feed: "https://x.example/feed"
          image_strategy: feed
          image_selector: ""
          active: true
    """))
    funnies_dir = tmp_path / "_funnies"
    feed_xml = (FIXTURES / "oatmeal_feed.xml").read_text()

    def fetcher(url: str) -> str:
        if "theoatmeal" in url:
            raise RuntimeError("simulated 500")
        return feed_xml.replace("Matthew Inman", "X").replace("The Oatmeal", "Working")

    # Should not raise — failed comic is skipped, working comic still produces an issue.
    written = fp.run(
        target_date=date(2026, 4, 28),
        subscriptions_path=subs,
        funnies_dir=funnies_dir,
        fetcher=fetcher,
    )

    assert written is not None
    text = written.read_text()
    assert "comic_id: working" in text
    assert "comic_id: oatmeal" not in text


def test_main_parses_date_argument(tmp_path: Path, monkeypatch) -> None:
    """End-to-end smoke for the CLI: --date drives target_date."""
    subs = tmp_path / "subs.yml"
    subs.write_text("[]")
    funnies_dir = tmp_path / "_funnies"

    captured: dict[str, Any] = {}
    def fake_run(target_date, subscriptions_path, funnies_dir, fetcher):
        captured["target_date"] = target_date
        return None

    monkeypatch.setattr(fp, "run", fake_run)
    rc = fp.main([
        "--date", "2026-04-28",
        "--subscriptions", str(subs),
        "--funnies-dir", str(funnies_dir),
    ])

    assert rc == 0
    assert captured["target_date"] == date(2026, 4, 28)
```

- [ ] **Step 2: Run, verify failure**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 4 new failures.

- [ ] **Step 3: Implement**

Add to `scripts/funnies_publish.py`:

```python
import argparse
import logging
import sys

import requests

logger = logging.getLogger("funnies_publish")


def http_fetcher(url: str) -> str:
    """Fetch a URL and return its decoded body. Raises on non-2xx."""
    resp = requests.get(url, timeout=20, headers={
        "User-Agent": "funnies-publish/1.0 (+https://geoffreychan.com/funnies/)",
    })
    resp.raise_for_status()
    return resp.text


def run(
    target_date: date,
    subscriptions_path: Path,
    funnies_dir: Path,
    fetcher: Fetcher,
) -> Path | None:
    """Execute one publishing run for `target_date`. Returns the written path or None."""
    subs = load_subscriptions(subscriptions_path)
    strips: list[dict[str, Any]] = []

    for comic in subs:
        cid = comic.get("id", "?")
        try:
            xml = fetcher(comic["feed"])
        except Exception as exc:
            logger.warning("feed fetch failed for %s: %s", cid, exc)
            continue

        entries = parse_feed(xml)
        matching = entries_published_on(entries, target_date)
        if not matching:
            continue

        for entry in matching:
            try:
                image_url = extract_image(comic, entry, fetcher)
            except Exception as exc:
                logger.warning("image extract failed for %s entry %r: %s",
                               cid, entry.get("title"), exc)
                continue
            if not image_url:
                logger.warning("no image found for %s entry %r", cid, entry.get("title"))
                continue
            strips.append(build_strip(comic, entry, image_url))

    if not strips:
        logger.info("no strips on %s; nothing to write", target_date.isoformat())
        return None

    out = write_issue(target_date, strips, funnies_dir)
    logger.info("wrote %s with %d strip(s)", out, len(strips))
    return out


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Publish a daily /funnies issue.")
    parser.add_argument("--date", help="Target ET date YYYY-MM-DD (default: yesterday in ET).")
    parser.add_argument(
        "--subscriptions",
        default="_data/funnies_subscriptions.yml",
        help="Path to subscriptions YAML.",
    )
    parser.add_argument(
        "--funnies-dir",
        default="_funnies",
        help="Output directory for issue files.",
    )
    args = parser.parse_args(argv)

    logging.basicConfig(level=logging.INFO, format="%(levelname)s %(message)s")

    if args.date:
        try:
            target = date.fromisoformat(args.date)
        except ValueError:
            parser.error(f"invalid --date {args.date!r}, expected YYYY-MM-DD")
    else:
        target = target_date_et()

    run(
        target_date=target,
        subscriptions_path=Path(args.subscriptions),
        funnies_dir=Path(args.funnies_dir),
        fetcher=http_fetcher,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run, verify pass**

```
pytest tests/funnies/test_funnies_publish.py -v
```

Expected: 26 passed.

- [ ] **Step 5: Commit**

```
git add scripts/funnies_publish.py tests/funnies/test_funnies_publish.py
git commit -m "funnies: orchestration, CLI, and HTTP fetcher"
```

---

## Task 10: Smoke-test against real feeds

**Goal:** Run the script for a real past date and visually confirm the output. We pick a date we know has at least one strip.

**Files:**
- (None permanent. We'll generate a `_funnies/<date>.md` and inspect it. Whether to keep it depends on whether it's a sensible historical issue.)

- [ ] **Step 1: Pick a target date**

The Oatmeal published on 2026-04-28 (per the spec audit). Use that.

```
python scripts/funnies_publish.py --date 2026-04-28
```

Expected log output ends with `INFO wrote _funnies/2026-04-28.md with N strip(s)` where N ≥ 1.

- [ ] **Step 2: Inspect the output**

```
cat _funnies/2026-04-28.md
```

Expected: YAML front matter with `layout: funnies-issue`, `date: 2026-04-28`, and at least one entry under `strips:` with sensible `comic_name`, `title`, `image_url`, `source_url`, and `support` block. No tracebacks, no obviously broken URLs.

- [ ] **Step 3: Optionally test another date**

```
python scripts/funnies_publish.py --date 2099-01-01
```

Expected: log line `INFO no strips on 2099-01-01; nothing to write` and no file created.

- [ ] **Step 4: Decide whether to keep the smoke-test issue file**

If `_funnies/2026-04-28.md` looks like a real, sensible issue, keep it as the historical first issue. If it's malformed in any way, delete it:

```
rm _funnies/2026-04-28.md
```

Then re-run only after fixing the bug; never commit a broken issue file.

- [ ] **Step 5: Commit if keeping the file**

```
git add _funnies/2026-04-28.md
git commit -m "funnies: first historical issue (2026-04-28)"
```

If the file was deleted in Step 4, skip this commit.

---

## Task 11: Jekyll collection + issue layout

**Goal:** Configure the `funnies` collection in `_config.yml` and create the issue page layout. After this task, the smoke-test issue file from Task 10 (if kept) renders at `/funnies/2026-04-28/`.

**Files:**
- Modify: `_config.yml`
- Create: `_layouts/funnies-issue.html`

- [ ] **Step 1: Configure the collection**

In `_config.yml`, find the existing `collections:` block and add a `funnies` entry. Also add a `defaults` rule so issue docs don't have to set `layout` themselves (though the publish script does set it explicitly — this is belt-and-suspenders).

After your edit the `collections:` block should read:

```yaml
collections:
  art:
    output: true
    permalink: /art/:title/
  comics:
    output: true
    permalink: /comics/:title/
  funnies:
    output: true
    permalink: /funnies/:path/
```

And the `defaults:` block should read:

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
  - scope:
      path: ""
      type: funnies
    values:
      layout: funnies-issue
```

The collection's `permalink: /funnies/:path/` resolves `:path` to the doc's bare filename (no extension), so `_funnies/2026-04-28.md` becomes `/funnies/2026-04-28/`.

- [ ] **Step 2: Create the issue layout**

Create `_layouts/funnies-issue.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    {% assign issue_date = page.date | date: "%A, %B %-d, %Y" %}
    {% assign first_image = page.strips[0].image_url %}
    {% assign issue_title = "Funnies — " | append: issue_date %}
    <title>{{ issue_title }}</title>
    <meta name="description" content="Daily comic digest from artists Geoff Chan subscribes to. Issue for {{ issue_date }}.">
    <link rel="canonical" href="{{ site.url }}{{ page.url }}">
    <meta property="og:title" content="{{ issue_title }}">
    <meta property="og:description" content="Daily comic digest from artists Geoff Chan subscribes to.">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{ site.url }}{{ page.url }}">
    {% if first_image %}
    <meta property="og:image" content="{{ first_image }}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="{{ first_image }}">
    {% endif %}
    <meta name="twitter:title" content="{{ issue_title }}">
    <link rel="alternate" type="application/atom+xml" title="Funnies" href="/funnies/feed.xml">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/reset.css">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/funnies.css">
    <script data-goatcounter="https://geoffchan23.goatcounter.com/count"
            async src="//gc.zgo.at/count.js"></script>
</head>
<body>
    <div class="container funnies-container">
        <header>
            <div>
                <a href="/funnies/"><h1>funnies</h1></a>
                <span>daily comic digest</span>
            </div>
            <nav>
                <a href="/">Home</a>
                <a href="/funnies/">Index</a>
            </nav>
        </header>

        <main>
            {% assign all_issues = site.funnies | sort: 'date' %}
            {% assign current_index = 0 %}
            {% for iss in all_issues %}
                {% if iss.url == page.url %}
                    {% assign current_index = forloop.index0 %}
                    {% break %}
                {% endif %}
            {% endfor %}
            {% assign prev_issue = nil %}
            {% assign next_issue = nil %}
            {% if current_index > 0 %}
                {% assign prev_issue = all_issues[current_index | minus: 1] %}
            {% endif %}
            {% assign next_index = current_index | plus: 1 %}
            {% if next_index < all_issues.size %}
                {% assign next_issue = all_issues[next_index] %}
            {% endif %}

            <section class="funnies-issue-header">
                <h2 class="funnies-issue-title">Funnies — {{ issue_date }}</h2>
                <nav class="funnies-issue-nav">
                    {% if prev_issue %}
                        <a href="{{ prev_issue.url }}">← {{ prev_issue.date | date: "%b %-d" }}</a>
                    {% else %}
                        <span class="funnies-issue-nav-disabled">← previous</span>
                    {% endif %}
                    {% if next_issue %}
                        <a href="{{ next_issue.url }}">{{ next_issue.date | date: "%b %-d" }} →</a>
                    {% else %}
                        <span class="funnies-issue-nav-disabled">next →</span>
                    {% endif %}
                </nav>
            </section>

            <section class="funnies-strips">
                {% for strip in page.strips %}
                <article class="funnies-strip">
                    <a href="{{ strip.source_url }}" class="funnies-strip-image-link"
                       target="_blank" rel="noopener">
                        <img src="{{ strip.image_url }}" alt="{{ strip.title | escape }}" loading="lazy">
                    </a>
                    <div class="funnies-strip-meta">
                        <h3 class="funnies-strip-title">{{ strip.title }}</h3>
                        <p class="funnies-strip-attribution">
                            {{ strip.artist }} ·
                            <a href="{{ strip.homepage }}" target="_blank" rel="noopener">{{ strip.comic_name }}</a>
                        </p>
                        <p class="funnies-strip-actions">
                            <a class="funnies-strip-action" href="{{ strip.source_url }}"
                               target="_blank" rel="noopener">Read on {{ strip.comic_name }} ↗</a>
                            {% if strip.support %}
                            <a class="funnies-strip-action funnies-strip-action-support"
                               href="{{ strip.support.url }}" target="_blank" rel="noopener">
                                Support {{ strip.artist }}: {{ strip.support.label }} ↗
                            </a>
                            {% endif %}
                        </p>
                    </div>
                </article>
                {% endfor %}
            </section>
        </main>
    </div>
</body>
</html>
```

- [ ] **Step 3: Verify Jekyll builds without errors**

```
bundle exec jekyll build
```

Expected: completes with `done in <time> seconds.` and no `Liquid Exception` lines.

- [ ] **Step 4: Commit**

```
git add _config.yml _layouts/funnies-issue.html
git commit -m "funnies: add jekyll collection and issue layout"
```

---

## Task 12: Styling — `funnies.css`

**Goal:** Minimal stylesheet for issue + index pages. Match the rest of the site (Libre Baskerville, lots of whitespace, no card chrome).

**Files:**
- Create: `funnies.css`
- Modify: `_layouts/default.html`

- [ ] **Step 1: Create `funnies.css`**

Create `funnies.css` at the repo root:

```css
/* Funnies — daily comic digest */

.funnies-container header {
    margin-bottom: 2rem;
}

/* ---------- Issue page ---------- */

.funnies-issue-header {
    margin-bottom: 2.5rem;
}

.funnies-issue-title {
    margin: 0 0 0.5rem 0;
}

.funnies-issue-nav {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
}

.funnies-issue-nav-disabled {
    color: #aaa;
}

.funnies-strips {
    display: flex;
    flex-direction: column;
    gap: 4rem;
}

.funnies-strip {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.funnies-strip-image-link {
    display: block;
}

.funnies-strip-image-link img {
    display: block;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    border-radius: 5px;
}

.funnies-strip-meta {
    text-align: center;
}

.funnies-strip-title {
    margin: 0 0 0.25rem 0;
    font-size: 1.15rem;
    font-style: italic;
}

.funnies-strip-attribution {
    margin: 0 0 0.75rem 0;
    color: #555;
    font-size: 0.95rem;
}

.funnies-strip-actions {
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
}

.funnies-strip-action {
    display: inline-block;
    padding: 0.4rem 0.85rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-decoration: none;
    font-size: 0.9rem;
}

.funnies-strip-action:hover {
    background: #f0f0f0;
}

.funnies-strip-action-support {
    border-color: #333;
}

/* ---------- Index ---------- */

.funnies-intro {
    margin-bottom: 2.5rem;
}

.funnies-intro p {
    margin-bottom: 0.75rem;
}

.funnies-issues-list {
    list-style: none;
    padding: 0;
    margin: 0 0 3rem 0;
}

.funnies-issues-list li {
    padding: 0.85rem 0;
    border-bottom: 1px solid #eee;
}

.funnies-issues-list li a {
    text-decoration: none;
    font-weight: 700;
}

.funnies-issues-list li .funnies-issue-comics {
    display: block;
    color: #555;
    font-size: 0.95rem;
    margin-top: 0.2rem;
}

.funnies-subscribed {
    margin-top: 3rem;
}

.funnies-subscribed h3 {
    margin-bottom: 1rem;
}

.funnies-subscribed-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.funnies-subscribed-list li {
    padding: 0.6rem 0;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
}

.funnies-subscribed-list .funnies-subscribed-name {
    flex: 1 1 auto;
}

.funnies-subscribed-list .funnies-subscribed-support {
    flex: 0 0 auto;
    font-size: 0.9rem;
}
```

- [ ] **Step 2: Add the conditional CSS load to `default.html`**

In `_layouts/default.html`, after the existing `{% if page.url contains '/conferences' %}…{% endif %}` block (around line 38), add:

```html
    {% if page.url contains '/funnies' %}
    <link rel="stylesheet" href="/funnies.css">
    {% endif %}
```

(The issue layout already loads `funnies.css` directly because it doesn't extend `default`. This conditional covers the index page, which uses `layout: default`.)

- [ ] **Step 3: Visual smoke test**

```
bundle exec jekyll serve
```

In a browser, open `http://localhost:4000/funnies/2026-04-28/` (assuming Task 10 kept that issue file). Verify:
- The strip image renders at full width, capped by the page container.
- Title, attribution line, and the two action buttons all render.
- Page width matches the rest of the site visually.
- Prev/next navigation shows "previous"/"next" disabled (only one issue exists at this point).

If anything's broken, fix the CSS in this task before moving on.

- [ ] **Step 4: Commit**

```
git add funnies.css _layouts/default.html
git commit -m "funnies: stylesheet for issue and index pages"
```

---

## Task 13: Index page + Atom feed

**Goal:** `/funnies/` lists past issues and the subscribed-comics roster. `/funnies/feed.xml` is an Atom feed with full issue content.

**Files:**
- Create: `funnies/index.html`
- Create: `funnies/feed.xml`

- [ ] **Step 1: Create the index page**

Create `funnies/index.html`:

```html
---
layout: default
title: "Funnies — daily comic digest"
description: A daily digest of comics from artists Geoff Chan subscribes to. New issues land mornings ET, only on days something was posted.
---
<header>
    <div>
        <a href="/funnies/"><h1>funnies</h1></a>
        <span>daily comic digest</span>
    </div>
    <nav>
        <a href="/">Home</a>
    </nav>
</header>
<main>
    <section class="funnies-intro">
        <h2>Funnies</h2>
        <p>A daily digest of comics from artists I subscribe to. New issues land mornings ET, only on days something was posted.</p>
        <p><a href="/funnies/feed.xml">Subscribe via RSS ↗</a></p>
    </section>

    {% assign all_issues = site.funnies | sort: 'date' | reverse %}
    {% if all_issues.size == 0 %}
    <p>No issues yet — the digest publishes on days when at least one of the subscribed comics ships a strip.</p>
    {% else %}
    <ul class="funnies-issues-list">
        {% for issue in all_issues %}
        <li>
            <a href="{{ issue.url }}">{{ issue.date | date: "%B %-d, %Y" }}</a>
            <span class="funnies-issue-comics">
                {% assign names = "" | split: "," %}
                {% for strip in issue.strips %}
                    {% unless names contains strip.comic_name %}
                        {% assign names = names | push: strip.comic_name %}
                    {% endunless %}
                {% endfor %}
                {{ names | join: " · " }}
            </span>
        </li>
        {% endfor %}
    </ul>
    {% endif %}

    <section class="funnies-subscribed">
        <h3>Subscribed comics</h3>
        <ul class="funnies-subscribed-list">
            {% for comic in site.data.funnies_subscriptions %}
                {% if comic.active %}
                <li>
                    <span class="funnies-subscribed-name">
                        <a href="{{ comic.homepage }}" target="_blank" rel="noopener">{{ comic.name }}</a>
                        — {{ comic.artist }}
                    </span>
                    {% if comic.support %}
                    <a class="funnies-subscribed-support" href="{{ comic.support.url }}" target="_blank" rel="noopener">
                        {{ comic.support.label }} ↗
                    </a>
                    {% endif %}
                </li>
                {% endif %}
            {% endfor %}
        </ul>
    </section>
</main>
```

- [ ] **Step 2: Create the Atom feed template**

Create `funnies/feed.xml`:

```liquid
---
layout: null
permalink: /funnies/feed.xml
---
<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <title>Funnies — Geoff Chan</title>
    <subtitle>Daily comic digest from artists Geoff Chan subscribes to.</subtitle>
    <link href="{{ site.url }}/funnies/feed.xml" rel="self" />
    <link href="{{ site.url }}/funnies/" />
    <id>{{ site.url }}/funnies/</id>
    {% assign all_issues = site.funnies | sort: 'date' | reverse %}
    {% if all_issues.size > 0 %}
    <updated>{{ all_issues[0].date | date_to_xmlschema }}</updated>
    {% else %}
    <updated>{{ site.time | date_to_xmlschema }}</updated>
    {% endif %}
    {% for issue in all_issues limit: 50 %}
    <entry>
        <title>Funnies — {{ issue.date | date: "%B %-d, %Y" }}</title>
        <link href="{{ site.url }}{{ issue.url }}" />
        <id>{{ site.url }}{{ issue.url }}</id>
        <updated>{{ issue.date | date_to_xmlschema }}</updated>
        <author><name>Geoff Chan</name></author>
        <content type="html">
            {% capture entry_html %}
            {% for strip in issue.strips %}
            <p>
                <a href="{{ strip.source_url }}">
                    <img src="{{ strip.image_url }}" alt="{{ strip.title | escape }}" />
                </a>
            </p>
            <p>
                <strong>{{ strip.title | escape }}</strong><br/>
                {{ strip.artist | escape }} — {{ strip.comic_name | escape }}<br/>
                <a href="{{ strip.source_url }}">Read on {{ strip.comic_name | escape }}</a>
                {% if strip.support %} · <a href="{{ strip.support.url }}">Support {{ strip.artist | escape }}: {{ strip.support.label | escape }}</a>{% endif %}
            </p>
            <hr/>
            {% endfor %}
            {% endcapture %}
            {{ entry_html | xml_escape }}
        </content>
    </entry>
    {% endfor %}
</feed>
```

- [ ] **Step 3: Verify the build and surfaces**

```
bundle exec jekyll build
```

Expected: clean build.

```
ls _site/funnies/
```

Expected to include `index.html`, `feed.xml`, and a directory for each issue (e.g. `2026-04-28/`).

- [ ] **Step 4: Visually smoke-test the index**

```
bundle exec jekyll serve
```

Open `http://localhost:4000/funnies/`. Verify:
- Intro paragraph renders.
- "Subscribe via RSS" link points to `/funnies/feed.xml`.
- Each issue line shows the date as a link and the comma-separated comic names below.
- Subscribed-comics section lists all four starter comics with their support buttons on the right.

Then open `http://localhost:4000/funnies/feed.xml`. Verify it's well-formed XML with at least one `<entry>` for the smoke-test issue.

- [ ] **Step 5: Commit**

```
git add funnies/index.html funnies/feed.xml
git commit -m "funnies: index page and atom feed"
```

---

## Task 14: Wire up homepage row + CLAUDE.md

**Goal:** The new section is discoverable from the site's home page and documented for future Claude sessions, matching the existing `/conferences` and `/tokens` patterns.

**Files:**
- Modify: `index.html`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add a `/funnies/` row to the homepage Work list**

In `index.html`, find the `<ul>` inside the `<section class="work">` block. Add this new `<li>` immediately after the `Conferences` row (line ~27):

```html
            <li><a href="/funnies/">Funnies</a> <span class="tag">wip experiment</span> daily comic digest from artists I subscribe to</li>
```

The tag text is lowercase per project convention (per `MEMORY.md`).

- [ ] **Step 2: Add a `/funnies` block to `CLAUDE.md`**

In `CLAUDE.md`, after the `## /conferences Page (Agent-Maintained)` section, append:

```markdown

## /funnies Page (Auto-Generated Digest)

- `_data/funnies_subscriptions.yml` is the hand-curated subscription list. Edit it to add or remove a comic. Both the Python publish script and Jekyll templates read it.
- `_funnies/YYYY-MM-DD.md` files are produced by the daily GitHub Actions workflow (`.github/workflows/funnies-publish.yml`) running `scripts/funnies_publish.py`. The script bundles all strips published on a given ET date into one Jekyll collection doc. Days with no new strips produce no file.
- The script is idempotent for a fixed date and feed state. To backfill or re-run a specific day, trigger the workflow with `workflow_dispatch` or run `python scripts/funnies_publish.py --date YYYY-MM-DD` locally.
- All comic images are hotlinked from the artists' CDNs — never download or proxy them.
- Page lives at `funnies/index.html` (`/funnies/`); per-issue pages render via `_layouts/funnies-issue.html`. Styles in `funnies.css`. Atom feed at `funnies/feed.xml`.
- Spec: `docs/superpowers/specs/2026-04-29-funnies-daily-comic-digest-design.md`.
- Plan: `docs/superpowers/plans/2026-04-29-funnies-daily-comic-digest.md`.
```

- [ ] **Step 3: Visual sanity check on the homepage**

```
bundle exec jekyll serve
```

Open `http://localhost:4000/`. Verify the new `Funnies` row appears in the Work list with the correct tag and copy.

- [ ] **Step 4: Commit**

```
git add index.html CLAUDE.md
git commit -m "funnies: surface on homepage and document in CLAUDE.md"
```

---

## Task 15: GitHub Actions workflow + first production run

**Goal:** A daily cron in GitHub Actions that runs the publish script and commits any new issue file. After this task, the digest runs unattended.

**Files:**
- Create: `.github/workflows/funnies-publish.yml`

- [ ] **Step 1: Create the workflow**

Create `.github/workflows/funnies-publish.yml`:

```yaml
name: Funnies — daily publish

on:
  schedule:
    # 13:00 UTC daily = 09:00 ET = 06:00 PT.
    # Runs after midnight in every North American timezone.
    - cron: '0 13 * * *'
  workflow_dispatch:
    inputs:
      date:
        description: "Target ET date (YYYY-MM-DD). Default: yesterday in ET."
        required: false
        default: ""

permissions:
  contents: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"

      - name: Install dependencies
        run: pip install -r scripts/requirements.txt

      - name: Run publish script
        run: |
          if [ -n "${{ inputs.date }}" ]; then
            python scripts/funnies_publish.py --date "${{ inputs.date }}"
          else
            python scripts/funnies_publish.py
          fi

      - name: Commit and push if a new issue was written
        run: |
          if [ -z "$(git status --porcelain _funnies/)" ]; then
            echo "No new issue to commit."
            exit 0
          fi
          git config user.name "Geoff Chan"
          git config user.email "geoffchan23@gmail.com"
          git add _funnies/
          git commit -m "funnies: publish $(ls -1t _funnies/ | head -n1 | sed 's/\.md$//')"
          git push
```

- [ ] **Step 2: Verify the workflow file is syntactically valid YAML**

```
python -c "import yaml; yaml.safe_load(open('.github/workflows/funnies-publish.yml'))"
```

Expected: no output (success).

- [ ] **Step 3: Commit and push everything to date**

```
git add .github/workflows/funnies-publish.yml
git commit -m "funnies: github actions workflow for daily publish"
git push
```

Once pushed, the workflow becomes available in the repo's Actions tab.

- [ ] **Step 4: Trigger the workflow manually for a known-good date**

In a browser, go to the repo's Actions tab → "Funnies — daily publish" → "Run workflow". Set `date` to `2026-04-28` (or whatever date Task 10 confirmed has at least one strip) and click Run.

If you have the `gh` CLI installed locally, you can also do:

```
gh workflow run "Funnies — daily publish" -f date=2026-04-28
```

Then watch the run:

```
gh run watch
```

Expected: the run succeeds. If a `_funnies/2026-04-28.md` file is committed by the workflow author, GitHub Pages auto-deploys and the issue is live at `https://geoffreychan.com/funnies/2026-04-28/`. (If the file already exists from Task 10's smoke test, the diff may be empty and the workflow exits cleanly with "No new issue to commit.")

- [ ] **Step 5: Verify the live page**

In a browser, open:
- `https://geoffreychan.com/funnies/` — should render the index with at least one issue listed and all four subscribed comics.
- `https://geoffreychan.com/funnies/2026-04-28/` — the issue page with the strip(s).
- `https://geoffreychan.com/funnies/feed.xml` — well-formed Atom XML.

If any URL 404s or renders incorrectly, file a follow-up — do not patch live without re-running tests locally.

---

## Self-review (against the spec)

Run this mentally before declaring complete:

- [x] Goal: `/funnies/` daily digest — covered by Tasks 11–15.
- [x] Non-goals: no email, no subscribers, no image hosting — none of the tasks introduce those.
- [x] URL structure (`/funnies/`, `/funnies/YYYY-MM-DD/`, `/funnies/feed.xml`) — Tasks 11, 13.
- [x] Architecture (GH Actions cron → Python script → Jekyll commit) — Tasks 9, 15.
- [x] Storage (Jekyll collection, `_data/funnies_subscriptions.yml`) — Tasks 2, 11.
- [x] Per-comic config schema (id, name, artist, homepage, feed, image_strategy, image_selector, support, active) — Task 2.
- [x] Image extraction ladder (`feed` → `og` → `scrape`, with fall-forward to `og`) — Task 7.
- [x] Date semantics (yesterday in ET, parse via `dateutil`) — Task 4.
- [x] Hotlinking (no image proxy in the script or layouts) — Tasks 8, 11.
- [x] Workflow + scheduling (13:00 UTC + `workflow_dispatch` with `--date`) — Task 15.
- [x] Issue layout (image-first, attribution line, two link-buttons, prev/next) — Task 11.
- [x] Index layout (issues list + subscribed-comics roster + RSS link) — Task 13.
- [x] Atom feed with full issue content — Task 13.
- [x] Failure modes (feed fetch error skips that comic, missing image is skipped+logged, missing support omits button) — Tasks 9, 11.
- [x] Starter list with all four comics — Task 2.
- [x] CLAUDE.md and homepage updates — Task 14.
