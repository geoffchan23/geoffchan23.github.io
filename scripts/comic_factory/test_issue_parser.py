"""Tests for issue_parser.parse_issue_body."""
import pytest

from comic_factory.issue_parser import parse_issue_body


# ---------------------------------------------------------------------------
# Fixtures / shared data
# ---------------------------------------------------------------------------

WELL_FORMED_BODY = """\
## Summary
one-line hook

## Script
Panel 1: Dog at kitchen table staring at a 1040 form.
Panel 2: Dog holds pen in mouth, looking confused.
Panel 3: Dog has scribbled "bark" in every field.

## Prompts
Panel 1: Detailed prompt for panel 1 in gpt-image-2 format.
Panel 2: Detailed prompt for panel 2.
Panel 3: Detailed prompt for panel 3.

## Style notes
- watercolor wash
- heavy outlines

## References
- Style anchors: auto-picked at gen time from _art/ (comic_style_reference=true)
- Per-comic: committed to `comics/references-draft/42/`
  - ref-01.png — pose reference for the dog
  - ref-02.jpg — kitchen setting

## Publish
immediate
"""


# ---------------------------------------------------------------------------
# Test 1: well-formed body parses correctly
# ---------------------------------------------------------------------------

def test_parses_well_formed_body():
    result = parse_issue_body(WELL_FORMED_BODY)

    # All six keys present
    assert set(result.keys()) == {"summary", "script", "prompts", "style_notes", "references", "publish"}

    # summary
    assert result["summary"] == "one-line hook"

    # script — Panel N: prefix stripped
    assert result["script"] == [
        "Dog at kitchen table staring at a 1040 form.",
        'Dog holds pen in mouth, looking confused.',
        'Dog has scribbled "bark" in every field.',
    ]

    # prompts — Panel N: prefix stripped
    assert result["prompts"] == [
        "Detailed prompt for panel 1 in gpt-image-2 format.",
        "Detailed prompt for panel 2.",
        "Detailed prompt for panel 3.",
    ]

    # style_notes — leading "- " stripped
    assert result["style_notes"] == ["watercolor wash", "heavy outlines"]

    # references — only per-comic lines (em-dash separator)
    assert result["references"] == [
        {"filename": "ref-01.png", "description": "pose reference for the dog"},
        {"filename": "ref-02.jpg", "description": "kitchen setting"},
    ]

    # publish
    assert result["publish"] == "immediate"


# ---------------------------------------------------------------------------
# Test 2: script/prompt count mismatch → ValueError
# ---------------------------------------------------------------------------

def test_raises_when_script_prompt_count_mismatch():
    body = """\
## Summary
mismatch test

## Script
Panel 1: First panel.
Panel 2: Second panel.
Panel 3: Third panel.

## Prompts
Panel 1: Only one prompt.
Panel 2: Only two prompts.
"""
    with pytest.raises(ValueError, match="Script.*Prompts|panel count"):
        parse_issue_body(body)


# ---------------------------------------------------------------------------
# Test 3: malformed panel line → ValueError
# ---------------------------------------------------------------------------

def test_raises_when_panel_line_malformed():
    body = """\
## Summary
malformed test

## Script
Panel 1: Fine.
This line has no Panel prefix.

## Prompts
Panel 1: A prompt.
Panel 2: Another prompt.
"""
    with pytest.raises(ValueError, match="Panel"):
        parse_issue_body(body)


# ---------------------------------------------------------------------------
# Test 4: missing sections → empty defaults
# ---------------------------------------------------------------------------

def test_returns_empty_defaults_for_missing_sections():
    body = """\
## Summary
just a summary
"""
    result = parse_issue_body(body)

    assert result["summary"] == "just a summary"
    assert result["script"] == []
    assert result["prompts"] == []
    assert result["style_notes"] == []
    assert result["references"] == []
    assert result["publish"] == ""


# ---------------------------------------------------------------------------
# Test 5: references use em-dash (—) as separator
# ---------------------------------------------------------------------------

def test_parses_references_with_em_dash():
    body = """\
## Summary
ref test

## Script
Panel 1: A scene.

## Prompts
Panel 1: A prompt.

## References
- Per-comic: committed to `comics/references-draft/7/`
  - photo.jpg — some description here
  - sketch.png — another description

## Publish
TBD
"""
    result = parse_issue_body(body)
    assert result["references"] == [
        {"filename": "photo.jpg", "description": "some description here"},
        {"filename": "sketch.png", "description": "another description"},
    ]


# ---------------------------------------------------------------------------
# Test 6: publish preserves various content values intact
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("publish_value", ["immediate", "TBD", "2026-04-30"])
def test_publish_preserves_content(publish_value: str):
    body = f"""\
## Summary
publish test

## Script
Panel 1: A scene.

## Prompts
Panel 1: A prompt.

## Publish
{publish_value}
"""
    result = parse_issue_body(body)
    assert result["publish"] == publish_value
