"""
Helper functions for the /regen workflow.

Only lowercase `/regen` is recognised. `/Regen`, `/REGEN`, etc. are not valid
and will cause parse_regen_command to return None.
"""
from __future__ import annotations

import re
from typing import NamedTuple


class RegenCommand(NamedTuple):
    """Parsed /regen comment."""
    all_panels: bool          # True for /regen (no args)
    panel_number: int | None  # Panel to regen if not all_panels
    append_text: str | None   # Additional prompt text to append, if provided


# Matches:
#   /regen                           → all_panels=True
#   /regen panel N                   → all_panels=False, panel_number=N
#   /regen panel N: some extra text  → all_panels=False, panel_number=N, append_text=...
_REGEN_PLAIN = re.compile(r"^/regen\s*$")
_REGEN_PANEL = re.compile(r"^/regen panel (\d+)(?::\s*(.*?))?\s*$")


def parse_regen_command(comment_body: str) -> RegenCommand | None:
    """
    Parses a comment body. Returns RegenCommand if the comment starts with /regen,
    otherwise None.

    Supported forms (only lowercase /regen is accepted):
    - `/regen` or `/regen ` (trailing whitespace) → all_panels=True, panel_number=None, append_text=None
    - `/regen panel N` → all_panels=False, panel_number=N, append_text=None
    - `/regen panel N: some extra guidance` → all_panels=False, panel_number=N, append_text="some extra guidance"
    - Anything else (e.g., "/regen foo", "/regeneration", "/Regen") → None

    Leading/trailing whitespace on the whole comment is stripped before parsing.
    Only the first line of the comment is examined.
    """
    # Strip outer whitespace, then take the first line only.
    first_line = comment_body.strip().split("\n")[0].rstrip()

    # Plain /regen
    if _REGEN_PLAIN.match(first_line):
        return RegenCommand(all_panels=True, panel_number=None, append_text=None)

    # /regen panel N[: text]
    m = _REGEN_PANEL.match(first_line)
    if m:
        panel_number = int(m.group(1))
        if panel_number < 1:
            return None
        raw_extra = m.group(2)
        append_text = raw_extra.strip() if raw_extra is not None else None
        # Treat empty append_text as None
        if append_text == "":
            append_text = None
        return RegenCommand(all_panels=False, panel_number=panel_number, append_text=append_text)

    # No match
    return None


def update_prompt_in_body(issue_body: str, panel_number: int, append_text: str) -> str:
    """
    Updates the `## Prompts` section of an issue body. Appends ` [REGEN: <append_text>]`
    to the line for the specified panel. If the panel line doesn't exist, raises ValueError.
    If there is no `## Prompts` section, raises ValueError.

    Returns the modified body.

    Example:
      Input body contains:
        ## Prompts
        Panel 1: First prompt
        Panel 2: Second prompt

      update_prompt_in_body(body, 2, "make it rain") produces:
        ## Prompts
        Panel 1: First prompt
        Panel 2: Second prompt [REGEN: make it rain]
    """
    lines = issue_body.split("\n")

    # Locate the ## Prompts section
    prompts_start = None
    for i, line in enumerate(lines):
        if line.strip() == "## Prompts":
            prompts_start = i
            break

    if prompts_start is None:
        raise ValueError("No '## Prompts' section found in issue body.")

    # Find the next section header (## ...) after ## Prompts, or end of file
    prompts_end = len(lines)
    for i in range(prompts_start + 1, len(lines)):
        if lines[i].startswith("## "):
            prompts_end = i
            break

    # Look for "Panel N:" line within the prompts section
    panel_prefix = f"Panel {panel_number}:"
    target_line_index = None
    for i in range(prompts_start + 1, prompts_end):
        if lines[i].startswith(panel_prefix):
            target_line_index = i
            break

    if target_line_index is None:
        raise ValueError(
            f"Panel {panel_number} not found in '## Prompts' section."
        )

    lines[target_line_index] = f"{lines[target_line_index]} [REGEN: {append_text}]"
    return "\n".join(lines)
