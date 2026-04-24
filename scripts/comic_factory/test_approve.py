"""Tests for approve.py — parse_approve_command and update_publish_in_body."""
from datetime import date

import pytest

from comic_factory.approve import ApproveCommand, parse_approve_command, update_publish_in_body


# ---------------------------------------------------------------------------
# parse_approve_command
# ---------------------------------------------------------------------------

def test_parse_plain_approve_is_immediate():
    cmd = parse_approve_command("/approve")
    assert cmd is not None
    assert cmd.immediate is True
    assert cmd.publish_date is None


def test_parse_approve_immediate_keyword():
    cmd = parse_approve_command("/approve immediate")
    assert cmd is not None
    assert cmd.immediate is True
    assert cmd.publish_date is None


def test_parse_approve_with_date():
    cmd = parse_approve_command("/approve 2026-04-30")
    assert cmd is not None
    assert cmd.immediate is False
    assert cmd.publish_date == date(2026, 4, 30)


def test_parse_approve_malformed_date_raises():
    """Non-strict dates like 2026-4-30 (single-digit month) must raise ValueError."""
    with pytest.raises(ValueError):
        parse_approve_command("/approve 2026-4-30")


def test_parse_approve_unknown_token_raises():
    """/approve followed by an unrecognised token must raise ValueError."""
    with pytest.raises(ValueError):
        parse_approve_command("/approve foo")


def test_parse_non_approve_returns_none():
    """Comment not starting with /approve returns None."""
    assert parse_approve_command("/regen") is None
    assert parse_approve_command("") is None
    assert parse_approve_command("hello world") is None


def test_parse_approve_case_sensitive_returns_none():
    """/Approve and /APPROVE are not valid — must return None."""
    assert parse_approve_command("/Approve") is None
    assert parse_approve_command("/APPROVE") is None
    assert parse_approve_command("/Approve immediate") is None


def test_parse_approve_trailing_whitespace():
    """Trailing whitespace on plain /approve is fine."""
    cmd = parse_approve_command("/approve   ")
    assert cmd is not None
    assert cmd.immediate is True


def test_parse_approve_multiline_uses_first_line():
    """Only the first line is parsed."""
    cmd = parse_approve_command("/approve\nsome notes below")
    assert cmd is not None
    assert cmd.immediate is True


def test_parse_approve_date_invalid_value_raises():
    """Strict YYYY-MM-DD format but impossible date raises ValueError."""
    with pytest.raises(ValueError):
        parse_approve_command("/approve 2026-13-01")


# ---------------------------------------------------------------------------
# update_publish_in_body
# ---------------------------------------------------------------------------

SAMPLE_BODY_WITH_PUBLISH = """\
## Story

Some story text.

## Publish
old-value

## Notes

Some notes.
"""

SAMPLE_BODY_WITHOUT_PUBLISH = """\
## Story

Some story text.

## Notes

Some notes.
"""


def test_update_publish_replaces_existing_content():
    result = update_publish_in_body(SAMPLE_BODY_WITH_PUBLISH, "2026-05-15")
    assert "2026-05-15" in result
    assert "old-value" not in result


def test_update_publish_appends_when_missing():
    result = update_publish_in_body(SAMPLE_BODY_WITHOUT_PUBLISH, "immediate")
    assert "## Publish" in result
    assert "immediate" in result


def test_update_publish_preserves_other_sections():
    result = update_publish_in_body(SAMPLE_BODY_WITH_PUBLISH, "immediate")
    assert "## Story" in result
    assert "Some story text." in result
    assert "## Notes" in result
    assert "Some notes." in result


def test_update_publish_immediate_value():
    result = update_publish_in_body(SAMPLE_BODY_WITH_PUBLISH, "immediate")
    assert "immediate" in result
    assert "old-value" not in result


def test_update_publish_on_empty_body():
    result = update_publish_in_body("", "2026-06-01")
    assert "## Publish" in result
    assert "2026-06-01" in result


def test_update_publish_preserves_sections_after_publish():
    body = "## Publish\nold\n\n## After\nsome content\n"
    result = update_publish_in_body(body, "new-value")
    assert "new-value" in result
    assert "old" not in result
    assert "## After" in result
    assert "some content" in result
