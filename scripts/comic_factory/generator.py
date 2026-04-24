"""gpt-image-2 API wrapper for the comic factory pipeline.

Provides :func:`generate_panel`, which calls the OpenAI ``/v1/images/edits``
endpoint with one or more reference images and returns the decoded PNG bytes.

Transient errors (RateLimitError, APIError with 5xx status) are retried with
exponential back-off (10 s, 30 s, 90 s).  Non-transient errors (BadRequestError,
AuthenticationError, …) are raised immediately.
"""

from __future__ import annotations

import base64
import builtins
import time
from contextlib import ExitStack
from pathlib import Path

import openai
from openai import OpenAI

# Expose builtins.open at module level so tests can monkeypatch it here.
open = builtins.open

# Seconds to wait before each successive retry attempt.
# Attempt 1 → no sleep (first try).
# Attempt 2 → sleep BACKOFF[0]  (10 s)
# Attempt 3 → sleep BACKOFF[1]  (30 s)
# Attempt 4 → sleep BACKOFF[2]  (90 s)  … and so on if max_retries > 4
_BACKOFF = [10, 30, 90]

# Error types that should be retried (transient / server-side).
_RETRYABLE = (openai.RateLimitError, openai.APIError)

# Error types that should NOT be retried (client errors).
_NON_RETRYABLE = (openai.BadRequestError, openai.AuthenticationError)


def generate_panel(
    prompt: str,
    reference_images: list[Path],
    client: OpenAI,
    size: str = "1024x1024",
    quality: str = "high",
    max_retries: int = 3,
) -> bytes:
    """Call gpt-image-2 ``/v1/images/edits`` and return decoded PNG bytes.

    Parameters
    ----------
    prompt:
        Text prompt describing the desired image edit / generation.
    reference_images:
        Paths to reference PNG files.  All files are opened in binary mode and
        closed after the call completes (or fails), via :class:`contextlib.ExitStack`.
    client:
        An :class:`openai.OpenAI` client instance.
    size:
        Output image size.  Accepted values: ``"1024x1024"``, ``"1536x1024"``,
        ``"1024x1536"``, ``"2048x2048"``, ``"3840x2160"``, ``"auto"``.
    quality:
        Image quality.  Accepted values: ``"low"``, ``"medium"``, ``"high"``,
        ``"auto"``.
    max_retries:
        **Total** number of attempts (not extra retries).  A value of ``3``
        means the call is tried up to 3 times total, with at most 2 sleep
        intervals between attempts.  If all attempts fail, the final exception
        is re-raised.

    Returns
    -------
    bytes
        Raw PNG bytes decoded from the ``b64_json`` field of the API response.

    Raises
    ------
    openai.BadRequestError
        Raised immediately on 400-class client errors (no retry).
    openai.AuthenticationError
        Raised immediately on authentication errors (no retry).
    openai.RateLimitError / openai.APIError
        Re-raised after all retry attempts are exhausted.
    """
    last_exc: Exception | None = None

    for attempt in range(max_retries):
        if attempt > 0:
            # Exponential back-off; cap at the last entry for extra retries.
            sleep_seconds = _BACKOFF[min(attempt - 1, len(_BACKOFF) - 1)]
            time.sleep(sleep_seconds)

        with ExitStack() as stack:
            handles = [
                stack.enter_context(open(path, "rb"))
                for path in reference_images
            ]
            try:
                result = client.images.edit(
                    model="gpt-image-2",
                    image=handles,
                    prompt=prompt,
                    size=size,
                    quality=quality,
                )
            except _NON_RETRYABLE:
                # Client error — re-raise immediately, no further retries.
                raise
            except _RETRYABLE as exc:
                last_exc = exc
                continue  # ExitStack closes handles; loop to next attempt.

        # Success path — ExitStack has closed handles.
        return base64.b64decode(result.data[0].b64_json)

    # All attempts exhausted.
    assert last_exc is not None
    raise last_exc
