"""Tests for generator.py — gpt-image-2 API wrapper.

Run with:  pytest scripts/comic_factory/test_generator.py -v
"""

from __future__ import annotations

import base64
import io
from pathlib import Path
from unittest.mock import MagicMock, call, patch

import httpx
import openai
import pytest

from scripts.comic_factory.generator import generate_panel

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

_KNOWN_BYTES = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
_B64_KNOWN = base64.b64encode(_KNOWN_BYTES).decode()

_FAKE_REQUEST = httpx.Request("POST", "https://api.openai.com/v1/images/edits")


def _make_rate_limit_error(msg: str = "rate limit") -> openai.RateLimitError:
    response = httpx.Response(429, request=_FAKE_REQUEST)
    return openai.RateLimitError(msg, response=response, body=None)


def _make_api_error(msg: str = "server error") -> openai.APIError:
    return openai.APIError(msg, _FAKE_REQUEST, body=None)


def _make_bad_request_error(msg: str = "bad request") -> openai.BadRequestError:
    response = httpx.Response(400, request=_FAKE_REQUEST)
    return openai.BadRequestError(msg, response=response, body=None)


def _make_success_response(b64: str = _B64_KNOWN) -> MagicMock:
    """Return a mock that looks like client.images.edit() success result."""
    item = MagicMock()
    item.b64_json = b64
    result = MagicMock()
    result.data = [item]
    return result


def _make_client(side_effect=None, return_value=None) -> MagicMock:
    """Return a mock OpenAI client."""
    mock_client = MagicMock()
    if side_effect is not None:
        mock_client.images.edit.side_effect = side_effect
    elif return_value is not None:
        mock_client.images.edit.return_value = return_value
    return mock_client


# ---------------------------------------------------------------------------
# Tests
# ---------------------------------------------------------------------------


def test_returns_decoded_bytes_on_success(tmp_path):
    """generate_panel decodes b64_json and returns raw PNG bytes."""
    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    mock_client = _make_client(return_value=_make_success_response(_B64_KNOWN))

    result = generate_panel(
        prompt="a comic panel",
        reference_images=[img],
        client=mock_client,
    )

    assert result == _KNOWN_BYTES


def test_passes_image_list_correctly(tmp_path):
    """generate_panel opens each reference image and passes a list of file handles."""
    p1 = tmp_path / "a.png"
    p2 = tmp_path / "b.png"
    p1.write_bytes(b"img1")
    p2.write_bytes(b"img2")

    mock_client = _make_client(return_value=_make_success_response())

    generate_panel(
        prompt="test",
        reference_images=[p1, p2],
        client=mock_client,
    )

    assert mock_client.images.edit.called
    _, kwargs = mock_client.images.edit.call_args
    image_arg = kwargs["image"]
    assert isinstance(image_arg, list)
    assert len(image_arg) == 2
    # Each element should be a file-like object (IO)
    for handle in image_arg:
        assert hasattr(handle, "read")


def test_passes_size_and_quality(tmp_path):
    """generate_panel forwards size and quality kwargs to the API."""
    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    mock_client = _make_client(return_value=_make_success_response())

    generate_panel(
        prompt="test",
        reference_images=[img],
        client=mock_client,
        size="1536x1024",
        quality="medium",
    )

    _, kwargs = mock_client.images.edit.call_args
    assert kwargs["size"] == "1536x1024"
    assert kwargs["quality"] == "medium"


def test_retries_on_rate_limit(tmp_path, monkeypatch):
    """generate_panel retries on RateLimitError and succeeds on 3rd attempt."""
    monkeypatch.setattr("time.sleep", lambda x: None)

    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    rate_err = _make_rate_limit_error()
    mock_client = _make_client(
        side_effect=[rate_err, rate_err, _make_success_response()]
    )

    result = generate_panel(
        prompt="test",
        reference_images=[img],
        client=mock_client,
        max_retries=3,
    )

    assert result == _KNOWN_BYTES
    assert mock_client.images.edit.call_count == 3


def test_retries_exhausted_raises(tmp_path, monkeypatch):
    """generate_panel re-raises after max_retries attempts are exhausted."""
    monkeypatch.setattr("time.sleep", lambda x: None)

    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    api_err = _make_api_error("500 internal")
    mock_client = _make_client(side_effect=api_err)

    with pytest.raises(openai.APIError):
        generate_panel(
            prompt="test",
            reference_images=[img],
            client=mock_client,
            max_retries=3,
        )

    # max_retries=3 means exactly 3 total attempts
    assert mock_client.images.edit.call_count == 3


def test_no_retry_on_bad_request(tmp_path, monkeypatch):
    """generate_panel raises BadRequestError immediately without any sleep."""
    sleep_calls: list[float] = []
    monkeypatch.setattr("time.sleep", lambda x: sleep_calls.append(x))

    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    bad_err = _make_bad_request_error()
    mock_client = _make_client(side_effect=bad_err)

    with pytest.raises(openai.BadRequestError):
        generate_panel(
            prompt="test",
            reference_images=[img],
            client=mock_client,
            max_retries=3,
        )

    assert mock_client.images.edit.call_count == 1
    assert sleep_calls == [], "Expected no sleeps on BadRequestError"


def test_closes_file_handles(tmp_path, monkeypatch):
    """File handles opened for reference images are closed after the call."""
    monkeypatch.setattr("time.sleep", lambda x: None)

    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    opened_handles: list[io.IOBase] = []
    real_open = open

    def tracking_open(path, mode="r", **kwargs):
        fh = real_open(path, mode, **kwargs)
        opened_handles.append(fh)
        return fh

    # Patch builtins.open only within generator module
    monkeypatch.setattr("scripts.comic_factory.generator.open", tracking_open)

    mock_client = _make_client(return_value=_make_success_response())

    generate_panel(
        prompt="test",
        reference_images=[img],
        client=mock_client,
    )

    assert len(opened_handles) == 1, "Expected exactly one file handle opened"
    assert opened_handles[0].closed, "File handle should be closed after generate_panel"


def test_closes_file_handles_on_exception(tmp_path, monkeypatch):
    """File handles are closed even when the API call raises an exception."""
    monkeypatch.setattr("time.sleep", lambda x: None)

    img = tmp_path / "ref.png"
    img.write_bytes(b"fake png")

    opened_handles: list[io.IOBase] = []
    real_open = open

    def tracking_open(path, mode="r", **kwargs):
        fh = real_open(path, mode, **kwargs)
        opened_handles.append(fh)
        return fh

    monkeypatch.setattr("scripts.comic_factory.generator.open", tracking_open)

    bad_err = _make_bad_request_error()
    mock_client = _make_client(side_effect=bad_err)

    with pytest.raises(openai.BadRequestError):
        generate_panel(
            prompt="test",
            reference_images=[img],
            client=mock_client,
        )

    assert len(opened_handles) == 1
    assert opened_handles[0].closed, "File handle should be closed even on exception"
