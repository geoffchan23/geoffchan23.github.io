#!/usr/bin/env python3
"""Main entrypoint for the comic factory generator."""
import argparse
import base64
import hashlib
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

from openai import OpenAI

# Make comic_factory package importable when running from scripts/
sys.path.insert(0, str(Path(__file__).parent))

from comic_factory import issue_parser, style_refs, generator, gh


REPO_ROOT = Path(__file__).parent.parent  # scripts/ -> repo root
REFS_DRAFT_DIR = REPO_ROOT / "comics" / "references-draft"
DRAFTS_DIR = REPO_ROOT / "_comic_drafts"
ART_DIR = REPO_ROOT / "_art"
IMAGES_DIR = REPO_ROOT / "art" / "images"

RAW_URL_PREFIX = "https://raw.githubusercontent.com/geoffchan23/geoffchan23.github.io/main"


def parse_args(argv=None):
    p = argparse.ArgumentParser()
    p.add_argument("--issue", type=int, required=True)
    p.add_argument("--panels", type=str, default=None, help="Comma-separated 1-indexed panel numbers")
    return p.parse_args(argv)


def build_preview_comment(issue_number: int, panels: list[int]) -> str:
    lines = [
        "@geoffchan23 draft ready for review.",
        "",
    ]
    for p in panels:
        img_url = f"{RAW_URL_PREFIX}/_comic_drafts/{issue_number}/{p:02d}.png"
        lines.append(f"**Panel {p}:**")
        lines.append(f"![Panel {p}]({img_url})")
        lines.append("")
    lines.extend([
        "To approve: comment `/approve` (immediate) or `/approve YYYY-MM-DD`.",
        "To regenerate all panels: comment `/regen`.",
        "To regenerate one panel: comment `/regen panel N` or `/regen panel N: <additional guidance>`.",
    ])
    return "\n".join(lines)


def build_failure_comment(error: str) -> str:
    return (
        f"@geoffchan23 generation failed: {error}\n\n"
        "Add label `comic:generate` again to retry."
    )


def main():
    args = parse_args()
    issue_number = args.issue

    panel_filter = None
    if args.panels:
        panel_filter = [int(x.strip()) for x in args.panels.split(",")]

    try:
        # 1. Fetch issue
        issue = gh.fetch_issue(issue_number)
        title = issue.get("title", f"issue-{issue_number}")
        body = issue.get("body", "")

        # 2. Parse body
        parsed = issue_parser.parse_issue_body(body)
        scripts = parsed["script"]
        prompts = parsed["prompts"]
        if not scripts or not prompts:
            raise ValueError("Issue body has no Script or Prompts sections.")

        # 3. Determine which panels to generate
        panels_to_run = panel_filter or list(range(1, len(prompts) + 1))
        for p in panels_to_run:
            if p < 1 or p > len(prompts):
                raise ValueError(f"Panel {p} out of range (have {len(prompts)} panels).")

        # 4. Gather reference images
        style_ref_paths = style_refs.find_style_refs(
            art_dir=ART_DIR, images_dir=IMAGES_DIR, cap=6
        )
        per_comic_ref_dir = REFS_DRAFT_DIR / str(issue_number)
        per_comic_refs = sorted(per_comic_ref_dir.glob("*")) if per_comic_ref_dir.exists() else []
        reference_images = style_ref_paths + per_comic_refs

        # 5. Set up output dir
        out_dir = DRAFTS_DIR / str(issue_number)
        out_dir.mkdir(parents=True, exist_ok=True)

        # 6. Load existing meta if regen, else start fresh
        meta_path = out_dir / "meta.json"
        if meta_path.exists():
            with open(meta_path) as f:
                meta = json.load(f)
        else:
            meta = {
                "model": "gpt-image-2",
                "model_snapshot": "gpt-image-2-2026-04-21",
                "issue": issue_number,
                "panels": [],
            }
        meta["generated_at"] = datetime.now(timezone.utc).isoformat()

        # 7. Generate panels
        client = OpenAI()
        panel_meta_by_index = {pm["index"]: pm for pm in meta.get("panels", [])}
        for panel_num in panels_to_run:
            prompt_text = prompts[panel_num - 1]
            png_bytes = generator.generate_panel(
                prompt=prompt_text,
                reference_images=reference_images,
                client=client,
                size="1024x1024",
                quality="high",
            )
            panel_path = out_dir / f"{panel_num:02d}.png"
            panel_path.write_bytes(png_bytes)

            prompt_hash = hashlib.sha256(prompt_text.encode()).hexdigest()[:16]
            panel_meta = panel_meta_by_index.get(panel_num, {"index": panel_num, "revision": 0})
            panel_meta.update({
                "prompt_sha256": prompt_hash,
                "refs": [str(p.relative_to(REPO_ROOT)) for p in reference_images],
                "size": "1024x1024",
                "revision": panel_meta.get("revision", 0) + 1,
            })
            panel_meta_by_index[panel_num] = panel_meta

        meta["panels"] = sorted(panel_meta_by_index.values(), key=lambda x: x["index"])

        # 8. Write meta.json
        meta_path.write_text(json.dumps(meta, indent=2, default=str))

        # 9. Commit + push
        paths_to_commit = [str((out_dir).relative_to(REPO_ROOT))]
        gh.commit_and_push(
            paths=paths_to_commit,
            message=f"comics: generate drafts for issue #{issue_number}"
        )

        # 10. Comment
        all_panels = panel_filter or list(range(1, len(prompts) + 1))
        comment = build_preview_comment(issue_number, all_panels)
        gh.comment_on_issue(issue_number, comment)

        # 11. Swap label (only if triggered from comic:generate — check current labels)
        current_labels = [lbl["name"] for lbl in issue.get("labels", [])]
        if "comic:generate" in current_labels:
            gh.swap_label(issue_number, remove="comic:generate", add="comic:review")

    except Exception as e:
        # Best-effort failure reporting
        try:
            gh.comment_on_issue(issue_number, build_failure_comment(str(e)))
            gh.swap_label(issue_number, remove="comic:generate", add=None)
        except Exception as inner:
            print(f"Failed to report failure to issue: {inner}", file=sys.stderr)
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
