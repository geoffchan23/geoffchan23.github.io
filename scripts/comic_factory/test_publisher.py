"""Tests for publisher.py helpers."""
from __future__ import annotations

from datetime import date
from pathlib import Path

import pytest

from comic_factory.publisher import (
    build_post_frontmatter,
    is_due,
    publish_draft,
    slugify_title,
)


# ---------------------------------------------------------------------------
# slugify_title
# ---------------------------------------------------------------------------

def test_slugify_simple_title():
    assert slugify_title("Dog Taxes") == "dog-taxes"


def test_slugify_strips_comic_prefix():
    assert slugify_title("Comic: Dog Taxes") == "dog-taxes"


def test_slugify_handles_punctuation():
    # Apostrophe and question mark are non-alphanumeric → replaced with hyphens,
    # then collapsed.
    assert slugify_title("What's Up?") == "whats-up"


def test_slugify_collapses_spaces():
    assert slugify_title("Multiple   Spaces") == "multiple-spaces"


def test_slugify_empty_string():
    # Edge case: empty string returns empty string (no hyphens, nothing to trim)
    assert slugify_title("") == ""


def test_slugify_all_punctuation():
    # Edge case: all non-alphanumeric → single hyphen → stripped to empty string
    assert slugify_title("!!!") == ""


# ---------------------------------------------------------------------------
# is_due
# ---------------------------------------------------------------------------

TODAY = date(2026, 4, 24)


def test_is_due_immediate():
    assert is_due("immediate", TODAY) is True


def test_is_due_past_date():
    assert is_due("2026-01-01", TODAY) is True


def test_is_due_today():
    assert is_due("2026-04-24", TODAY) is True


def test_is_due_future():
    assert is_due("2026-12-31", TODAY) is False


def test_is_due_tbd():
    assert is_due("TBD", TODAY) is False


def test_is_due_empty():
    assert is_due("", TODAY) is False


def test_is_due_garbage():
    assert is_due("notadate", TODAY) is False


# ---------------------------------------------------------------------------
# build_post_frontmatter
# ---------------------------------------------------------------------------

def test_build_frontmatter_contains_all_fields():
    content = build_post_frontmatter(
        title="Dog Taxes",
        publish_date=date(2026, 4, 24),
        issue_number=42,
        images=["01.png", "02.png"],
        script_lines=["Dog at kitchen table.", "Dog holds pen in mouth."],
        model="gpt-image-2",
        generated_iso="2026-04-24T12:00:00+00:00",
    )
    assert "title: Dog Taxes" in content
    assert "date: 2026-04-24" in content
    assert "issue: 42" in content
    assert "- 01.png" in content
    assert "- 02.png" in content
    assert "script: |" in content
    assert "model: gpt-image-2" in content
    assert "generated: 2026-04-24T12:00:00+00:00" in content
    # Delimited by YAML front-matter markers
    assert content.startswith("---\n")
    assert content.strip().endswith("---")


def test_build_frontmatter_multi_line_script():
    content = build_post_frontmatter(
        title="Dog Taxes",
        publish_date=date(2026, 4, 24),
        issue_number=42,
        images=["01.png"],
        script_lines=["Dog at kitchen table.", "Dog holds pen in mouth.", "Dog scribbles 'bark'."],
        generated_iso="2026-04-24T00:00:00+00:00",
    )
    # Must use the YAML literal block scalar indicator
    assert "script: |" in content
    # Each panel description must be indented under `script: |`
    assert "  Panel 1: Dog at kitchen table." in content
    assert "  Panel 2: Dog holds pen in mouth." in content
    assert "  Panel 3: Dog scribbles 'bark'." in content


# ---------------------------------------------------------------------------
# Shared issue body fixture
# ---------------------------------------------------------------------------

ISSUE_BODY = """\
## Summary
Dog does his taxes.

## Script
Panel 1: Dog at kitchen table staring at a 1040 form.
Panel 2: Dog holds pen in mouth, looking confused.

## Prompts
Panel 1: Detailed prompt for panel 1 in gpt-image-2 format.
Panel 2: Detailed prompt for panel 2.

## Style notes
- watercolor wash

## References
- Per-comic: committed to `comics/references-draft/42/`
  - ref-01.png — pose reference for the dog

## Publish
immediate
"""

