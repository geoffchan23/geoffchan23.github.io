"""Scanner for art posts flagged as comic style references.

Scans ``_art/*.md`` for posts with ``comic_style_reference: true`` in their
front-matter and returns the path to the first image for each matching post,
sorted by date descending, capped at a configurable limit.
"""

from __future__ import annotations

from datetime import date, datetime
from pathlib import Path
from typing import Any

import yaml


def find_style_refs(
    art_dir: Path = Path("_art"),
    images_dir: Path = Path("art/images"),
    cap: int = 6,
) -> list[Path]:
    """
    Scans `_art/*.md` for posts with front-matter `comic_style_reference: true`.

    For each matching post, returns the path to the first image:
        <images_dir> / <post-stem> / <first image filename>

    Sorted by post date descending (most recent first), capped at `cap`.

    Skips posts where:
    - No `comic_style_reference: true` in front-matter
    - Missing `images` list in front-matter (or empty)
    - Referenced image file doesn't actually exist on disk

    Returns absolute paths (or whatever the input `art_dir` resolves to — the
    caller decides absolute vs relative).
    """
    if not art_dir.exists():
        return []

    candidates: list[tuple[date | datetime, Path]] = []

    for md_file in art_dir.glob("*.md"):
        fm = _parse_frontmatter(md_file)
        if fm is None:
            continue

        # Must be flagged
        if not fm.get("comic_style_reference"):
            continue

        # Must have a non-empty images list
        images = fm.get("images")
        if not images or not isinstance(images, list):
            continue

        # Build path to first image and confirm it exists
        first_image = str(images[0])
        image_path = images_dir / md_file.stem / first_image
        if not image_path.exists():
            continue

        # Extract date for sorting (yaml.safe_load returns a date object for
        # YYYY-MM-DD values, but handle strings as a fallback)
        post_date = fm.get("date")
        if post_date is None:
            # Fall back to the filename prefix (YYYY-MM-DD-slug)
            post_date = _date_from_stem(md_file.stem)
        if isinstance(post_date, str):
            post_date = _date_from_string(post_date)

        candidates.append((post_date, image_path))

    # Sort newest-first, then cap
    candidates.sort(key=lambda t: t[0], reverse=True)
    return [path for _, path in candidates[:cap]]


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _parse_frontmatter(md_file: Path) -> dict[str, Any] | None:
    """Return the parsed YAML front-matter dict, or None if not present."""
    try:
        text = md_file.read_text(encoding="utf-8")
    except OSError:
        return None

    if not text.startswith("---"):
        return None

    # Find the closing ---
    rest = text[3:]
    end_idx = rest.find("\n---")
    if end_idx == -1:
        return None

    fm_text = rest[:end_idx]
    try:
        fm = yaml.safe_load(fm_text)
    except yaml.YAMLError:
        return None

    if not isinstance(fm, dict):
        return None

    return fm


def _date_from_stem(stem: str) -> date:
    """Parse YYYY-MM-DD from the leading portion of a post filename stem."""
    parts = stem.split("-")
    if len(parts) >= 3:
        try:
            return date(int(parts[0]), int(parts[1]), int(parts[2]))
        except (ValueError, IndexError):
            pass
    return date.min


def _date_from_string(value: str) -> date:
    """Parse a date string in YYYY-MM-DD format."""
    try:
        return datetime.strptime(value, "%Y-%m-%d").date()
    except ValueError:
        return date.min
