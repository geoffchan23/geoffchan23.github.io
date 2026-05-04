"""Tests for scripts/funnies_publish.py."""
from pathlib import Path
import textwrap

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
