# Comic Factory scripts

Python package + entry points for the comic factory pipeline. Runs inside GitHub Actions (Python 3.12). See `docs/superpowers/specs/2026-04-24-comic-factory-design.md` for the full design.

## Install

```bash
pip install -r scripts/requirements.txt
```

## Package: `comic_factory/`

- `issue_parser.py` — parses structured GitHub issue bodies into dicts
- `style_refs.py` — scans `_art/` for `comic_style_reference: true` flagged posts
- `generator.py` — gpt-image-2 `/v1/images/edits` API wrapper with retry
- `gh.py` — shells out to `gh` and `git` for GitHub / commit operations

## Entry points

- `scripts/comic_generate.py` — triggered by `comic:generate` label. Reads the issue, calls gpt-image-2, commits drafts, comments with previews.
- `scripts/comic_publish.py` — runs daily + on dispatch. Moves approved drafts to `_comics/`, closes issues.

## Environment

- `OPENAI_API_KEY` — OpenAI API key with access to gpt-image-2
- `GITHUB_TOKEN` — auto-provided by GitHub Actions

## Never stage

`data/usage.json` is owned by the smart-home agent. The `gh.commit_and_push` helper refuses to stage it.
