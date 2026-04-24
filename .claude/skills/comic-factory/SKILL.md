---
name: comic-factory
description: Use when Geoff has a comic idea to develop into a posted comic. Iterate the script collaboratively, capture reference images, write gpt-image-2 prompts, then create a GitHub issue ready for the generator workflow. Triggers on phrases like "comic idea", "new comic", "comic factory", or direct invocation via /comic-factory.
---

# Comic Factory — Ideation

This skill guides a comic idea from raw blurt to a fully structured GitHub issue containing a canonical script, per-panel gpt-image-2 prompts, style notes, and committed reference images. The skill's output is the issue — not images. Image generation happens in Phase 2, post-issue creation, driven by the `comic:generate` label in the GitHub Actions pipeline.

## When to invoke

- User says "I have a comic idea", "new comic", or "comic factory"
- User directly invokes `/comic-factory`
- User starts describing a gag scenario they want drawn
- User drops a rough sketch or description and says "make this a comic"

## Inputs you work from

- Raw idea blurt from Geoff — whatever he says first, no matter how unpolished
- Optional reference images Geoff shares inline or via file paths in the conversation
- The `_art/` Jekyll collection — posts flagged `comic_style_reference: true` serve as style anchors for generation; scan them at the start of every session
- `docs/superpowers/specs/2026-04-24-comic-factory-design.md` — the full design spec; re-read if any step is unclear

## Your output

- A new GitHub issue titled `Comic: <slug>`, labeled `comic:draft`, with a structured body (see template below)
- Per-comic reference images committed to `comics/references-draft/<issue-number>/`
- Optionally: the label `comic:generate` added to kick off Phase 2 — ask Geoff before adding it

## Session flow

Work through these ten steps in order. Do not skip the dry-run confirm (step 8) or create the issue before refs are staged (step 9).

### Step 1 — Capture the blurt

Let Geoff talk. Capture everything. Then ask only the questions that are genuinely missing:

- How many panels? (1–6)
- What is the tone? (dry/absurdist/self-deprecating/technical/etc.)
- Is there a punchline, or is it more of a vignette?

Do not ask for prompts, style descriptions, or visual details yet — those come later.

### Step 2 — Iterate the script

Shape the idea into canonical panel format:

```
Panel N: [setting] — [action] — [dialogue/caption]
```

Propose a draft, explain any choices, and let Geoff approve. Offer at most two revision passes before asking if he wants to proceed anyway. Keep it tight — gag comics get funnier with economy. Trim panels before adding them.

### Step 3 — Surface style references

Scan the `_art/` collection for flagged posts:

```bash
grep -l "comic_style_reference: true" /Users/geoffreychan/Desktop/Work/geoffchan23.github.io/_art/*.md
```

Show Geoff the current list. If he wants different anchors, offer to flag a new art post in this same session (`comic_style_reference: true` in its front matter). The generator picks these up automatically at generation time — no need to copy files.

### Step 4 — Capture per-comic references

When Geoff shares images in the conversation (drags and drops, shares a path, or pastes a URL), save them to a session temp dir:

```bash
mkdir -p /tmp/comic-factory-<session-id>/
# copy each image with a descriptive sequential name: ref-01.png, ref-02.jpg, etc.
```

For each image, record a one-line description: what it shows and how the generator should use it (e.g., "ref-01.png — photo of Geoff's desk; use as setting reference for panel 2").

### Step 5 — Style notes

Collect any explicit visual directives from Geoff:

- Medium: "watercolor wash", "pen and ink", "flat digital"
- Line weight: "heavy outlines", "loose sketchy lines"
- Typography: "no text rendered in panels — use captions below", "speech bubbles ok"
- Aspect ratio preference: square, 4:3, 16:9 per panel, or a single tall strip
- Color palette constraints: "muted", "black and white", "one accent color"

If Geoff doesn't volunteer these, ask once: "Any style constraints, or should I infer from the flagged art posts?"

### Step 6 — Generate gpt-image-2 prompts

Write one prompt per panel. Each prompt must:

- Describe the panel fully: setting, composition, characters, action, mood, lighting
- Reference style anchors implicitly: "in the style of the attached reference images"
- Reference per-comic refs by filename if relevant: "use the pose from ref-01.png for the character on the left"
- Include any dialogue or text that should appear rendered in the image (gpt-image-2 handles text well)
- Land at roughly 80–150 words — enough to pin down composition without over-constraining the model

Do not use vague directives like "make it funny" or "good composition". Every detail should serve the image.

### Step 7 — Set target publish date

Ask: "Post immediately when approved, or schedule for a specific date?"

Record the answer as either `immediate` or `YYYY-MM-DD`. This goes in the `## Publish` block of the issue body.

### Step 8 — Dry-run confirm

Render the full issue body (all sections, using `{{ISSUE_NUMBER}}` as the placeholder) and show it to Geoff verbatim:

> "Here's what I'll create as the GitHub issue. Does this look right?"

Do not proceed until Geoff explicitly approves. If he requests changes, apply them and show the updated body again.

### Step 9 — Create the issue and commit references

