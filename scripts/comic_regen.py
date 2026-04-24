#!/usr/bin/env python3
"""Entrypoint for /regen comments. Wraps comic_generate.py with prompt updates."""
import argparse
import os
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from comic_factory import gh, regen


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--issue", type=int, required=True)
    parser.add_argument("--comment", type=str, required=True, help="Comment body text")
    args = parser.parse_args()

    command = regen.parse_regen_command(args.comment)
    if command is None:
        print(f"Comment does not match /regen pattern, ignoring: {args.comment!r}")
        return

    # Fetch current body
    issue = gh.fetch_issue(args.issue)
    body = issue.get("body", "")

    # If append_text is provided, update the body first
    if command.append_text and command.panel_number:
        new_body = regen.update_prompt_in_body(body, command.panel_number, command.append_text)
        gh.update_issue_body(args.issue, new_body)

    # Invoke the generator
    gen_args = ["python", str(Path(__file__).parent / "comic_generate.py"), "--issue", str(args.issue)]
    if not command.all_panels and command.panel_number:
        gen_args.extend(["--panels", str(command.panel_number)])

    result = subprocess.run(gen_args, check=False)
    sys.exit(result.returncode)


if __name__ == "__main__":
    main()
