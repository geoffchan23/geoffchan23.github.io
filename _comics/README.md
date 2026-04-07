# Comics - How to Add a New Post

This document explains how to add a new comic/art post. Follow these steps exactly.

## Step 1: Prepare your images

- Images should be vertical phone photos (9:16 aspect ratio, e.g. 1080x1920px)
- Supported formats: PNG, JPG, WEBP

## Step 2: Create the image folder

Create a folder in `comics/images/` named with the date and a short slug:

```
comics/images/YYYY-MM-DD-slug/
```

Example: `comics/images/2026-04-07-first-post/`

The slug should be lowercase, hyphen-separated, and briefly describe the post.

## Step 3: Add images to the folder

Name images sequentially: `01.png`, `02.png`, `03.png`, etc.

The number determines the carousel order. If there is only one image, name it `01.png`.

## Step 4: Create the markdown post file

Create a file in `_comics/` with the same date-slug name:

```
_comics/YYYY-MM-DD-slug.md
```

Example: `_comics/2026-04-07-first-post.md`

## Step 5: Write the front matter and content

```yaml
---
title: Your Post Title
date: YYYY-MM-DD
images:
  - 01.png
  - 02.png
---
Your optional thoughts/caption here in markdown.

You can use **bold**, *italic*, [links](https://example.com), etc.
Leave this section empty if you don't want a caption.
```

### Required fields

| Field    | Format                    | Description                                      |
|----------|---------------------------|--------------------------------------------------|
| `title`  | Any string                | Name of the post                                 |
| `date`   | `YYYY-MM-DD`              | Publication date                                 |
| `images` | List of filenames         | Image filenames in `comics/images/YYYY-MM-DD-slug/` |

### Body content

Everything below the second `---` is your caption/thoughts. It is rendered as markdown. This is optional — if omitted, the post displays only the image(s) and date.

## Complete Example

To create a post called "Coffee Sketch" on April 8, 2026 with two images:

1. Create folder: `comics/images/2026-04-08-coffee-sketch/`
2. Add images: `01.png`, `02.png`
3. Create file: `_comics/2026-04-08-coffee-sketch.md`
4. File contents:

```yaml
---
title: Coffee Sketch
date: 2026-04-08
images:
  - 01.png
  - 02.png
---
Quick sketch at the coffee shop this morning. Trying out a new pen.
```

5. Commit and push all files.

## Naming Convention Summary

| Item           | Pattern                        | Example                              |
|----------------|--------------------------------|--------------------------------------|
| Post file      | `_comics/YYYY-MM-DD-slug.md`  | `_comics/2026-04-07-first-post.md`   |
| Image folder   | `comics/images/YYYY-MM-DD-slug/` | `comics/images/2026-04-07-first-post/` |
| Image files    | `NN.ext`                       | `01.png`, `02.jpg`                   |
