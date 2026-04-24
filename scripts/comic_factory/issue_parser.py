"""Parser for GitHub issue bodies following the comic factory structured format.

Sections are delimited by ``## <Name>`` headers (two spaces after the hashes).
Deeper headers (``###``) are not treated as section boundaries.
"""

from __future__ import annotations

import re
from typing import Any

# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def parse_issue_body(body: str) -> dict[str, Any]:
    """Parse a comic-factory GitHub issue body into structured data.

    Parameters
    ----------
    body:
        Raw markdown string from the GitHub issue body.

    Returns
    -------
    dict with keys:
        - ``summary``: str — one-line hook (possibly empty).
        - ``script``: list[str] — panel descriptions without the "Panel N:" prefix.
        - ``prompts``: list[str] — panel prompts without the "Panel N:" prefix,
          matching *script* in length.
        - ``style_notes``: list[str] — bullet items without the leading "- ".
        - ``references``: list[dict] — per-comic refs, each
          ``{"filename": str, "description": str}``; the style-anchors meta-line
          is ignored.
        - ``publish``: str — raw publish value (e.g. "immediate", "TBD",
          "2026-04-30").

    Raises
    ------
    ValueError
        - If the number of Script panels differs from the number of Prompts panels.
        - If a non-blank line in Script or Prompts does not match ``Panel N: ...``.
        - If panel numbers in Script or Prompts are not sequential starting at 1.
    """
    sections = _split_sections(body)

    summary = _parse_summary(sections.get("Summary", ""))
    script = _parse_panels(sections.get("Script", ""), section_name="Script")
    prompts = _parse_panels(sections.get("Prompts", ""), section_name="Prompts")
    style_notes = _parse_style_notes(sections.get("Style notes", ""))
    references = _parse_references(sections.get("References", ""))
    publish = _parse_publish(sections.get("Publish", ""))

    # Validate panel counts match
    if len(script) != len(prompts):
        raise ValueError(
            f"Script has {len(script)} panel(s) but Prompts has {len(prompts)} panel(s); "
            "panel count must match."
        )

    return {
        "summary": summary,
        "script": script,
        "prompts": prompts,
        "style_notes": style_notes,
        "references": references,
        "publish": publish,
    }


# ---------------------------------------------------------------------------
# Section splitter
# ---------------------------------------------------------------------------

# Matches a level-2 header only: "## Title" — NOT "### " deeper headers.
_SECTION_RE = re.compile(r"^## (.+)$", re.MULTILINE)


def _split_sections(body: str) -> dict[str, str]:
    """Split *body* into a mapping of {section_title: section_body}.

    Only ``## `` (level-2) headers are recognised as boundaries.
    The section body is everything between the header and the next ``## `` header.
    """
    sections: dict[str, str] = {}
    matches = list(_SECTION_RE.finditer(body))

    for i, match in enumerate(matches):
        title = match.group(1).strip()
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        sections[title] = body[start:end].strip()

    return sections


# ---------------------------------------------------------------------------
# Per-section parsers
# ---------------------------------------------------------------------------

def _parse_summary(text: str) -> str:
    """Join all non-blank lines in the Summary section."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return " ".join(lines)


_PANEL_RE = re.compile(r"^Panel (\d+):\s*(.*)$")


def _parse_panels(text: str, *, section_name: str) -> list[str]:
    """Parse a Script or Prompts section into a list of panel text strings.

    Each non-blank line must match ``Panel N: <text>``.  Lines are returned in
    source order; panel numbers must be sequential starting at 1.

    Raises
    ------
    ValueError
        If a non-blank line does not match the ``Panel N:`` format, or if panel
        numbers are not sequential starting at 1.
    """
    panels: list[tuple[int, str]] = []

    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        match = _PANEL_RE.match(line)
        if not match:
            raise ValueError(
                f"{section_name}: expected a line matching 'Panel N: ...' "
                f"but got: {line!r}"
            )
        panel_number = int(match.group(1))
        panel_text = match.group(2).strip()
        panels.append((panel_number, panel_text))

    # Validate sequential numbering starting at 1
    for expected, (actual, _) in enumerate(panels, start=1):
        if actual != expected:
            raise ValueError(
                f"{section_name}: expected Panel {expected} but found Panel {actual}. "
                "Panel numbers must be sequential starting at 1."
            )

    return [text for _, text in panels]


def _parse_style_notes(text: str) -> list[str]:
    """Parse bullet items from Style notes, stripping the leading "- "."""
    notes: list[str] = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith("- "):
            notes.append(line[2:].strip())
        # Lines not starting with "- " are silently ignored (e.g. preamble text)
    return notes


# Matches per-comic reference lines:
#   "  - filename — description"  (two-space indent, em-dash U+2014)
# Also accepts a plain hyphen " - filename - description" as a fallback.
_REF_EM_DASH_RE = re.compile(r"^\s{2}-\s+(.+?)\s+\u2014\s+(.+)$")
_REF_HYPHEN_RE = re.compile(r"^\s{2}-\s+(.+?)\s+-\s+(.+)$")
_PER_COMIC_MARKER_RE = re.compile(r"^-\s+Per-comic:", re.IGNORECASE)


def _parse_references(text: str) -> list[dict[str, str]]:
    """Parse per-comic reference lines from the References section.

    Only lines inside the "Per-comic:" sub-section are processed.  Each line
    must match the pattern::

        <two spaces>- <filename> — <description>

    The em-dash (U+2014) is the canonical separator; a plain hyphen is also
    accepted as a fallback.

    The "Style anchors" meta-line and any other non-matching lines are ignored.
    """
    refs: list[dict[str, str]] = []
    in_per_comic = False

    for line in text.splitlines():
        # Detect the start of the Per-comic sub-section
        if _PER_COMIC_MARKER_RE.match(line.strip()):
            in_per_comic = True
            continue

        # Stop collecting if we hit another top-level bullet (non-indented "- ...")
        # that is not a per-comic ref line.
        if in_per_comic and re.match(r"^-\s+", line) and not re.match(r"^\s{2}", line):
            in_per_comic = False
            continue

        if not in_per_comic:
            continue

        # Try em-dash first (canonical), then plain hyphen fallback
        match = _REF_EM_DASH_RE.match(line) or _REF_HYPHEN_RE.match(line)
        if match:
            refs.append(
                {"filename": match.group(1).strip(), "description": match.group(2).strip()}
            )

    return refs


def _parse_publish(text: str) -> str:
    """Join all non-blank lines in the Publish section."""
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    return " ".join(lines)
