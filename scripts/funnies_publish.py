"""Publish script for the daily /funnies digest.

Reads `_data/funnies_subscriptions.yml`, fetches each comic's feed, and
writes a `_funnies/YYYY-MM-DD.md` Jekyll collection doc for any day that
had at least one new strip published (by ET date).
"""
from __future__ import annotations

from pathlib import Path
from typing import Any, Callable
from datetime import date, datetime, timedelta, timezone
from zoneinfo import ZoneInfo

import yaml
from dateutil import parser as dateutil_parser
import feedparser
from bs4 import BeautifulSoup

ET = ZoneInfo("America/New_York")

Fetcher = Callable[[str], str]


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


def extract_image_feed(raw_description: str) -> str | None:
    """Return the first <img src=...> URL inside the description, or None."""
    if not raw_description:
        return None
    soup = BeautifulSoup(raw_description, "html.parser")
    img = soup.find("img", src=True)
    return img["src"] if img else None


def extract_image_og(html: str) -> str | None:
    """Return the og:image URL from <meta property='og:image'>, or None."""
    soup = BeautifulSoup(html, "html.parser")
    meta = soup.find("meta", attrs={"property": "og:image"})
    if meta and meta.get("content"):
        return meta["content"].strip() or None
    return None


def extract_image_scrape(html: str, selector: str) -> str | None:
    """Return the first matching element's src, or None."""
    if not selector:
        return None
    soup = BeautifulSoup(html, "html.parser")
    el = soup.select_one(selector)
    if el and el.get("src"):
        return el["src"].strip() or None
    return None


def extract_image(
    comic: dict[str, Any],
    entry: dict[str, Any],
    fetcher: Fetcher,
) -> str | None:
    """Run the comic's configured strategy, falling forward to `og` if empty.

    Returns the image URL or None. The script logs failure at the call site.
    """
    strategy = comic.get("image_strategy", "feed")

    # First try the configured strategy.
    if strategy == "feed":
        url = extract_image_feed(entry.get("raw_description", ""))
        if url:
            return url
    elif strategy == "og":
        html = fetcher(entry["link"])
        url = extract_image_og(html)
        if url:
            return url
    elif strategy == "scrape":
        html = fetcher(entry["link"])
        url = extract_image_scrape(html, comic.get("image_selector", ""))
        if url:
            return url

    # Fall forward to og (only if we haven't already tried it).
    if strategy != "og" and entry.get("link"):
        html = fetcher(entry["link"])
        return extract_image_og(html)

    return None


def build_strip(
    comic: dict[str, Any],
    entry: dict[str, Any],
    image_url: str,
) -> dict[str, Any]:
    """Build the per-strip dict that goes into the issue's front matter."""
    strip: dict[str, Any] = {
        "comic_id": comic["id"],
        "comic_name": comic["name"],
        "artist": comic["artist"],
        "homepage": comic["homepage"],
        "title": entry["title"],
        "image_url": image_url,
        "source_url": entry["link"],
    }
    if comic.get("support"):
        strip["support"] = comic["support"]
    return strip


def write_issue(target: date, strips: list[dict[str, Any]], funnies_dir: Path) -> Path:
    """Write _funnies/YYYY-MM-DD.md with the strip list in front matter."""
    funnies_dir.mkdir(parents=True, exist_ok=True)
    out_path = funnies_dir / f"{target.isoformat()}.md"

    # We hand-construct the front matter (rather than yaml.dump on the whole thing)
    # so the date stays unquoted and key order is stable.
    body_data = {
        "layout": "funnies-issue",
        "date": target,
        "strips": strips,
    }
    front_matter = yaml.safe_dump(
        body_data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    )
    out_path.write_text(f"---\n{front_matter}---\n")
    return out_path
