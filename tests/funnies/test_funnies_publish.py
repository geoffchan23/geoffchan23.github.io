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


FIXTURES = Path(__file__).parent / "fixtures"


def test_parse_feed_returns_entries_with_expected_fields() -> None:
    xml = (FIXTURES / "oatmeal_feed.xml").read_text()
    entries = fp.parse_feed(xml)

    assert len(entries) == 2
    first = entries[0]
    assert first["title"] == "Finish the drawing. It is NOT a plane!"
    assert first["link"] == "http://theoatmeal.com/comics/finish_drawing?no_popup=1"
    assert first["pub_date_et"] == date(2026, 4, 28)
    assert "finish_drawing_big.png" in first["raw_description"]


def test_entries_published_on_filters_to_target_date() -> None:
    xml = (FIXTURES / "oatmeal_feed.xml").read_text()
    entries = fp.parse_feed(xml)

    matching = fp.entries_published_on(entries, date(2026, 4, 28))
    assert len(matching) == 1
    assert matching[0]["title"].startswith("Finish the drawing")

    none_for_date = fp.entries_published_on(entries, date(2026, 4, 29))
    assert none_for_date == []


def test_extract_image_feed_pulls_first_img_src() -> None:
    description = (
        '<a href="http://example.com/x"><img src="https://cdn.example.com/x.png" /></a>'
        '<img src="https://cdn.example.com/y.png" />'
    )
    assert fp.extract_image_feed(description) == "https://cdn.example.com/x.png"


def test_extract_image_feed_returns_none_when_no_img() -> None:
    assert fp.extract_image_feed("") is None
    assert fp.extract_image_feed("<p>just text</p>") is None
    assert fp.extract_image_feed("<img>") is None  # no src attr


def test_extract_image_og_reads_meta_property() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image_og(html) == "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_og_returns_none_when_missing() -> None:
    assert fp.extract_image_og("<html><head></head><body></body></html>") is None


def test_extract_image_scrape_uses_selector() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    url = fp.extract_image_scrape(html, "article img.comic-strip")
    assert url == "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_scrape_returns_none_when_selector_misses() -> None:
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image_scrape(html, "img.no-such-class") is None


def test_extract_image_uses_feed_strategy_when_configured() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {
        "raw_description": '<img src="https://cdn.example.com/x.png" />',
        "link": "https://example.com/post/x",
    }
    # Fetcher should NOT be called for feed strategy.
    def boom(_url: str) -> str:
        raise AssertionError("fetcher should not be called")
    assert fp.extract_image(comic, entry, fetcher=boom) == "https://cdn.example.com/x.png"


def test_extract_image_uses_og_strategy_via_fetcher() -> None:
    comic = {"image_strategy": "og", "image_selector": ""}
    entry = {"raw_description": "", "link": "https://example.com/post/x"}
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    fetched: list[str] = []
    def fetcher(url: str) -> str:
        fetched.append(url)
        return html
    url = fp.extract_image(comic, entry, fetcher=fetcher)
    assert url == "https://www.monkeyuser.com/2025/button/justabutton.png"
    assert fetched == ["https://example.com/post/x"]


def test_extract_image_falls_forward_to_og_when_feed_empty() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {"raw_description": "<p>no image here</p>", "link": "https://example.com/post/x"}
    html = (FIXTURES / "monkeyuser_button_page.html").read_text()
    assert fp.extract_image(comic, entry, fetcher=lambda _u: html) == \
        "https://www.monkeyuser.com/2025/button/justabutton.png"


def test_extract_image_returns_none_when_all_strategies_miss() -> None:
    comic = {"image_strategy": "feed", "image_selector": ""}
    entry = {"raw_description": "", "link": "https://example.com/post/x"}
    bare_html = "<html><head></head><body></body></html>"
    assert fp.extract_image(comic, entry, fetcher=lambda _u: bare_html) is None
