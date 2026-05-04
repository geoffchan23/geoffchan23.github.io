"""Tests for scripts/funnies_publish.py."""
from pathlib import Path
import textwrap
from datetime import date, datetime, timezone

import funnies_publish as fp


def test_load_subscriptions_returns_only_active(tmp_path: Path) -> None:
    yaml_path = tmp_path / "subs.yml"
    yaml_path.write_text(textwrap.dedent("""\
        - id: a
          name: "A"
          active: true
        - id: b
          name: "B"
          active: false
        - id: c
          name: "C"
          active: true
    """))

    subs = fp.load_subscriptions(yaml_path)

    assert [s["id"] for s in subs] == ["a", "c"]


def test_target_date_et_returns_yesterday() -> None:
    # 13:00 UTC on 2026-04-29 == 09:00 ET on 2026-04-29.
    # "Yesterday in ET" should be 2026-04-28.
    now = datetime(2026, 4, 29, 13, 0, tzinfo=timezone.utc)
    assert fp.target_date_et(now) == date(2026, 4, 28)


def test_target_date_et_handles_et_midnight_boundary() -> None:
    # 03:30 UTC on 2026-04-29 == 23:30 ET on 2026-04-28.
    # "Yesterday in ET" should be 2026-04-27.
    now = datetime(2026, 4, 29, 3, 30, tzinfo=timezone.utc)
    assert fp.target_date_et(now) == date(2026, 4, 27)


def test_parse_pub_date_et_rss_format() -> None:
    # RSS pubDate, UTC.
    assert fp.parse_pub_date_et("Wed, 04 Feb 2026 04:03:13 +0000") == date(2026, 2, 3)


def test_parse_pub_date_et_atom_format() -> None:
    assert fp.parse_pub_date_et("2026-04-28T17:58:01+02:00") == date(2026, 4, 28)


def test_parse_pub_date_et_returns_none_on_garbage() -> None:
    assert fp.parse_pub_date_et("not a date") is None
    assert fp.parse_pub_date_et("") is None
    assert fp.parse_pub_date_et(None) is None
