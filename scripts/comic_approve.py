#!/usr/bin/env python3
"""Entrypoint for /approve comments."""
import argparse
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from comic_factory import approve, gh


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--issue", type=int, required=True)
    parser.add_argument("--comment", type=str, required=True)
    args = parser.parse_args()

    try:
        command = approve.parse_approve_command(args.comment)
    except ValueError as e:
        gh.comment_on_issue(args.issue, f"Could not parse `/approve` command: {e}")
        sys.exit(1)

    if command is None:
        print("Not an /approve comment, ignoring.")
        return

    # Determine publish value string for the issue body
    if command.immediate:
        publish_value = "immediate"
    else:
        publish_value = command.publish_date.isoformat()

    # Update issue body
    issue = gh.fetch_issue(args.issue)
    new_body = approve.update_publish_in_body(issue.get("body", ""), publish_value)
    gh.update_issue_body(args.issue, new_body)

    # Swap label
    gh.swap_label(args.issue, remove="comic:review", add="comic:queued")

    # Confirm + maybe dispatch
    if command.immediate:
        gh.comment_on_issue(
            args.issue,
            "Queued for immediate publish. Dispatching the publisher now — it should appear on /comics/ within a minute.",
        )
        gh.dispatch_workflow("comic-publish.yml")
    else:
        gh.comment_on_issue(
            args.issue,
            f"Queued for publish on **{publish_value}**. Publisher cron will pick it up that day.",
        )


if __name__ == "__main__":
    main()