Follow this exact sequence to handle the chicken-and-egg problem with the issue number:

1. Write the approved issue body to a tempfile, with `{{ISSUE_NUMBER}}` as a literal placeholder in the refs path.

2. Create the issue and capture the issue number:
   ```bash
   gh issue create \
     --title "Comic: <slug>" \
     --body-file <tempfile> \
     --label comic:draft
   # Capture the issue number N from the URL printed to stdout
   ```

3. Move refs from the session temp dir into the repo:
   ```bash
   mv /tmp/comic-factory-<session-id>/* comics/references-draft/<N>/
   ```
   (Create the target directory first if it does not exist: `mkdir -p comics/references-draft/<N>/`)

4. Substitute the placeholder in the tempfile:
   ```bash
   sed -i '' "s/{{ISSUE_NUMBER}}/<N>/g" <tempfile>
   ```
   (macOS syntax; Linux: `sed -i "s/..."`)

5. Update the issue body with the resolved paths:
   ```bash
   gh issue edit <N> --body-file <tempfile>
   ```

6. Stage and commit the reference images — explicit paths only, never `-A` or `.`:
   ```bash
   git add comics/references-draft/<N>/
   git commit -m "comics: add refs for issue #<N>"
   ```

7. Push:
   ```bash
   git push
   ```

### Step 10 — Hand-off

Tell Geoff:

> "Issue #N is live. To kick off generation, I can add the `comic:generate` label now, or you can do it from the issue page. Want me to add it?"

Default: wait for explicit yes. If yes:

```bash
gh issue edit <N> --add-label comic:generate
```

If no refs were shared during the session, skip steps 3–5 of the issue-creation sequence and omit the `## References` per-comic block from the issue body entirely.

---

## Issue body template

Use this template exactly. Replace placeholder values; do not add extra sections.

```markdown
## Summary
<one-line hook — the gag or premise in a sentence>

## Script
Panel 1: <setting> — <action> — <dialogue/caption>
Panel 2: <setting> — <action> — <dialogue/caption>
(add more panels as needed)

## Prompts
Panel 1: <full gpt-image-2 prompt, 80–150 words>
Panel 2: <full gpt-image-2 prompt, 80–150 words>
(one prompt per panel — count must match ## Script)

## Style notes
- <global style directive, e.g. "watercolor wash, heavy outlines">
- <typography directive, e.g. "render dialogue as speech bubbles inside panels">
- <aspect ratio, e.g. "each panel square (1:1)">

## References
- Style anchors: auto-picked at generation time from `_art/` posts flagged with `comic_style_reference: true`
- Per-comic: committed to `comics/references-draft/{{ISSUE_NUMBER}}/`
  - ref-01.png — <what this image shows and how the generator should use it>
  - ref-02.jpg — <description>

## Publish
<immediate | YYYY-MM-DD>
```

This template lives inline here so the skill is self-sufficient. A canonical copy will also be available at `.claude/skills/comic-factory/issue-template.md` once P4-2 is complete.

---

## Skill guardrails

These are hard rules. Do not work around them.

- **DO NOT** call gpt-image-2 yourself during the session. Generating images is Phase 2's job. The skill's output is an issue body with prompts, not images.
- **DO NOT** publish anything to `_comics/`. That is Phase 4's job after human approval in the GitHub issue.
- **DO NOT** stage `data/usage.json`. The smart-home agent owns it and overwrites it hourly. It must never appear in a commit from this skill.
- **DO NOT** use `git add -A` or `git add .`. Always stage by explicit file path.
- **DO NOT** skip the dry-run confirm in step 8. Geoff sees the full body before `gh issue create` runs.
- **DO NOT** create the issue before per-comic reference images are staged in the session tempdir (if any were shared).
- **DO NOT** proceed to issue creation if `## Prompts` has fewer entries than `## Script` has panels. Panel count must match exactly. Refuse and ask Geoff to resolve the mismatch.

---

## Anti-patterns

Things that should make you stop and reconsider:

- **"Should I regenerate this panel with a tweak?"** — No. Regeneration happens via `/regen` comments on the GitHub issue after Phase 2 has run. This skill ends at issue creation.
- **"The user uploaded a reference image — should I describe what I see?"** — Yes, but keep it short and factual. The description goes in the `## References` block so the generator knows how to use the image. Do not editorialize.
- **"Should I commit the generated comic's PNGs?"** — No. Phase 2 (GitHub Actions) does that inside the workflow. This skill only commits reference images to `comics/references-draft/`.
- **"The script is weak but Geoff seems happy — should I approve it anyway?"** — No. Offer one more revision pass with a specific suggestion before signing off.
- **"Should I pick a publish date for Geoff?"** — No. Ask. Never assume `immediate` unless Geoff says so.

---

## Resources

- Design spec: `docs/superpowers/specs/2026-04-24-comic-factory-design.md`
- Issue body template (canonical copy, created in P4-2): `.claude/skills/comic-factory/issue-template.md`
- Style reference scanner: `grep -l "comic_style_reference: true" _art/*.md`
