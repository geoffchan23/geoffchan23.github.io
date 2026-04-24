"""
Helper functions for the /approve workflow.

Only lowercase `/approve` is recognised. `/Approve`, `/APPROVE`, etc. are not
valid and will cause parse_approve_command to return None.
"""
from __future__ import annotations

import re
from datetime import date
from typing import NamedTuple


class ApproveCommand(NamedTuple):
    """Parsed /approve comment."""
    immediate: bool
    publish_date: date | None  # set when not immediate


_APPROVE_PLAIN = re.compile(r"^/approve\s*$")
_APPROVE_IMMEDIATE = re.compile(r"^/approve\s+immediate\s*$")
_APPROVE_WITH_ARG = re.compile(r"^/approve\s+(\S+)\s*$")

# Strict YYYY-MM-DD: exactly 4-2-2 digits separated by hyphens
_STRICT_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")


def parse_approve_command(comment_body: str) -> ApproveCommand | None:
    """
    Parses comment body. Returns ApproveCommand if matches /approve pattern, else None.

    Supported forms:
      `/approve`                → immediate=True
      `/approve immediate`      → immediate=True
      `/approve 2026-04-30`     → immediate=False, publish_date=date(2026, 4, 30)
      `/approve 2026-4-30`      → raises ValueError (strict YYYY-MM-DD format)
      `/approve foo`            → raises ValueError

    Anything not starting with `/approve` (case-sensitive) → None.
    """
    # Strip outer whitespace, then take the first line only.
    first_line = comment_body.strip().split("\n")[0].rstrip()

    # Fast-reject: must start with /approve (case-sensitive)
    if not first_line.startswith("/approve"):
        return None

    # Plain /approve (no args)
    if _APPROVE_PLAIN.match(first_line):
        return ApproveCommand(immediate=True, publish_date=None)

    # /approve immediate
    if _APPROVE_IMMEDIATE.match(first_line):
        return ApproveCommand(immediate=True, publish_date=None)

    # /approve <arg>
    m = _APPROVE_WITH_ARG.match(first_line)
    if m:
        arg = m.group(1)
        # Validate strict YYYY-MM-DD format first
        if not _STRICT_DATE.match(arg):
            raise ValueError(
                f"Invalid /approve argument {arg!r}. "
                "Expected 'immediate' or a date in strict YYYY-MM-DD format (e.g. 2026-04-30)."
            )
        # Now parse the date value
        try:
            parsed = date.fromisoformat(arg)
        except ValueError:
            raise ValueError(
                f"Invalid date {arg!r} in /approve command. "
                "Expected strict YYYY-MM-DD format (e.g. 2026-04-30)."
            )
        return ApproveCommand(immediate=False, publish_date=parsed)

    # /approve followed by something that doesn't match any known pattern
    raise ValueError(
        f"Could not parse /approve command from: {first_line!r}. "
        "Supported forms: '/approve', '/approve immediate', '/approve YYYY-MM-DD'."
    )


def update_publish_in_body(issue_body: str, publish_value: str) -> str:
    """
    Replace the content under `## Publish` section with `publish_value` (single line).
    If the section is missing, append it at the end.
    Returns the modified body.
    """
    lines = issue_body.split("\n")

    # Locate the ## Publish section
    publish_start = None
    for i, line in enumerate(lines):
        if line.strip() == "## Publish":
            publish_start = i
            break

    if publish_start is None:
        # Append the section at the end
        # Ensure there's a blank line before the new section if body is non-empty
        result = issue_body.rstrip("\n")
        if result:
            result += "\n\n"
        result += f"## Publish\n{publish_value}\n"
        return result

    # Find the next section header (## ...) after ## Publish, or end of file
    publish_end = len(lines)
    for i in range(publish_start + 1, len(lines)):
        if lines[i].startswith("## "):
            publish_end = i
            break

    # Replace everything between publish_start+1 and publish_end with the new value
    new_lines = lines[:publish_start + 1] + [publish_value] + lines[publish_end:]
    return "\n".join(new_lines)
