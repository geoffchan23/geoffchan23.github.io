"""Publish script for the daily /funnies digest.

Reads `_data/funnies_subscriptions.yml`, fetches each comic's feed, and
writes a `_funnies/YYYY-MM-DD.md` Jekyll collection doc for any day that
had at least one new strip published (by ET date).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import yaml
from dateutil import parser as dateutil_parser

ET = ZoneInfo("America/New_York")


def load_subscriptions(path: Path) -> list[dict[str, Any]]:
    """Load subscriptions from YAML, returning only active entries."""
    raw = yaml.safe_load(path.read_text()) or []
    return [entry for entry in raw if entry.get("active", False)]


def target_date_et(now: datetime | None = None) -> date:
    """Return yesterday's date in America/New_York."""
    if now is None:
        now = datetime.now(timezone.utc)
    et_now = now.astimezone(ET)
    return (et_now - timedelta(days=1)).date()


def parse_pub_date_et(text: str | None) -> date | None:
    """Parse an RSS/Atom date string and return its ET calendar date.

    Returns None for empty input or unparseable strings.
    """
    if not text:
        return None
    try:
        dt = dateutil_parser.parse(text)
    except (ValueError, TypeError, OverflowError):
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(ET).date()
