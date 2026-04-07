# Comics Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old Comic Factory and Art Journey with an Instagram-style comics gallery at `/comics`.

**Architecture:** Jekyll collection (`_comics`) with markdown posts and image folders. Two views: a grid index page and individual post pages with carousel support and scroll feed. Separate `comics.css` stylesheet. RSS feed via Liquid template.

**Tech Stack:** Jekyll (static site generator), HTML, CSS, vanilla JavaScript (carousel only)

**Spec:** `docs/superpowers/specs/2026-04-07-comics-section-design.md`

---

### Task 1: Cleanup old sections

**Files:**
- Delete: `_artjourney/` (entire directory)
- Delete: `artjourney/` (entire directory)
- Delete: `comics/` (entire directory — old Comic Factory)
- Delete: `comic-styles.css`
- Delete: `_layouts/comic.html`
- Delete: `_layouts/artjourney.html`
- Delete: `_data/comics.yml`
- Modify: `_config.yml`

- [ ] **Step 1: Delete old files and directories**

```bash
rm -rf _artjourney/
rm -rf artjourney/
rm -rf comics/
rm -f comic-styles.css
rm -f _layouts/comic.html
rm -f _layouts/artjourney.html
rm -f _data/comics.yml
```

- [ ] **Step 2: Clean up `_config.yml`**

Remove `latest_comic`, the `artjourney` collection, and the `artjourney` defaults. The file should become:

```yaml
title: Geoff Chan
description: Personal website of Geoffrey Chan
url: https://geoffchan23.github.io
baseurl: ""

# Build settings
markdown: kramdown
permalink: pretty
```

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Remove old Comic Factory and Art Journey sections"
```

---

### Task 2: Configure Jekyll collection and create directory structure

**Files:**
- Modify: `_config.yml`
- Create: `_comics/` directory
- Create: `comics/` directory
- Create: `comics/images/` directory

- [ ] **Step 1: Add comics collection to `_config.yml`**

Update `_config.yml` to:

```yaml
title: Geoff Chan
description: Personal website of Geoffrey Chan
url: https://geoffchan23.github.io
baseurl: ""

# Build settings
markdown: kramdown
permalink: pretty
collections:
  comics:
    output: true
    permalink: /comics/:title/

defaults:
  - scope:
      path: ""
      type: comics
    values:
      layout: comic
```

- [ ] **Step 2: Create directory structure**

```bash
mkdir -p _comics
mkdir -p comics/images
```

- [ ] **Step 3: Commit**

```bash
git add _config.yml
git commit -m "Add comics collection config and directory structure"
```

---

### Task 3: Create the comic post layout

**Files:**
- Create: `_layouts/comic.html`

- [ ] **Step 1: Create `_layouts/comic.html`**

This layout is for individual comic post pages. It includes the carousel, caption, and scroll feed of previous posts.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ page.title }} | Geoff Chan</title>
    <meta name="description" content="{{ page.content | strip_html | truncate: 160 }}">
    <meta property="og:title" content="{{ page.title }} | Geoff Chan">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ site.url }}{{ page.url }}">
    {% if page.images %}
    {% assign slug = page.path | replace: '.md', '' | split: '/' | last %}
    <meta property="og:image" content="{{ site.url }}/comics/images/{{ slug }}/{{ page.images.first }}">
    {% endif %}
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="alternate" type="application/rss+xml" title="Geoff Chan's Comics" href="/comics/feed.xml">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/reset.css">
    <link rel="stylesheet" href="/styles.css">
    <link rel="stylesheet" href="/comics.css">
</head>
<body>
    <div class="container comics-container">
        <header>
            <div>
                <a href="/comics"><h1>comics</h1></a>
                <span>by geoff chan</span>
            </div>
            <nav>
                <a href="/">Home</a>
                <a href="/comics">Grid</a>
            </nav>
        </header>

        <main>
            {% assign all_comics = site.comics | sort: 'date' | reverse %}

            {% for comic in all_comics %}
            {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
            <article class="comic-post" id="post-{{ slug }}">
                <div class="comic-carousel" data-post="{{ slug }}">
                    {% for image in comic.images %}
                    <div class="carousel-slide{% if forloop.first %} active{% endif %}">
                        <img src="/comics/images/{{ slug }}/{{ image }}" alt="{{ comic.title }}{% if comic.images.size > 1 %} - image {{ forloop.index }} of {{ comic.images.size }}{% endif %}" loading="lazy">
                    </div>
                    {% endfor %}

                    {% if comic.images.size > 1 %}
                    <button class="carousel-btn carousel-prev" aria-label="Previous image">&lsaquo;</button>
                    <button class="carousel-btn carousel-next" aria-label="Next image">&rsaquo;</button>
                    <div class="carousel-dots">
                        {% for image in comic.images %}
                        <span class="carousel-dot{% if forloop.first %} active{% endif %}" data-index="{{ forloop.index0 }}"></span>
                        {% endfor %}
                    </div>
                    {% endif %}
                </div>

                <div class="comic-caption">
                    <time class="comic-date" datetime="{{ comic.date | date: '%Y-%m-%d' }}">{{ comic.date | date: "%B %-d, %Y" }}</time>
                    {% if comic.content != "" %}
                    <div class="comic-text">{{ comic.content }}</div>
                    {% endif %}
                </div>
            </article>
            {% endfor %}
        </main>
    </div>

    <script>
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('.comic-carousel').forEach(function(carousel) {
            var slides = carousel.querySelectorAll('.carousel-slide');
            var dots = carousel.querySelectorAll('.carousel-dot');
            var prevBtn = carousel.querySelector('.carousel-prev');
            var nextBtn = carousel.querySelector('.carousel-next');
            var current = 0;

            function goTo(index) {
                slides[current].classList.remove('active');
                if (dots.length) dots[current].classList.remove('active');
                current = (index + slides.length) % slides.length;
                slides[current].classList.add('active');
                if (dots.length) dots[current].classList.add('active');
            }

            if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
            if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
            dots.forEach(function(dot) {
                dot.addEventListener('click', function() { goTo(parseInt(this.dataset.index)); });
            });
        });
    });
    </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add _layouts/comic.html
git commit -m "Add comic post layout with carousel and scroll feed"
```

