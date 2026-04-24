"""GitHub CLI and git operations wrapper for the comic factory pipeline."""
from __future__ import annotations

import json
import subprocess

CO_AUTHORED_BY = "Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"


def _run(cmd: list[str]) -> subprocess.CompletedProcess:
    """Run a command and return the result. Raises RuntimeError on nonzero exit."""
    result = subprocess.run(cmd, check=False, capture_output=True, text=True)
    if result.returncode != 0:
        raise RuntimeError(
            f"Command {cmd!r} failed with exit code {result.returncode}.\n"
            f"stderr: {result.stderr}"
        )
    return result


def fetch_issue(issue_number: int) -> dict:
    """
    Runs `gh issue view <number> --json number,title,body,labels`.
    Returns the parsed JSON dict.
    Raises RuntimeError on nonzero exit.
    """
    cmd = [
        "gh", "issue", "view", str(issue_number),
        "--json", "number,title,body,labels",
    ]
    result = _run(cmd)
    return json.loads(result.stdout)


def comment_on_issue(issue_number: int, body: str) -> None:
    """
    Runs `gh issue comment <number> --body <body>`.
    Raises RuntimeError on nonzero exit.
    """
    cmd = ["gh", "issue", "comment", str(issue_number), "--body", body]
    _run(cmd)


def update_issue_body(issue_number: int, body: str) -> None:
    """
    Runs `gh issue edit <number> --body <body>`.
    Raises RuntimeError on nonzero exit.
    """
    cmd = ["gh", "issue", "edit", str(issue_number), "--body", body]
    _run(cmd)


def swap_label(issue_number: int, remove: str | None, add: str | None) -> None:
    """
    Runs `gh issue edit <number> --remove-label <remove> --add-label <add>`.
    Either argument may be None (to skip that side).
    Raises RuntimeError on nonzero exit.
    """
    cmd = ["gh", "issue", "edit", str(issue_number)]
    if remove is not None:
        cmd += ["--remove-label", remove]
    if add is not None:
        cmd += ["--add-label", add]
    _run(cmd)


def close_issue(issue_number: int) -> None:
    """
    Runs `gh issue close <number>`.
    Raises RuntimeError on nonzero exit.
    """
    cmd = ["gh", "issue", "close", str(issue_number)]
    _run(cmd)


def commit_and_push(paths: list[str], message: str) -> None:
    """
    1. Refuses if any path in `paths` is `data/usage.json` — raises ValueError.
    2. Refuses if `paths` is empty.
    3. Runs `git add <p1> <p2> ...` (explicit paths, never -A).
    4. Runs `git commit -m <message>` (with a Co-Authored-By trailer appended).
    5. Runs `git push`.
    Raises RuntimeError on any nonzero exit.
    """
    if not paths:
        raise ValueError("paths must not be empty")
    if "data/usage.json" in paths:
        raise ValueError(
            "Refusing to commit data/usage.json — this file is auto-managed by the publisher."
        )

    full_message = f"{message}\n\n{CO_AUTHORED_BY}"

    _run(["git", "add"] + paths)
    _run(["git", "commit", "-m", full_message])
    _run(["git", "push"])


def dispatch_workflow(workflow_file: str) -> None:
    """
    Runs `gh workflow run <workflow_file>`.
    Used to trigger the publisher immediately after `/approve immediate`.
    """
    cmd = ["gh", "workflow", "run", workflow_file]
    _run(cmd)
