# Comic Factory skill

Local Claude Code skill for Phase 1 (ideation) of the comic factory pipeline. See `docs/superpowers/specs/2026-04-24-comic-factory-design.md` for the full design.

## Files

- `SKILL.md` — the skill definition Claude reads when the skill is invoked
- `issue-template.md` — literal template for the GitHub issue body. `SKILL.md` references this by path; the skill reads it and substitutes values during session step 9.

## Pipeline context

```
Phase 1 (this skill, local)     →  GitHub issue created
Phase 2 (.github/workflows/comic-generate.yml)  →  drafts committed, issue @mentions Geoff
Phase 3a (.github/workflows/comic-regen.yml)    →  regenerate on /regen comment
Phase 3b (.github/workflows/comic-approve.yml)  →  queue on /approve comment
Phase 4 (.github/workflows/comic-publish.yml)   →  publish on schedule (cron + dispatch)
```

This skill's job ends at Phase 1. It creates the issue body and commits per-comic references. Everything else is automated from that point.

## What goes where

| Artifact | Location | Who writes |
|---|---|---|
| Raw idea conversation | Claude Code session | Geoff + Claude (this skill) |
| GitHub issue body | GitHub (issue #N) | this skill |
| Per-comic references | `comics/references-draft/<N>/` | this skill commits |
| Generated panel PNGs | `_comic_drafts/<N>/` | Phase 2 workflow commits |
| Published post | `_comics/<slug>.md` + `comics/images/<slug>/` | Phase 4 workflow commits |
| Style anchors | `_art/*.md` with `comic_style_reference: true` front-matter | Geoff (manual), optionally this skill |

## When NOT to invoke

- Regenerating a panel after Phase 2 has run → that's `/regen` comment in the issue, not a new session
- Approving a comic → that's `/approve` comment in the issue
- Fixing a published comic → manual edit of `_comics/<slug>.md`, not this skill

## Dependencies

- `gh` CLI (authenticated)
- Write access to `main`
- `OPENAI_API_KEY` repo secret (only used by Phase 2, not Phase 1)
