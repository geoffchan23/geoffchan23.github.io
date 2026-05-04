"""Publish script for the daily /funnies digest.

Reads `_data/funnies_subscriptions.yml`, fetches each comic's feed, and
writes a `_funnies/YYYY-MM-DD.md` Jekyll collection doc for any day that
had at least one new strip published (by ET date).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml


def load_subscriptions(path: Path) -> list[dict[str, Any]]:
    """Load subscriptions from YAML, returning only active entries."""
    raw = yaml.safe_load(path.read_text()) or []
    return [entry for entry in raw if entry.get("active", False)]
