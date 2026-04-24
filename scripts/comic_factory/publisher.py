"""Publisher helpers for the comic factory pipeline.

Moves approved drafts from ``_comic_drafts/<N>/`` into
``_comics/<slug>.md`` + ``comics/images/<slug>/*.png``.
"""
from __future__ import annotations

import re
import shutil
from datetime import date, datetime, timezone
from pathlib import Path

from comic_factory.issue_parser import parse_issue_body


# ---------------------------------------------------------------------------
# Public helpers
# ---------------------------------------------------------------------------

def slugify_title(title: str) -> str:
    """Convert a title like 'Dog Taxes' to 'dog-taxes'.

    - Strips a leading ``Comic:`` prefix (case-insensitive).
    - Lowercases the result.
    - Replaces non-alphanumeric runs with a single hyphen.
    - Trims leading/trailing hyphens.
    """
    # Strip "Comic: " prefix (case-insensitive, optional trailing space/colon)
    title = re.sub(r"(?i)^comic\s*:\s*", "", title)
    # Lowercase
    title = title.lower()
    # Remove apostrophes/smart-quotes so contractions join (e.g. "what's" → "whats")
    title = re.sub(r"['\u2018\u2019\u02BC]", "", title)
    # Replace remaining non-alphanumeric characters with hyphens
    title = re.sub(r"[^a-z0-9]+", "-", title)
    # Trim leading/trailing hyphens
    title = title.strip("-")
    return title


def is_due(publish_field: str, today: date) -> bool:
    """Return True if the publish field indicates the comic should be published now.

    - ``"immediate"`` → True
    - ISO date string ≤ today → True
    - ISO date string > today → False
    - Empty / TBD / unparseable → False (never publish accidentally)
    """
    value = publish_field.strip().lower()
    if value == "immediate":
        return True
    if not value or value == "tbd":
        return False
    try:
        publish_date = date.fromisoformat(publish_field.strip())
        return publish_date <= today
    except ValueError:
        return False


def build_post_frontmatter(
    title: str,
    publish_date: date,
    issue_number: int,
    images: list[str],
    script_lines: list[str],
    model: str = "gpt-image-2",
    generated_iso: str | None = None,
) -> str:
    """Return the full Jekyll markdown post content as a string.

    The output looks like::

        ---
        title: Dog Taxes
        date: 2026-04-24
        issue: 42
        images:
          - 01.png
          - 02.png
        script: |
          Panel 1: Dog at kitchen table staring at a 1040 form.
          Panel 2: Dog holds pen in mouth, looking confused.
        model: gpt-image-2
        generated: 2026-04-24T12:00:00+00:00
        ---

    No body content is added — Geoff can edit the post later to add a caption.
    The ``script_lines`` are the raw panel descriptions (without the "Panel N:" prefix).
    """
    if generated_iso is None:
        generated_iso = datetime.now(timezone.utc).isoformat()

    lines = ["---"]
    lines.append(f"title: {title}")
    lines.append(f"date: {publish_date}")
    lines.append(f"issue: {issue_number}")
    lines.append("images:")
    for img in images:
        lines.append(f"  - {img}")
    # YAML block scalar for multi-line script
    lines.append("script: |")
    for i, panel_text in enumerate(script_lines, start=1):
        lines.append(f"  Panel {i}: {panel_text}")
    lines.append(f"model: {model}")
    lines.append(f"generated: {generated_iso}")
    lines.append("---")

    return "\n".join(lines) + "\n"


def publish_draft(
    issue: dict,        # {number, title, body, labels}
    today: date,
    repo_root: Path,
) -> dict:
    """Move a queued draft into published form.

    Steps:

    1. Parse issue body (using ``issue_parser.parse_issue_body``).
    2. Verify ``is_due(publish_field, today)`` — else return ``{"status": "not_due"}``.
    3. Compute slug: ``<today>-<slugify(title)>``.
       Strip "Comic: " prefix from issue title if present.
    4. Create ``comics/images/<slug>/``.
    5. Copy all ``*.png`` files from ``_comic_drafts/<issue_number>/`` to the new
       images directory, sorted.  Collect image filenames for front-matter.
    6. Write ``_comics/<slug>.md`` with ``build_post_frontmatter``.
    7. Delete ``_comic_drafts/<issue_number>/`` entirely.
    8. Return a dict describing what was done::

           {
               "status": "published",
               "slug": slug,
               "paths_to_commit": [...],   # repo-relative paths
               "paths_to_remove": [...],   # repo-relative paths that were deleted
           }

    This function does **not** commit, swap labels, or close issues — those are the
    caller's responsibility.  It **does** modify the filesystem.

    Raises
    ------
    ValueError
        - If the issue body is unparseable.
        - If ``_comic_drafts/<N>/`` does not exist or has no PNGs.
    """
    issue_number = issue["number"]
    raw_title = issue["title"]

    # 1. Parse issue body
    parsed = parse_issue_body(issue["body"])
    publish_field = parsed["publish"]
    script_lines = parsed["script"]

    # 2. Check if due
    if not is_due(publish_field, today):
        return {"status": "not_due"}

    # 3. Compute slug — strip "Comic: " prefix from title
    clean_title = re.sub(r"(?i)^comic\s*:\s*", "", raw_title).strip()
    slug = f"{today}-{slugify_title(clean_title)}"

    # 4. Locate draft directory
    drafts_dir = repo_root / "_comic_drafts" / str(issue_number)
    if not drafts_dir.exists():
        raise ValueError(
            f"Draft directory does not exist: {drafts_dir}"
        )

    png_files = sorted(drafts_dir.glob("*.png"))
    if not png_files:
        raise ValueError(
            f"No PNG files found in draft directory: {drafts_dir}"
        )

    # 4. Create target images dir
    images_dir = repo_root / "comics" / "images" / slug
    images_dir.mkdir(parents=True, exist_ok=True)

    # 5. Copy PNGs
    image_filenames: list[str] = []
    copied_image_paths: list[str] = []
    for src in png_files:
        dest = images_dir / src.name
        shutil.copy2(src, dest)
        image_filenames.append(src.name)
        copied_image_paths.append(str(dest.relative_to(repo_root)))

    # 6. Write post markdown
    post_path = repo_root / "_comics" / f"{slug}.md"
    post_path.parent.mkdir(parents=True, exist_ok=True)
    content = build_post_frontmatter(
        title=clean_title,
        publish_date=today,
        issue_number=issue_number,
        images=image_filenames,
        script_lines=script_lines,
    )
    post_path.write_text(content, encoding="utf-8")

    # 7. Delete draft directory
    shutil.rmtree(drafts_dir)

    # 8. Build return value
    paths_to_commit = [str(post_path.relative_to(repo_root))] + copied_image_paths
    paths_to_remove = [str(drafts_dir.relative_to(repo_root))]

    return {
        "status": "published",
        "slug": slug,
        "paths_to_commit": paths_to_commit,
        "paths_to_remove": paths_to_remove,
    }
