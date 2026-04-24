#!/usr/bin/env python3
"""Publisher entrypoint. Publishes any approved comics whose publish date is today or earlier."""
import json
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

sys.path.insert(0, str(Path(__file__).parent))

from comic_factory import gh, publisher


REPO_ROOT = Path(__file__).parent.parent
ET = ZoneInfo("America/New_York")


def main():
    today = datetime.now(ET).date()

    # Fetch queued issues
    import subprocess
    result = subprocess.run(
        ["gh", "issue", "list", "--label", "comic:queued", "--state", "open",
         "--json", "number,title,body,labels"],
        check=False, capture_output=True, text=True,
    )
    if result.returncode != 0:
        print(f"Failed to list queued issues: {result.stderr}", file=sys.stderr)
        sys.exit(1)

    queued = json.loads(result.stdout)
    if not queued:
        print("No queued issues. Exiting.")
        return

    published_count = 0
    for issue in queued:
        issue_number = issue["number"]
        try:
            result_info = publisher.publish_draft(issue, today, REPO_ROOT)
            if result_info["status"] == "not_due":
                print(f"Issue #{issue_number}: not due yet, skipping.")
                continue

            # Commit the published post + images, and remove the drafts
            paths_to_commit = result_info["paths_to_commit"]
            # For deletions, we use `git rm -r` separately first, then `git add` the new files
            for path in result_info["paths_to_remove"]:
                subprocess.run(["git", "rm", "-r", path], check=True, capture_output=True)

            gh.commit_and_push(
                paths=paths_to_commit,
                message=f"comics: publish {result_info['slug']}",
            )

            # Swap label and close issue
            gh.swap_label(issue_number, remove="comic:queued", add="comic:published")
            gh.close_issue(issue_number)

            print(f"Issue #{issue_number}: published as {result_info['slug']}")
            published_count += 1

        except Exception as e:
            print(f"Issue #{issue_number}: FAILED — {e}", file=sys.stderr)
            try:
                gh.comment_on_issue(issue_number, f"Publisher failed: {e}")
            except Exception:
                pass
            # Continue with next issue

    print(f"Published {published_count} comic(s).")


if __name__ == "__main__":
    main()
