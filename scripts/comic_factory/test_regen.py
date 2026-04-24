"""Tests for regen.py — parse_regen_command and update_prompt_in_body."""
import pytest

from comic_factory.regen import parse_regen_command, RegenCommand, update_prompt_in_body


# ---------------------------------------------------------------------------
# parse_regen_command
# ---------------------------------------------------------------------------

def test_parse_plain_regen():
    cmd = parse_regen_command("/regen")
    assert cmd is not None
    assert cmd.all_panels is True
    assert cmd.panel_number is None
    assert cmd.append_text is None


def test_parse_regen_with_trailing_whitespace():
    cmd = parse_regen_command("/regen   ")
    assert cmd is not None
    assert cmd.all_panels is True
    assert cmd.panel_number is None
    assert cmd.append_text is None


def test_parse_regen_with_leading_whitespace():
    """Leading/trailing whitespace on the whole comment is stripped."""
    cmd = parse_regen_command("  /regen  ")
    assert cmd is not None
    assert cmd.all_panels is True


def test_parse_regen_panel_no_extra():
    cmd = parse_regen_command("/regen panel 3")
    assert cmd is not None
    assert cmd.all_panels is False
    assert cmd.panel_number == 3
    assert cmd.append_text is None


def test_parse_regen_panel_with_extra():
    cmd = parse_regen_command("/regen panel 2: make it rain")
    assert cmd is not None
    assert cmd.all_panels is False
    assert cmd.panel_number == 2
    assert cmd.append_text == "make it rain"


def test_parse_regen_panel_with_extra_leading_space():
    """Whitespace after the colon is stripped from append_text."""
    cmd = parse_regen_command("/regen panel 1:   extra guidance here  ")
    assert cmd is not None
    assert cmd.panel_number == 1
    assert cmd.append_text == "extra guidance here"


def test_parse_non_regen_returns_none():
    """Comment starting with /approve should return None."""
    assert parse_regen_command("/approve") is None


def test_parse_regen_malformed_returns_none():
    """/regen followed by unrecognised text returns None."""
    assert parse_regen_command("/regen foo") is None


def test_parse_regen_case_sensitive():
    """/regen is only recognised in lowercase; /Regen and /REGEN are not."""
    assert parse_regen_command("/Regen") is None
    assert parse_regen_command("/REGEN") is None
    assert parse_regen_command("/REGEN panel 1") is None


def test_parse_empty_string_returns_none():
    assert parse_regen_command("") is None


def test_parse_regeneration_returns_none():
    """/regeneration is not a valid command."""
    assert parse_regen_command("/regeneration") is None


def test_parse_regen_panel_zero_returns_none():
    """Panel number must be >= 1."""
    assert parse_regen_command("/regen panel 0") is None


def test_parse_regen_panel_negative_returns_none():
    assert parse_regen_command("/regen panel -1") is None


def test_parse_regen_multiline_uses_first_line():
    """Only the first line is parsed for the /regen command."""
    cmd = parse_regen_command("/regen\nsome other content")
    assert cmd is not None
    assert cmd.all_panels is True


def test_parse_regen_panel_multiline():
    cmd = parse_regen_command("/regen panel 2\nextra stuff on second line")
    assert cmd is not None
    assert cmd.all_panels is False
    assert cmd.panel_number == 2
    assert cmd.append_text is None


# ---------------------------------------------------------------------------
# update_prompt_in_body
# ---------------------------------------------------------------------------

SAMPLE_BODY = """\
## Story

Some story text.

## Prompts
Panel 1: First prompt here
Panel 2: Second prompt here
Panel 3: Third prompt here

## Notes

Some notes.
"""


def test_update_prompt_appends_to_correct_panel():
    result = update_prompt_in_body(SAMPLE_BODY, 2, "make it rain")
    assert "Panel 2: Second prompt here [REGEN: make it rain]" in result


def test_update_prompt_preserves_other_panels():
    result = update_prompt_in_body(SAMPLE_BODY, 2, "make it rain")
    assert "Panel 1: First prompt here" in result
    assert "Panel 3: Third prompt here" in result


def test_update_prompt_raises_for_nonexistent_panel():
    with pytest.raises(ValueError):
        update_prompt_in_body(SAMPLE_BODY, 99, "something")


def test_update_prompt_panel_1():
    result = update_prompt_in_body(SAMPLE_BODY, 1, "new guidance")
    assert "Panel 1: First prompt here [REGEN: new guidance]" in result


def test_update_prompt_preserves_sections_outside_prompts():
    result = update_prompt_in_body(SAMPLE_BODY, 1, "x")
    assert "## Story" in result
    assert "Some story text." in result
    assert "## Notes" in result
    assert "Some notes." in result


def test_update_prompt_no_prompts_section_raises():
    body_without_prompts = "## Story\n\nJust a story.\n"
    with pytest.raises(ValueError):
        update_prompt_in_body(body_without_prompts, 1, "something")