ISSUE_BODY_FUTURE = ISSUE_BODY.replace("immediate", "2026-12-31")


def _make_issue(body: str, number: int = 42, title: str = "Comic: Dog Taxes") -> dict:
    return {"number": number, "title": title, "body": body, "labels": []}


def _make_draft_dir(tmp_path: Path, issue_number: int, filenames: list[str]) -> None:
    """Create a fake draft directory with the given PNG filenames."""
    draft_dir = tmp_path / "_comic_drafts" / str(issue_number)
    draft_dir.mkdir(parents=True)
    for name in filenames:
        (draft_dir / name).write_bytes(b"\x89PNG\r\n")  # minimal fake PNG header


# ---------------------------------------------------------------------------
# publish_draft — happy path
# ---------------------------------------------------------------------------

def test_publish_draft_happy_path(tmp_path: Path):
    _make_draft_dir(tmp_path, 42, ["01.png", "02.png"])
    issue = _make_issue(ISSUE_BODY)
    today = date(2026, 4, 24)

    result = publish_draft(issue, today, tmp_path)

    assert result["status"] == "published"
    assert result["slug"] == "2026-04-24-dog-taxes"

    # Post markdown created
    post_path = tmp_path / "_comics" / "2026-04-24-dog-taxes.md"
    assert post_path.exists(), "Post markdown file should be created"
    content = post_path.read_text()
    assert "title: Dog Taxes" in content
    assert "issue: 42" in content
    assert "Panel 1:" in content
    assert "Panel 2:" in content

    # Images copied
    assert (tmp_path / "comics" / "images" / "2026-04-24-dog-taxes" / "01.png").exists()
    assert (tmp_path / "comics" / "images" / "2026-04-24-dog-taxes" / "02.png").exists()

    # Draft directory removed
    assert not (tmp_path / "_comic_drafts" / "42").exists()

    # paths_to_commit contains the post + both images
    assert "_comics/2026-04-24-dog-taxes.md" in result["paths_to_commit"]
    assert "comics/images/2026-04-24-dog-taxes/01.png" in result["paths_to_commit"]
    assert "comics/images/2026-04-24-dog-taxes/02.png" in result["paths_to_commit"]

    # paths_to_remove contains the old draft dir
    assert "_comic_drafts/42" in result["paths_to_remove"]


# ---------------------------------------------------------------------------
# publish_draft — not due
# ---------------------------------------------------------------------------

def test_publish_draft_skips_when_not_due(tmp_path: Path):
    _make_draft_dir(tmp_path, 42, ["01.png"])
    issue = _make_issue(ISSUE_BODY_FUTURE)
    today = date(2026, 4, 24)

    result = publish_draft(issue, today, tmp_path)

    assert result == {"status": "not_due"}
    # No filesystem changes
    assert (tmp_path / "_comic_drafts" / "42").exists()
    assert not (tmp_path / "_comics").exists()


# ---------------------------------------------------------------------------
# publish_draft — error cases
# ---------------------------------------------------------------------------

def test_publish_draft_raises_when_drafts_missing(tmp_path: Path):
    # No _comic_drafts/42/ directory created
    issue = _make_issue(ISSUE_BODY)
    today = date(2026, 4, 24)

    with pytest.raises(ValueError, match="Draft directory does not exist"):
        publish_draft(issue, today, tmp_path)


def test_publish_draft_raises_when_no_pngs(tmp_path: Path):
    # Draft dir exists but is empty (no PNGs)
    draft_dir = tmp_path / "_comic_drafts" / "42"
    draft_dir.mkdir(parents=True)

    issue = _make_issue(ISSUE_BODY)
    today = date(2026, 4, 24)

    with pytest.raises(ValueError, match="No PNG files found"):
        publish_draft(issue, today, tmp_path)