---

### Task 4: Create the grid index page

**Files:**
- Create: `comics/index.html`

- [ ] **Step 1: Create `comics/index.html`**

```html
---
layout: default
title: Comics
---
<header>
    <div>
        <a href="/comics"><h1>comics</h1></a>
        <span>by geoff chan</span>
    </div>
    <nav>
        <a href="/">Home</a>
    </nav>
</header>
<main>
    <div class="comics-grid">
        {% assign all_comics = site.comics | sort: 'date' | reverse %}
        {% for comic in all_comics %}
        {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
        <a href="{{ comic.url }}" class="grid-item">
            <img src="/comics/images/{{ slug }}/{{ comic.images.first }}" alt="{{ comic.title }}" loading="lazy">
        </a>
        {% endfor %}
    </div>
</main>
```

Note: This uses the `default` layout (which provides the base HTML shell) and adds the comics-specific header inline. The `comics.css` stylesheet will need to be added to the `default` layout or linked here. Since the default layout doesn't include `comics.css`, we'll handle this in Task 6 by modifying the default layout to conditionally include it.

- [ ] **Step 2: Commit**

```bash
git add comics/index.html
git commit -m "Add comics grid index page"
```

---

### Task 5: Create comics stylesheet

**Files:**
- Create: `comics.css`

- [ ] **Step 1: Create `comics.css`**

```css
/* Comics Grid */
.comics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    margin-top: 1rem;
}

.grid-item {
    aspect-ratio: 1;
    overflow: hidden;
    border-radius: 3px;
}

.grid-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.2s;
}

.grid-item:hover img {
    opacity: 0.85;
}

/* Comics Container */
.comics-container {
    max-width: 600px;
}

/* Comic Post */
.comic-post {
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid #e0e0e0;
}

.comic-post:last-child {
    border-bottom: none;
}

/* Carousel */
.comic-carousel {
    position: relative;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
    aspect-ratio: 9 / 16;
    background-color: #f0f0f0;
    border-radius: 5.5px;
    overflow: hidden;
}

.carousel-slide {
    display: none;
    width: 100%;
    height: 100%;
}

.carousel-slide.active {
    display: block;
}

.carousel-slide img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.3);
    color: #fff;
    border: none;
    font-size: 2rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    border-radius: 50%;
    line-height: 1;
    transition: background 0.2s;
}

.carousel-btn:hover {
    background: rgba(0, 0, 0, 0.5);
}

.carousel-prev {
    left: 8px;
}

.carousel-next {
    right: 8px;
}

.carousel-dots {
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
}

.carousel-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: background 0.2s;
}

.carousel-dot.active {
    background: #fff;
}

/* Caption */
.comic-caption {
    max-width: 400px;
    margin: 1rem auto 0;
}

.comic-date {
    font-size: 0.75em;
    opacity: 0.5;
    display: block;
    margin-bottom: 0.5rem;
}

.comic-text {
    font-size: 0.85em;
    line-height: 1.6;
}

.comic-text p {
    margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 500px) {
    .comics-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .comic-carousel {
        max-width: 100%;
        border-radius: 0;
    }

    .comic-caption {
        max-width: 100%;
        padding: 0 0.5rem;
    }
}
```

- [ ] **Step 2: Commit**

