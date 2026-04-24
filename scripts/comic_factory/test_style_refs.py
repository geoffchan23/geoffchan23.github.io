"""Tests for style_refs.find_style_refs."""
from pathlib import Path

import pytest

from comic_factory.style_refs import find_style_refs


# ---------------------------------------------------------------------------
# Helper
# ---------------------------------------------------------------------------

def _make_art_post(
    root: Path,
    slug: str,
    date: str,
    flagged: bool,
    images: list[str],
    create_image_files: bool = True,
) -> None:
    """Write a fake _art/<slug>.md and optionally create its image files."""
    art_dir = root / "_art"
    art_dir.mkdir(exist_ok=True)

    frontmatter_lines = ["---", f"title: {slug}", f"date: {date}", "images:"]
    for img in images:
        frontmatter_lines.append(f"  - {img}")
    if flagged:
        frontmatter_lines.append("comic_style_reference: true")
    frontmatter_lines.append("---")
    (art_dir / f"{slug}.md").write_text("\n".join(frontmatter_lines))

    if create_image_files:
        img_dir = root / "art" / "images" / slug
        img_dir.mkdir(parents=True, exist_ok=True)
        for img in images:
            (img_dir / img).write_bytes(b"fake png bytes")


def _make_art_post_no_images_key(root: Path, slug: str, date: str) -> None:
    """Write a flagged post that has NO images key at all."""
    art_dir = root / "_art"
    art_dir.mkdir(exist_ok=True)
    content = "\n".join(["---", f"title: {slug}", f"date: {date}", "comic_style_reference: true", "---"])
    (art_dir / f"{slug}.md").write_text(content)


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------

def test_returns_only_flagged_posts(tmp_path):
    """2 flagged posts + 1 unflagged → only 2 paths returned."""
    _make_art_post(tmp_path, "2026-01-01-flagged-a", "2026-01-01", flagged=True, images=["01.png"])
    _make_art_post(tmp_path, "2026-01-02-flagged-b", "2026-01-02", flagged=True, images=["01.png"])
    _make_art_post(tmp_path, "2026-01-03-unflagged", "2026-01-03", flagged=False, images=["01.png"])

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
    )

    assert len(result) == 2
    slugs = {p.parent.name for p in result}
    assert slugs == {"2026-01-01-flagged-a", "2026-01-02-flagged-b"}


def test_sorts_by_date_descending(tmp_path):
    """Returned list is ordered newest-first."""
    _make_art_post(tmp_path, "2026-01-01-alpha", "2026-01-01", flagged=True, images=["01.png"])
    _make_art_post(tmp_path, "2026-03-15-beta", "2026-03-15", flagged=True, images=["01.png"])
    _make_art_post(tmp_path, "2026-02-10-gamma", "2026-02-10", flagged=True, images=["01.png"])

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
    )

    assert len(result) == 3
    folder_names = [p.parent.name for p in result]
    assert folder_names == ["2026-03-15-beta", "2026-02-10-gamma", "2026-01-01-alpha"]


def test_caps_at_given_cap(tmp_path):
    """8 flagged posts with cap=6 → returns exactly 6 (the 6 newest)."""
    slugs = [f"2026-01-{i:02d}-post" for i in range(1, 9)]
    for slug in slugs:
        date = f"2026-01-{slug[8:10]}"
        _make_art_post(tmp_path, slug, date, flagged=True, images=["01.png"])

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
        cap=6,
    )

    assert len(result) == 6
    # The 6 newest are days 03–08 (indices 2-7 in the slugs list)
    returned_folders = {p.parent.name for p in result}
    expected = {f"2026-01-{i:02d}-post" for i in range(3, 9)}
    assert returned_folders == expected


def test_skips_posts_without_images(tmp_path):
    """Flagged post with no 'images' key in front-matter is excluded."""
    _make_art_post_no_images_key(tmp_path, "2026-01-01-no-images", "2026-01-01")
    _make_art_post(tmp_path, "2026-01-02-has-images", "2026-01-02", flagged=True, images=["01.png"])

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
    )

    assert len(result) == 1
    assert result[0].parent.name == "2026-01-02-has-images"


def test_skips_posts_with_missing_image_file(tmp_path):
    """Flagged post whose image file doesn't exist on disk is excluded."""
    # Create post metadata but don't create the image file
    _make_art_post(
        tmp_path,
        "2026-01-01-ghost",
        "2026-01-01",
        flagged=True,
        images=["01.png"],
        create_image_files=False,
    )
    _make_art_post(tmp_path, "2026-01-02-real", "2026-01-02", flagged=True, images=["01.png"])

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
    )

    assert len(result) == 1
    assert result[0].parent.name == "2026-01-02-real"


def test_returns_empty_when_art_dir_missing(tmp_path):
    """Non-existent art_dir returns empty list, no error raised."""
    result = find_style_refs(
        art_dir=tmp_path / "_art_does_not_exist",
        images_dir=tmp_path / "art" / "images",
    )

    assert result == []


def test_returns_first_image_when_multiple(tmp_path):
    """Flagged post with multiple images → only the first is returned."""
    _make_art_post(
        tmp_path,
        "2026-01-01-multi",
        "2026-01-01",
        flagged=True,
        images=["01.png", "02.png", "03.png"],
    )

    result = find_style_refs(
        art_dir=tmp_path / "_art",
        images_dir=tmp_path / "art" / "images",
    )

    assert len(result) == 1
    assert result[0].name == "01.png"
