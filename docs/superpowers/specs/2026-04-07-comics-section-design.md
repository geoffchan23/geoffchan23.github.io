# Comics Section Design Spec

## Overview

Replace the old Comic Factory (`/comics`) and Art Journey (`/artjourney`) with a new Instagram-style comics/art gallery at `/comics`. The section lets Geoff post his own art and comics with captions, displayed in a grid view and scrollable single-post feed.

## Cleanup

Remove all traces of the old sections:

- Delete `_artjourney/` directory
- Delete `artjourney/` directory
- Delete `comics/` directory (old Comic Factory pages, images, index)
- Delete `comic-styles.css`
- Delete `_layouts/comic.html`
- Delete `_layouts/artjourney.html`
- Remove `latest_comic` config from `_config.yml`
- Remove the `artjourney` collection and its defaults from `_config.yml`
- Remove any comic-related data files in `_data/`

## File Structure

```
_comics/
  README.md                          # Documentation for adding posts
  2026-04-07-my-first-comic.md       # Post markdown file
_layouts/
  comic.html                         # Single post layout
comics/
  index.html                         # Grid view page
  feed.xml                           # RSS feed
  images/
    2026-04-07-my-first-comic/       # Image folder per post
      01.png
      02.png
comics.css                           # Comics section styles
```

### Naming Conventions

- **Markdown files**: `YYYY-MM-DD-slug.md` where slug is a hyphenated short name
- **Image folders**: `comics/images/YYYY-MM-DD-slug/` — matches the markdown filename minus `.md`
- **Image files**: Numbered sequentially `01.png`, `02.png`, etc. Ordering determines carousel order.

### Post Front Matter Format

```yaml
---
title: My First Comic
date: 2026-04-07
images:
  - 01.png
  - 02.png
---
My thoughts about this comic go here in markdown...
```

- `title`: Required. Name of the post.
- `date`: Required. `YYYY-MM-DD` format.
- `images`: Required. List of image filenames. Paths are relative to `comics/images/YYYY-MM-DD-slug/`.
- Body content (below `---`): Optional. Your caption/thoughts rendered as markdown.

## Grid View (`/comics`)

The Instagram "profile page" — a responsive grid of square thumbnails.

- Each thumbnail uses the **first image** from the post, cropped to square via CSS `object-fit: cover`
- No text on the grid — images only
- Reverse chronological order
- 3 columns on desktop, 2 on mobile
- Clicking a thumbnail navigates to the individual post page
- No pagination in v1

## Single Post View (`/comics/post-slug/`)

The Instagram "post detail" page, designed around vertical phone photos (9:16 aspect ratio).

### Carousel

- If a post has multiple images, display one image at a time with left/right arrow buttons
- Dot indicators below the image showing current position
- No swipe support required in v1 — arrow buttons are sufficient
- If only one image, no carousel controls shown

### Image Display

- Max-width ~400px, centered
- 9:16 aspect ratio maintained (vertical phone photo format)
- Images are the focal point — minimal surrounding chrome

### Caption

- Date displayed near the image
- Markdown body content rendered below the image as the caption/thoughts
- If no body content, just show the image and date

### Scroll Feed

- Below the current post, previous posts render inline in reverse chronological order
- Each embedded post shows its image(s) (with carousel if multi-image), caption, and date
- Creates the Instagram-style infinite scroll feel
- All previous posts rendered in v1 (no lazy loading)

### Navigation

- Back link to the grid view at the top

## Styling

- Follows existing site conventions: Libre Baskerville font, `#f9f9f9` background, `#333` text, `5.5px` border-radius
- All comics styles in a separate `comics.css` file
- Minimal chrome — images are the focus
- Grid thumbnails have subtle hover effect
- Responsive: grid adjusts columns, image max-width adjusts for mobile

## Homepage Integration

Add a "Comics" link to the homepage — either in the nav or the Work section — so visitors can find it.

## RSS Feed

A `comics/feed.xml` file providing a standard RSS 2.0 feed:

- Each post is an `<item>` with title, date, link, description (caption text), and the first image as an enclosure
- Feed title: "Geoff Chan's Comics"
- Reverse chronological order

## Documentation

A `_comics/README.md` file with instructions clear enough for an AI agent to follow:

1. How to name the markdown file (`YYYY-MM-DD-slug.md`)
2. How to create and name the image folder (`comics/images/YYYY-MM-DD-slug/`)
3. How to name image files (`01.png`, `02.png`, etc.)
4. Required front matter fields and format
5. Where to write caption content
6. Complete example of creating a new post end-to-end