```bash
git add comics.css
git commit -m "Add comics section stylesheet"
```

---

### Task 6: Link comics stylesheet in layouts

**Files:**
- Modify: `_layouts/default.html`

- [ ] **Step 1: Add conditional comics.css link to `_layouts/default.html`**

Add the comics stylesheet link in the `<head>`, after the existing stylesheets. Use a Liquid conditional so it only loads on pages that need it (the grid index page uses the default layout).

The current `_layouts/default.html` head section ends with:

```html
    <link rel="stylesheet" href="/reset.css">
    <link rel="stylesheet" href="/styles.css">
</head>
```

Change it to:

```html
    <link rel="stylesheet" href="/reset.css">
    <link rel="stylesheet" href="/styles.css">
    {% if page.url contains '/comics' %}
    <link rel="stylesheet" href="/comics.css">
    {% endif %}
</head>
```

- [ ] **Step 2: Commit**

```bash
git add _layouts/default.html
git commit -m "Conditionally load comics stylesheet in default layout"
```

---

### Task 7: Add homepage link

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add Comics to the Work section**

In `index.html`, the Work section `<ul>` currently starts with a commented-out comics link. Replace the old commented-out line and add a new entry at the top of the list:

Replace:

```html
            <!-- <li><a href="/comics">Daily AI Comic</a> <span class="tag">ai comic</span> a daily generated comic inspired by The New Yorker</li> -->
```

With:

```html
            <li><a href="/comics">Comics</a> <span class="tag">art</span> my art and comics</li>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "Add comics link to homepage"
```

---

### Task 8: Create RSS feed

**Files:**
- Create: `comics/feed.xml`

- [ ] **Step 1: Create `comics/feed.xml`**

```xml
---
layout: null
---
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>Geoff Chan's Comics</title>
        <description>Art and comics by Geoff Chan</description>
        <link>{{ site.url }}/comics</link>
        <atom:link href="{{ site.url }}/comics/feed.xml" rel="self" type="application/rss+xml"/>
        <lastBuildDate>{{ site.time | date_to_rfc822 }}</lastBuildDate>
        {% assign all_comics = site.comics | sort: 'date' | reverse %}
        {% for comic in all_comics %}
        {% assign slug = comic.path | replace: '.md', '' | split: '/' | last %}
        <item>
            <title>{{ comic.title | xml_escape }}</title>
            <link>{{ site.url }}{{ comic.url }}</link>
            <guid isPermaLink="true">{{ site.url }}{{ comic.url }}</guid>
            <pubDate>{{ comic.date | date_to_rfc822 }}</pubDate>
            {% if comic.content != "" %}
            <description>{{ comic.content | strip_html | xml_escape | truncate: 500 }}</description>
            {% endif %}
            {% if comic.images %}
            <enclosure url="{{ site.url }}/comics/images/{{ slug }}/{{ comic.images.first }}" type="image/png"/>
            {% endif %}
        </item>
        {% endfor %}
    </channel>
</rss>
```

- [ ] **Step 2: Commit**

```bash
git add comics/feed.xml
git commit -m "Add RSS feed for comics"
```

---

### Task 9: Create sample post and documentation

**Files:**
- Create: `_comics/README.md`
- Create: `_comics/2026-04-07-first-post.md`
- Create: `comics/images/2026-04-07-first-post/01.png` (placeholder)

- [ ] **Step 1: Create `_comics/README.md`**

```markdown
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
```

- [ ] **Step 2: Create a sample post `_comics/2026-04-07-first-post.md`**

```yaml
---
title: First Post
date: 2026-04-07
images:
  - 01.png
---
Hello! This is the first post on my comics page.
```

- [ ] **Step 3: Create a placeholder image**

Create `comics/images/2026-04-07-first-post/` directory and add a simple placeholder image (any 1080x1920 PNG or a smaller test image). This is just for testing the layout — it will be replaced with a real image.

```bash
mkdir -p comics/images/2026-04-07-first-post
# Copy or create a test image as 01.png in that folder
```

- [ ] **Step 4: Commit**

```bash
git add _comics/README.md _comics/2026-04-07-first-post.md comics/images/
git commit -m "Add comics README documentation and sample post"
```

---

### Task 10: Test locally

- [ ] **Step 1: Run Jekyll and verify**

```bash
jekyll serve
```

Open in browser and verify:
- `http://localhost:4000/comics` shows the grid with the sample post thumbnail
- Clicking the thumbnail goes to the post page
- Post page shows the image at 9:16 ratio with caption below
- RSS feed is accessible at `http://localhost:4000/comics/feed.xml`
- Homepage has a working "Comics" link
- No old Comic Factory or Art Journey content remains

- [ ] **Step 2: Fix any issues found during testing**

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "Fix issues found during local testing"
```
