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
import feedparser

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


def parse_feed(xml_text: str) -> list[dict[str, Any]]:
    """Parse RSS/Atom XML and return our normalized entry dicts.

    Each dict has: title, link, pub_date_et (date or None), raw_description.
    Entries with no parseable date are returned with pub_date_et=None;
    callers decide whether to drop them.
    """
    parsed = feedparser.parse(xml_text)
    entries: list[dict[str, Any]] = []
    for e in parsed.entries:
        # feedparser exposes pubDate / dc:date / updated under various keys;
        # `published` / `updated` are the normalized ones it picks for us.
        raw_date = e.get("published") or e.get("updated") or e.get("created")
        # `description` covers RSS <description>; `content` covers Atom and content:encoded.
        raw_description = e.get("description", "") or ""
        if not raw_description and getattr(e, "content", None):
            raw_description = e.content[0].get("value", "") if e.content else ""
        entries.append({
            "title": e.get("title", "").strip(),
            "link": e.get("link", "").strip(),
            "pub_date_et": parse_pub_date_et(raw_date),
            "raw_description": raw_description,
        })
    return entries


def entries_published_on(entries: list[dict[str, Any]], target: date) -> list[dict[str, Any]]:
    """Return entries whose pub_date_et equals target."""
    return [e for e in entries if e["pub_date_et"] == target]
