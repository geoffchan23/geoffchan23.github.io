## Summary
<one-line hook describing the joke or the situation>

## Script
Panel 1: <what happens in panel 1 — setting, action, dialogue>
Panel 2: <panel 2>

## Prompts
Panel 1: <full gpt-image-2 prompt, 80-150 words, ready to pass verbatim to the edits endpoint. Include setting, composition, characters, action, mood, lighting. Reference the attached style anchors ("in the style of the attached reference images"). Reference per-comic refs by filename where relevant ("use the pose from ref-01.png"). Include dialogue/text if any.>
Panel 2: <full gpt-image-2 prompt for panel 2>

## Style notes
- <any global directive: "watercolor wash", "heavy outlines", "no text in panels", aspect ratio preference>

## References
- Style anchors: auto-picked at generation time from `_art/` posts flagged with `comic_style_reference: true` (capped at 6 most recent)
- Per-comic: committed to `comics/references-draft/{{ISSUE_NUMBER}}/`
  - ref-01.png — <what this reference is, how the generator should use it>
  - ref-02.jpg — <description>

## Publish
<immediate | YYYY-MM-DD>
