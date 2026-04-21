# Conference Calendar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/conferences` page on the Jekyll site that shows high-signal software engineering conferences on a monthly calendar, plus a skill that lets a Claude Code agent maintain the underlying JSON data.

**Architecture:** Static Jekyll page following the same pattern as `/tokens`: a committed `data/conferences.json`, a page-scoped HTML file at repo root, page-scoped CSS, and a vanilla-JS module that fetches the JSON and renders calendar + list views client-side. A Markdown skill in `.claude/skills/` documents how agents research, validate, and write entries.

**Tech Stack:** Jekyll (GitHub Pages), plain HTML/CSS/ES-module JS, no build step, no test framework. Verification is manual browser inspection.

**Testing approach:** This is a static site with no test runner. Each task's "test" step is a specific browser check: load `http://localhost:4000/conferences` with `jekyll serve` running in the background, reload, and verify the described behavior. Do not proceed to the next task if the browser check fails.

**Commit style:** Use `feat:` / `style:` / `docs:` / `chore:` prefixes for code commits. Use `data: …` for `data/conferences.json` changes (matches existing history).

---

## File Structure

| Path | Purpose |
| --- | --- |
| `data/conferences.json` | Source of truth for conference entries. Seeded manually first, then agent-maintained. |
| `conferences.html` | Jekyll page at `/conferences`, uses `default.html` layout. Markup skeleton only. |
| `conferences.css` | Page-scoped styles (controls, calendar grid, list, cards, modal). |
| `conferences.js` | ES module: loads JSON, manages view state, renders calendar and list, handles modal and filters. |
| `conferences/logos/` | Directory for optional per-conference logo files. |
| `_layouts/default.html` | Add conditional `<link>` for `conferences.css`. |
| `index.html` | Add `<li>` under Work pointing to `/conferences`. |
| `CLAUDE.md` | Add a `/conferences` section describing the page and its data file. |
| `.claude/skills/maintaining-conference-calendar/SKILL.md` | Skill that guides agents through research, validation, and updates. |

---

## Task 1: Seed `data/conferences.json` with hand-picked conferences

This seed lets us build and verify the page UI before the skill exists. We use real conferences so the page looks correct.

**Files:**
- Create: `data/conferences.json`

- [ ] **Step 1: Create the seed data file**

Write this exact content to `data/conferences.json`:

```json
{
  "generatedAt": "2026-04-21T17:00:00Z",
  "conferences": [
    {
      "id": "ai-engineer-worlds-fair-sf-2026",
      "series": "ai-engineer-worlds-fair",
      "name": "AI Engineer World's Fair",
      "edition": "SF (flagship)",
      "startDate": "2026-06-03",
      "endDate": "2026-06-05",
      "city": "San Francisco",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://ai.engineer",
      "topics": ["ai-engineering"],
      "logo": null,
      "signal": {
        "rating": "high",
        "summary": "Seed entry. Replace with agent-validated signal on first skill run.",
        "sources": [],
        "lastReviewed": "2026-04-21"
      },
      "source": "manual"
    },
    {
      "id": "kubecon-na-2026",
      "series": "kubecon",
      "name": "KubeCon + CloudNativeCon North America",
      "edition": "North America",
      "startDate": "2026-11-09",
      "endDate": "2026-11-12",
      "city": "Atlanta",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/",
      "topics": ["systems"],
      "logo": null,
      "signal": {
        "rating": "high",
        "summary": "Seed entry. Replace with agent-validated signal on first skill run.",
        "sources": [],
        "lastReviewed": "2026-04-21"
      },
      "source": "manual"
    },
    {
      "id": "ndc-toronto-2026",
      "series": "ndc",
      "name": "NDC Toronto",
      "edition": "Toronto",
      "startDate": "2026-10-26",
      "endDate": "2026-10-30",
      "city": "Toronto",
      "country": "Canada",
      "region": "north-america",
      "format": "in-person",
      "url": "https://ndctoronto.com/",
      "topics": ["general", "web"],
      "logo": null,
      "signal": {
        "rating": "high",
        "summary": "Seed entry. Replace with agent-validated signal on first skill run.",
        "sources": [],
        "lastReviewed": "2026-04-21"
      },
      "source": "manual"
    },
    {
      "id": "pycon-us-2026",
      "series": "pycon-us",
      "name": "PyCon US",
      "edition": "US",
      "startDate": "2026-05-13",
      "endDate": "2026-05-21",
      "city": "Long Beach",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://us.pycon.org/",
      "topics": ["languages"],
      "logo": null,
      "signal": {
        "rating": "high",
        "summary": "Seed entry. Replace with agent-validated signal on first skill run.",
        "sources": [],
        "lastReviewed": "2026-04-21"
      },
      "source": "manual"
    }
  ]
}
```

- [ ] **Step 2: Validate the JSON**

Run: `python3 -c "import json; json.load(open('data/conferences.json')); print('ok')"`
Expected output: `ok`

- [ ] **Step 3: Commit**

```bash
git add data/conferences.json
git commit -m "data: seed conference calendar with four launch entries"
```

---

## Task 2: Create page scaffold and wire up stylesheet

Create the HTML file, empty CSS and JS files, and add the conditional `<link>` in the default layout so `/conferences` loads its own stylesheet.

**Files:**
- Create: `conferences.html`
- Create: `conferences.css`
- Create: `conferences.js`
- Modify: `_layouts/default.html`

- [ ] **Step 1: Create `conferences.html`**

Write this exact content:

```html
---
layout: default
title: Geoff Chan | Conferences
---
<header>
    <div>
        <a href="/"><h1>geoff chan</h1></a>
        <span>ai product engineer + ex-founder</span>
    </div>
    <nav>
        <a href="/">About</a>
    </nav>
</header>
<main>
    <section class="conf-intro">
        <h2>Conferences</h2>
        <p>High-signal software engineering conferences with an AI engineering bias. Low noise, practitioner-validated.</p>
    </section>
    <section class="conf-controls">
        <div class="conf-view-toggle" role="tablist" aria-label="View mode">
            <button type="button" data-view="calendar" class="active" role="tab" aria-selected="true">Calendar</button>
            <button type="button" data-view="list" role="tab" aria-selected="false">List</button>
        </div>
        <div class="conf-month-nav" aria-label="Month navigation">
            <button type="button" class="conf-prev" aria-label="Previous month">←</button>
            <span class="conf-month-label" id="conf-month-label">—</span>
            <button type="button" class="conf-next" aria-label="Next month">→</button>
        </div>
        <div class="conf-filters">
            <label class="conf-filter">
                <span>Region</span>
                <select id="conf-region">
                    <option value="">All regions</option>
                </select>
            </label>
            <label class="conf-filter">
                <span>Topic</span>
                <select id="conf-topic">
                    <option value="">All topics</option>
                </select>
            </label>
        </div>
    </section>
    <section class="conf-view">
        <div class="conf-empty" id="conf-empty" hidden>No conferences to show.</div>
        <div class="conf-calendar" id="conf-calendar"></div>
        <ul class="conf-list" id="conf-list" hidden></ul>
    </section>
</main>
<div class="conf-modal" id="conf-modal" hidden>
    <div class="conf-modal-backdrop" data-close></div>
    <div class="conf-modal-content" role="dialog" aria-modal="true" aria-labelledby="conf-modal-title">
        <button type="button" class="conf-modal-close" aria-label="Close" data-close>×</button>
        <div class="conf-modal-body" id="conf-modal-body"></div>
    </div>
</div>
<script type="module" src="/conferences.js"></script>
```

- [ ] **Step 2: Create empty `conferences.css`**

Write this exact content:

```css
/* /conferences page styles. */
```

- [ ] **Step 3: Create stub `conferences.js`**

Write this exact content:

```js
// /conferences page renderer.
// Fetches /data/conferences.json and renders calendar + list views.

async function init() {
    const res = await fetch("/data/conferences.json", { cache: "no-store" });
    const data = await res.json();
    console.log("conferences loaded:", data.conferences.length);
}

init();
```

- [ ] **Step 4: Add the stylesheet link in `_layouts/default.html`**

Find this block:

```liquid
{% if page.url contains '/tokens' %}
<link rel="stylesheet" href="/tokens.css">
{% endif %}
```

Add directly below it:

```liquid
{% if page.url contains '/conferences' %}
<link rel="stylesheet" href="/conferences.css">
{% endif %}
```

- [ ] **Step 5: Start Jekyll and verify page loads**

In a separate terminal, run `jekyll serve` if not already running.

Open `http://localhost:4000/conferences` in a browser.

Expected:
- Page loads with the standard site header
- `Conferences` heading and intro paragraph visible
- Calendar/List toggle buttons visible (unstyled but present)
- Month nav buttons with `—` placeholder visible
- Region and Topic filter dropdowns visible
- Browser console logs: `conferences loaded: 4`

- [ ] **Step 6: Commit**

```bash
git add conferences.html conferences.css conferences.js _layouts/default.html
git commit -m "feat: scaffold /conferences page and stylesheet wiring"
```

---

## Task 3: Render a flat list view from the JSON

Implement the list view first because it's the simpler render path. At the end of this task, the list view displays all conferences; the calendar area is still empty.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Replace `conferences.js` with list-rendering implementation**

Write this exact content (complete file replacement):

```js
// /conferences page renderer.
// Fetches /data/conferences.json and renders calendar + list views.

const REGIONS = [
    { slug: "north-america", label: "North America" },
    { slug: "europe", label: "Europe" },
    { slug: "asia-pacific", label: "Asia-Pacific" },
    { slug: "latam", label: "LatAm" },
    { slug: "global-virtual", label: "Global / Virtual" },
];

const TOPICS = [
    { slug: "ai-engineering", label: "AI Engineering" },
    { slug: "ml-research", label: "ML Research" },
    { slug: "web", label: "Web" },
    { slug: "systems", label: "Systems" },
    { slug: "languages", label: "Languages" },
    { slug: "security", label: "Security" },
    { slug: "general", label: "General" },
];

const state = {
    view: "calendar",
    currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    region: "",
    topic: "",
    conferences: [],
};

function formatDateRange(startIso, endIso) {
    const start = new Date(startIso + "T00:00:00");
    const end = new Date(endIso + "T00:00:00");
    const fmtMonth = { month: "short" };
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    if (start.getTime() === end.getTime()) {
        return start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    if (sameMonth) {
        return `${start.toLocaleDateString("en-US", fmtMonth)} ${start.getDate()}–${end.getDate()}, ${end.getFullYear()}`;
    }
    const fmtShort = { month: "short", day: "numeric" };
    return `${start.toLocaleDateString("en-US", fmtShort)} – ${end.toLocaleDateString("en-US", fmtShort)}, ${end.getFullYear()}`;
}

function topicLabel(slug) {
    const t = TOPICS.find(x => x.slug === slug);
    return t ? t.label : slug;
}

function renderList(conferences) {
    const list = document.getElementById("conf-list");
    list.innerHTML = "";
    if (conferences.length === 0) {
        return;
    }
    for (const c of conferences) {
        const li = document.createElement("li");
        li.className = "conf-list-item";
        li.dataset.id = c.id;

        const logo = document.createElement("div");
        logo.className = "conf-logo";
        if (c.logo) {
            const img = document.createElement("img");
            img.src = "/conferences/" + c.logo;
            img.alt = "";
            logo.appendChild(img);
        } else {
            logo.textContent = c.name.slice(0, 1).toUpperCase();
            logo.classList.add("conf-logo-text");
        }

        const body = document.createElement("div");
        body.className = "conf-list-body";

        const name = document.createElement("div");
        name.className = "conf-list-name";
        name.textContent = c.edition && c.edition !== c.name ? `${c.name} — ${c.edition}` : c.name;

        const meta = document.createElement("div");
        meta.className = "conf-list-meta";
        meta.textContent = `${formatDateRange(c.startDate, c.endDate)} · ${c.city}, ${c.country}`;

        const tags = document.createElement("div");
        tags.className = "conf-list-tags";
        for (const slug of c.topics || []) {
            const tag = document.createElement("span");
            tag.className = "conf-tag";
            tag.textContent = topicLabel(slug);
            tags.appendChild(tag);
        }

        body.appendChild(name);
        body.appendChild(meta);
        body.appendChild(tags);
        li.appendChild(logo);
        li.appendChild(body);
        list.appendChild(li);
    }
}

function render() {
    document.getElementById("conf-empty").hidden = state.conferences.length !== 0;
    document.getElementById("conf-list").hidden = false;
    renderList(state.conferences);
}

async function load() {
    const res = await fetch("/data/conferences.json", { cache: "no-store" });
    const data = await res.json();
    state.conferences = (data.conferences || []).slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
}

async function init() {
    await load();
    render();
}

init();
```

- [ ] **Step 2: Add list styles to `conferences.css`**

Append to `conferences.css`:

```css
.conf-intro {
    margin-bottom: 1.5em;
}
.conf-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 1em;
    align-items: center;
    margin-bottom: 1.5em;
    font-size: .85em;
}
.conf-view-toggle {
    display: inline-flex;
    border: 1px solid #333;
    border-radius: 5.5px;
    overflow: hidden;
}
.conf-view-toggle button {
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    padding: .35em .75em;
    cursor: pointer;
    color: #333;
}
.conf-view-toggle button.active {
    background: #333;
    color: #f9f9f9;
}
.conf-month-nav {
    display: inline-flex;
    align-items: center;
    gap: .5em;
}
.conf-month-nav button {
    border: 1px solid #333;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    padding: .25em .6em;
    cursor: pointer;
    border-radius: 5.5px;
    color: #333;
}
.conf-month-label {
    min-width: 10em;
    text-align: center;
}
.conf-filters {
    display: inline-flex;
    gap: .75em;
}
.conf-filter {
    display: inline-flex;
    align-items: center;
    gap: .4em;
}
.conf-filter select {
    font-family: inherit;
    font-size: inherit;
    padding: .2em .4em;
    border: 1px solid #333;
    border-radius: 5.5px;
    background: #f9f9f9;
    color: #333;
}
.conf-empty {
    opacity: .6;
    padding: 2em 0;
    text-align: center;
}
.conf-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: .75em;
}
.conf-list-item {
    display: flex;
    gap: .75em;
    padding: .75em;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 5.5px;
    background: #fff;
    cursor: pointer;
}
.conf-list-item:hover {
    border-color: #333;
}
.conf-logo {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5.5px;
    background: rgb(217, 119, 87);
    color: #fff;
    font-weight: 700;
    overflow: hidden;
}
.conf-logo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.conf-list-body {
    display: flex;
    flex-direction: column;
    gap: .2em;
    min-width: 0;
}
.conf-list-name {
    font-weight: 700;
}
.conf-list-meta {
    font-size: .85em;
    opacity: .7;
}
.conf-list-tags {
    display: flex;
    gap: .4em;
    flex-wrap: wrap;
    margin-top: .2em;
}
.conf-tag {
    font-size: .75em;
    padding: .15em .5em;
    border-radius: 5.5px;
    background: rgba(217, 119, 87, 0.15);
    color: rgb(217, 119, 87);
}
```

- [ ] **Step 3: Browser check**

Reload `http://localhost:4000/conferences`.

Expected:
- The `conf-calendar` area is empty (we haven't implemented it yet)
- Below it, a list of all 4 seed conferences renders in order by start date (PyCon US first, AI Engineer second, NDC third, KubeCon last)
- Each row shows a circular-ish orange logo placeholder with the first letter of the name, the name + edition, dates, city, country, and topic tags

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: render conferences list view"
```

---

## Task 4: Add view toggle (Calendar / List)

Wire up the Calendar/List toggle buttons. For this task, the "Calendar" view simply shows a placeholder message; the real grid comes in Task 6. The point is to validate the toggle state flow.

**Files:**
- Modify: `conferences.js`

- [ ] **Step 1: Extend `conferences.js` with toggle logic**

Replace the `render()` function and `init()` function with:

```js
function render() {
    document.getElementById("conf-empty").hidden = state.conferences.length !== 0;
    const listEl = document.getElementById("conf-list");
    const calEl = document.getElementById("conf-calendar");
    listEl.hidden = state.view !== "list";
    calEl.hidden = state.view !== "calendar";
    if (state.view === "list") {
        renderList(state.conferences);
    } else {
        calEl.innerHTML = '<div class="conf-placeholder">calendar coming soon</div>';
    }
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        const isActive = btn.dataset.view === state.view;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    }
}

function wireControls() {
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        btn.addEventListener("click", () => {
            state.view = btn.dataset.view;
            render();
        });
    }
}

async function init() {
    await load();
    wireControls();
    render();
}

init();
```

- [ ] **Step 2: Add placeholder style to `conferences.css`**

Append:

```css
.conf-placeholder {
    padding: 2em;
    text-align: center;
    opacity: .5;
    border: 1px dashed rgba(0,0,0,0.2);
    border-radius: 5.5px;
}
```

- [ ] **Step 3: Browser check**

Reload the page.

Expected:
- Defaults to "Calendar" view: placeholder "calendar coming soon" renders; list is hidden
- Click "List": placeholder disappears, list of 4 conferences renders; `.active` moves to the List button
- Click "Calendar" again: back to placeholder

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: wire up calendar/list view toggle"
```

---

## Task 5: Month navigation state and label

Add prev/next month handling and a formatted month label. Does not yet render anything in the calendar body; that's Task 6.

**Files:**
- Modify: `conferences.js`

- [ ] **Step 1: Extend `conferences.js` with month navigation**

Add this helper near the other helpers:

```js
function formatMonthLabel(date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
```

Replace `wireControls` with:

```js
function wireControls() {
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        btn.addEventListener("click", () => {
            state.view = btn.dataset.view;
            render();
        });
    }
    document.querySelector(".conf-prev").addEventListener("click", () => {
        state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() - 1, 1);
        render();
    });
    document.querySelector(".conf-next").addEventListener("click", () => {
        state.currentMonth = new Date(state.currentMonth.getFullYear(), state.currentMonth.getMonth() + 1, 1);
        render();
    });
}
```

Update `render()` so it writes the month label at the top of each render pass. Add this as the first two lines inside `render()`:

```js
    document.getElementById("conf-month-label").textContent = formatMonthLabel(state.currentMonth);
```

So the full new `render()` reads:

```js
function render() {
    document.getElementById("conf-month-label").textContent = formatMonthLabel(state.currentMonth);
    document.getElementById("conf-empty").hidden = state.conferences.length !== 0;
    const listEl = document.getElementById("conf-list");
    const calEl = document.getElementById("conf-calendar");
    listEl.hidden = state.view !== "list";
    calEl.hidden = state.view !== "calendar";
    if (state.view === "list") {
        renderList(state.conferences);
    } else {
        calEl.innerHTML = '<div class="conf-placeholder">calendar coming soon</div>';
    }
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        const isActive = btn.dataset.view === state.view;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    }
}
```

- [ ] **Step 2: Browser check**

Reload the page.

Expected:
- Month label shows the current month and year (e.g., "April 2026")
- Clicking ← advances label to previous month
- Clicking → advances label to next month
- Labels stay consistent across multiple clicks

- [ ] **Step 3: Commit**

```bash
git add conferences.js
git commit -m "feat: add month navigation and label"
```

---

## Task 6: Render the calendar grid

Build the Sun–Sat month grid. For each day, find conferences active that day (any day within `[startDate, endDate]`) and render cards on it. This task renders cards with text only; logo polish comes in Task 7.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Add calendar render logic to `conferences.js`**

Add these helpers above `render()`:

```js
function isoDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function conferencesOnDay(confs, isoDay) {
    return confs.filter(c => c.startDate <= isoDay && isoDay <= c.endDate);
}

function buildMonthDays(anchor) {
    const year = anchor.getFullYear();
    const month = anchor.getMonth();
    const first = new Date(year, month, 1);
    const startWeekday = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startWeekday; i++) {
        const d = new Date(year, month, 1 - (startWeekday - i));
        cells.push({ date: d, inMonth: false });
    }
    for (let day = 1; day <= daysInMonth; day++) {
        cells.push({ date: new Date(year, month, day), inMonth: true });
    }
    while (cells.length % 7 !== 0) {
        const last = cells[cells.length - 1].date;
        const next = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
        cells.push({ date: next, inMonth: false });
    }
    return cells;
}

function renderCalendar(confs, anchor) {
    const root = document.getElementById("conf-calendar");
    root.innerHTML = "";

    const headerRow = document.createElement("div");
    headerRow.className = "conf-cal-header";
    for (const label of ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]) {
        const h = document.createElement("div");
        h.className = "conf-cal-header-cell";
        h.textContent = label;
        headerRow.appendChild(h);
    }
    root.appendChild(headerRow);

    const grid = document.createElement("div");
    grid.className = "conf-cal-grid";
    const today = isoDate(new Date());
    for (const { date, inMonth } of buildMonthDays(anchor)) {
        const iso = isoDate(date);
        const cell = document.createElement("div");
        cell.className = "conf-cal-cell";
        if (!inMonth) cell.classList.add("conf-cal-cell-outside");
        if (iso === today) cell.classList.add("conf-cal-cell-today");

        const num = document.createElement("div");
        num.className = "conf-cal-daynum";
        num.textContent = String(date.getDate());
        cell.appendChild(num);

        const items = document.createElement("div");
        items.className = "conf-cal-items";
        for (const c of conferencesOnDay(confs, iso)) {
            const card = document.createElement("div");
            card.className = "conf-card";
            card.dataset.id = c.id;
            card.innerHTML = `
                <div class="conf-card-name">${escapeHtml(c.name)}</div>
                <div class="conf-card-city">${escapeHtml(c.city)}</div>
            `;
            items.appendChild(card);
        }
        cell.appendChild(items);
        grid.appendChild(cell);
    }
    root.appendChild(grid);
}

function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
```

Replace the `render()` function's calendar branch. New `render()`:

```js
function render() {
    document.getElementById("conf-month-label").textContent = formatMonthLabel(state.currentMonth);
    document.getElementById("conf-empty").hidden = state.conferences.length !== 0;
    const listEl = document.getElementById("conf-list");
    const calEl = document.getElementById("conf-calendar");
    listEl.hidden = state.view !== "list";
    calEl.hidden = state.view !== "calendar";
    if (state.view === "list") {
        renderList(state.conferences);
    } else {
        renderCalendar(state.conferences, state.currentMonth);
    }
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        const isActive = btn.dataset.view === state.view;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    }
}
```

- [ ] **Step 2: Add calendar styles to `conferences.css`**

Append:

```css
.conf-cal-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
    font-size: .75em;
    opacity: .5;
    text-transform: uppercase;
    letter-spacing: .05em;
    margin-bottom: 4px;
}
.conf-cal-header-cell {
    padding: .25em .4em;
}
.conf-cal-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 4px;
}
.conf-cal-cell {
    min-height: 110px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.08);
    border-radius: 5.5px;
    padding: .35em .4em;
    display: flex;
    flex-direction: column;
    gap: .3em;
    overflow: hidden;
}
.conf-cal-cell-outside {
    background: transparent;
    opacity: .35;
}
.conf-cal-cell-today {
    border-color: rgb(217, 119, 87);
    box-shadow: 0 0 0 1px rgb(217, 119, 87);
}
.conf-cal-daynum {
    font-size: .75em;
    opacity: .6;
}
.conf-cal-items {
    display: flex;
    flex-direction: column;
    gap: 3px;
}
.conf-card {
    background: rgba(217, 119, 87, 0.12);
    border-radius: 4px;
    padding: .25em .35em;
    font-size: .75em;
    cursor: pointer;
    line-height: 1.2;
}
.conf-card:hover {
    background: rgba(217, 119, 87, 0.25);
}
.conf-card-name {
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.conf-card-city {
    opacity: .7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
```

- [ ] **Step 3: Browser check**

Reload. Use the month nav to navigate to **May 2026**, **June 2026**, **October 2026**, and **November 2026**.

Expected:
- May 2026: PyCon US card appears on May 13–21 (nine days)
- June 2026: AI Engineer cards on June 3, 4, 5
- October 2026: NDC Toronto cards on Oct 26–30 (five days)
- November 2026: KubeCon cards on Nov 9–12 (four days)
- Days outside the current month are rendered faint
- Today's cell (if within current view) has an orange border
- Each card shows name on top, city below, truncated with ellipsis if long

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: render monthly calendar grid with per-day cards"
```

---

## Task 7: Card polish — logo and tag

Extend each card to include a logo (or text fallback) and a topic tag. This uses the same logo-fallback pattern as the list view.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Update `renderCalendar` to build richer card markup**

Replace the inner card-building loop in `renderCalendar` (the block that creates `conf-card`) with:

```js
        for (const c of conferencesOnDay(confs, iso)) {
            const card = document.createElement("div");
            card.className = "conf-card";
            card.dataset.id = c.id;

            const logo = document.createElement("div");
            logo.className = "conf-card-logo";
            if (c.logo) {
                const img = document.createElement("img");
                img.src = "/conferences/" + c.logo;
                img.alt = "";
                logo.appendChild(img);
            } else {
                logo.classList.add("conf-card-logo-text");
                logo.textContent = c.name.slice(0, 1).toUpperCase();
            }

            const text = document.createElement("div");
            text.className = "conf-card-text";
            const nameEl = document.createElement("div");
            nameEl.className = "conf-card-name";
            nameEl.textContent = c.name;
            text.appendChild(nameEl);

            const cityEl = document.createElement("div");
            cityEl.className = "conf-card-city";
            cityEl.textContent = c.city;
            text.appendChild(cityEl);

            if (c.topics && c.topics.length > 0) {
                const tag = document.createElement("span");
                tag.className = "conf-card-tag";
                tag.textContent = topicLabel(c.topics[0]);
                text.appendChild(tag);
            }

            card.appendChild(logo);
            card.appendChild(text);
            items.appendChild(card);
        }
```

Remove the now-unused `escapeHtml` function (it was only used in the previous inline-HTML version). Delete this block from `conferences.js`:

```js
function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
```

- [ ] **Step 2: Update card styles in `conferences.css`**

Replace the existing `.conf-card` and `.conf-card-*` rules with:

```css
.conf-card {
    display: flex;
    gap: .35em;
    align-items: flex-start;
    background: rgba(217, 119, 87, 0.12);
    border-radius: 4px;
    padding: .3em .4em;
    font-size: .75em;
    cursor: pointer;
    line-height: 1.2;
}
.conf-card:hover {
    background: rgba(217, 119, 87, 0.25);
}
.conf-card-logo {
    width: 20px;
    height: 20px;
    flex: 0 0 20px;
    border-radius: 3px;
    background: rgb(217, 119, 87);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: .75em;
    overflow: hidden;
}
.conf-card-logo img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.conf-card-text {
    min-width: 0;
    flex: 1;
}
.conf-card-name {
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.conf-card-city {
    opacity: .7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.conf-card-tag {
    display: inline-block;
    margin-top: .15em;
    font-size: .85em;
    padding: 0 .3em;
    border-radius: 3px;
    background: rgba(217, 119, 87, 0.25);
    color: rgb(217, 119, 87);
}
```

- [ ] **Step 3: Browser check**

Reload. Navigate to months with conferences (May, June, Oct, Nov 2026).

Expected:
- Each calendar card now has a small orange logo box with the first letter, name, city, and a topic tag
- Cards still truncate cleanly
- List view unchanged

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: polish calendar cards with logo and topic tag"
```

---

## Task 8: Day overflow — "+N more" expands to a day modal

When a day has more than 3 conferences, render the first 3 and add a "+N more" chip that opens a modal listing all conferences active that day. For this task, the modal body only lists titles; the rich per-conference modal comes in Task 10.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Add overflow handling and modal plumbing to `conferences.js`**

Add this constant near the top of the file, below the `TOPICS` array:

```js
const MAX_CARDS_PER_DAY = 3;
```

Add these functions above `init()`:

```js
function openModal(contentEl) {
    const modal = document.getElementById("conf-modal");
    const body = document.getElementById("conf-modal-body");
    body.innerHTML = "";
    body.appendChild(contentEl);
    modal.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeModal() {
    document.getElementById("conf-modal").hidden = true;
    document.body.style.overflow = "";
}

function openDayModal(iso, confs) {
    const container = document.createElement("div");
    const title = document.createElement("h3");
    title.id = "conf-modal-title";
    title.textContent = new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
    });
    container.appendChild(title);
    const list = document.createElement("ul");
    list.className = "conf-modal-list";
    for (const c of confs) {
        const li = document.createElement("li");
        const link = document.createElement("button");
        link.type = "button";
        link.className = "conf-modal-link";
        link.textContent = c.edition && c.edition !== c.name ? `${c.name} — ${c.edition}` : c.name;
        li.appendChild(link);
        list.appendChild(li);
    }
    container.appendChild(list);
    openModal(container);
}
```

Update `wireControls()` to wire modal close affordances. Append inside `wireControls`:

```js
    for (const el of document.querySelectorAll("#conf-modal [data-close]")) {
        el.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
```

Update the calendar cell build loop so it only renders the first `MAX_CARDS_PER_DAY` cards and appends an overflow chip when needed. Replace the block inside `renderCalendar` that starts with `for (const c of conferencesOnDay(confs, iso)) {` and ends at `}` (after appending to `items`) with:

```js
        const dayConfs = conferencesOnDay(confs, iso);
        const visible = dayConfs.slice(0, MAX_CARDS_PER_DAY);
        const hidden = dayConfs.length - visible.length;
        for (const c of visible) {
            const card = document.createElement("div");
            card.className = "conf-card";
            card.dataset.id = c.id;

            const logo = document.createElement("div");
            logo.className = "conf-card-logo";
            if (c.logo) {
                const img = document.createElement("img");
                img.src = "/conferences/" + c.logo;
                img.alt = "";
                logo.appendChild(img);
            } else {
                logo.classList.add("conf-card-logo-text");
                logo.textContent = c.name.slice(0, 1).toUpperCase();
            }

            const text = document.createElement("div");
            text.className = "conf-card-text";
            const nameEl = document.createElement("div");
            nameEl.className = "conf-card-name";
            nameEl.textContent = c.name;
            text.appendChild(nameEl);

            const cityEl = document.createElement("div");
            cityEl.className = "conf-card-city";
            cityEl.textContent = c.city;
            text.appendChild(cityEl);

            if (c.topics && c.topics.length > 0) {
                const tag = document.createElement("span");
                tag.className = "conf-card-tag";
                tag.textContent = topicLabel(c.topics[0]);
                text.appendChild(tag);
            }

            card.appendChild(logo);
            card.appendChild(text);
            items.appendChild(card);
        }
        if (hidden > 0) {
            const more = document.createElement("button");
            more.type = "button";
            more.className = "conf-card-more";
            more.textContent = `+${hidden} more`;
            more.addEventListener("click", () => openDayModal(iso, dayConfs));
            items.appendChild(more);
        }
```

- [ ] **Step 2: Add modal and overflow styles to `conferences.css`**

Append:

```css
.conf-card-more {
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: .7em;
    color: rgb(217, 119, 87);
    cursor: pointer;
    text-align: left;
    padding: .2em .35em;
}
.conf-card-more:hover {
    text-decoration: underline;
}
.conf-modal {
    position: fixed;
    inset: 0;
    z-index: 1000;
}
.conf-modal-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.35);
}
.conf-modal-content {
    position: absolute;
    left: 50%;
    top: 10%;
    transform: translateX(-50%);
    width: min(560px, 90vw);
    max-height: 80vh;
    overflow: auto;
    background: #f9f9f9;
    border: 1px solid #333;
    border-radius: 5.5px;
    padding: 1.5em;
}
.conf-modal-close {
    position: absolute;
    top: .5em;
    right: .5em;
    border: 0;
    background: transparent;
    font-size: 1.5em;
    cursor: pointer;
    color: #333;
    line-height: 1;
    padding: .2em .4em;
}
.conf-modal-body h3 {
    margin-top: 0;
    margin-bottom: 1em;
}
.conf-modal-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: .5em;
}
.conf-modal-link {
    border: 0;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    color: #333;
    text-align: left;
    cursor: pointer;
    padding: .4em 0;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    width: 100%;
}
.conf-modal-link:hover {
    color: rgb(217, 119, 87);
}
```

- [ ] **Step 3: Browser check**

Temporarily add two extra conferences to the seed JSON to force overflow on May 14, 2026. Append to `conferences` array in `data/conferences.json` (before the closing `]`):

```json
    ,{
      "id": "test-overflow-1-2026",
      "series": "test",
      "name": "Test Overflow One",
      "edition": "",
      "startDate": "2026-05-14",
      "endDate": "2026-05-14",
      "city": "Test City",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://example.com",
      "topics": ["general"],
      "logo": null,
      "signal": { "rating": "high", "summary": "Test only.", "sources": [], "lastReviewed": "2026-04-21" },
      "source": "manual"
    },
    {
      "id": "test-overflow-2-2026",
      "series": "test",
      "name": "Test Overflow Two",
      "edition": "",
      "startDate": "2026-05-14",
      "endDate": "2026-05-14",
      "city": "Test City",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://example.com",
      "topics": ["general"],
      "logo": null,
      "signal": { "rating": "high", "summary": "Test only.", "sources": [], "lastReviewed": "2026-04-21" },
      "source": "manual"
    },
    {
      "id": "test-overflow-3-2026",
      "series": "test",
      "name": "Test Overflow Three",
      "edition": "",
      "startDate": "2026-05-14",
      "endDate": "2026-05-14",
      "city": "Test City",
      "country": "USA",
      "region": "north-america",
      "format": "in-person",
      "url": "https://example.com",
      "topics": ["general"],
      "logo": null,
      "signal": { "rating": "high", "summary": "Test only.", "sources": [], "lastReviewed": "2026-04-21" },
      "source": "manual"
    }
```

Reload, navigate to May 2026.

Expected:
- May 14 shows 3 cards plus a "+1 more" chip (PyCon US is active May 13–21, so four total conferences on May 14)
- Clicking "+1 more" opens a modal titled "Thursday, May 14, 2026" listing all four conferences
- Clicking the backdrop, the × button, or pressing Escape closes the modal

- [ ] **Step 4: Revert the test entries**

Remove the three `test-overflow-*` entries from `data/conferences.json`. The file should be back to the four original seed entries.

- [ ] **Step 5: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: add day overflow chip and day-detail modal"
```

---

## Task 9: Region and topic filters

Populate the filter dropdowns from the `REGIONS` and `TOPICS` constants and apply them to both views.

**Files:**
- Modify: `conferences.js`

- [ ] **Step 1: Add filter wiring**

Add this function above `init`:

```js
function populateFilters() {
    const regionSel = document.getElementById("conf-region");
    for (const r of REGIONS) {
        const opt = document.createElement("option");
        opt.value = r.slug;
        opt.textContent = r.label;
        regionSel.appendChild(opt);
    }
    const topicSel = document.getElementById("conf-topic");
    for (const t of TOPICS) {
        const opt = document.createElement("option");
        opt.value = t.slug;
        opt.textContent = t.label;
        topicSel.appendChild(opt);
    }
}

function applyFilters(all) {
    return all.filter(c => {
        if (state.region && c.region !== state.region) return false;
        if (state.topic && !(c.topics || []).includes(state.topic)) return false;
        return true;
    });
}
```

Update `wireControls` to append these handlers:

```js
    document.getElementById("conf-region").addEventListener("change", (e) => {
        state.region = e.target.value;
        render();
    });
    document.getElementById("conf-topic").addEventListener("change", (e) => {
        state.topic = e.target.value;
        render();
    });
```

Update `render()` to use `applyFilters`. Replace the body of the calendar/list branch so both views use a filtered list:

```js
function render() {
    document.getElementById("conf-month-label").textContent = formatMonthLabel(state.currentMonth);
    const filtered = applyFilters(state.conferences);
    document.getElementById("conf-empty").hidden = filtered.length !== 0;
    const listEl = document.getElementById("conf-list");
    const calEl = document.getElementById("conf-calendar");
    listEl.hidden = state.view !== "list";
    calEl.hidden = state.view !== "calendar";
    if (state.view === "list") {
        renderList(filtered);
    } else {
        renderCalendar(filtered, state.currentMonth);
    }
    for (const btn of document.querySelectorAll(".conf-view-toggle button")) {
        const isActive = btn.dataset.view === state.view;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-selected", isActive ? "true" : "false");
    }
}
```

Update `init` to call `populateFilters` before `render`:

```js
async function init() {
    await load();
    populateFilters();
    wireControls();
    render();
}
```

- [ ] **Step 2: Browser check**

Reload.

Expected:
- Region dropdown lists: All regions, North America, Europe, Asia-Pacific, LatAm, Global / Virtual
- Topic dropdown lists: All topics, AI Engineering, ML Research, Web, Systems, Languages, Security, General
- Selecting `Europe` under Region: calendar and list both empty (no European seed entries); empty state shows
- Reset region, select `AI Engineering` under Topic: only AI Engineer World's Fair remains (visible in June)
- Reset both, confirm all four conferences return

- [ ] **Step 3: Commit**

```bash
git add conferences.js
git commit -m "feat: filter conferences by region and topic"
```

---

## Task 10: Per-conference detail modal

When a calendar card, list row, or day-modal list item is clicked, open the full per-conference modal.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Add per-conference modal builder to `conferences.js`**

Add this function above `init` (after `openDayModal`):

```js
function openConferenceModal(c) {
    const el = document.createElement("div");

    const h = document.createElement("h3");
    h.id = "conf-modal-title";
    h.textContent = c.edition && c.edition !== c.name ? `${c.name} — ${c.edition}` : c.name;
    el.appendChild(h);

    const meta = document.createElement("div");
    meta.className = "conf-modal-meta";
    meta.innerHTML = "";
    const lines = [
        `${formatDateRange(c.startDate, c.endDate)}`,
        `${c.city}, ${c.country}`,
        `Format: ${c.format}`,
    ];
    for (const line of lines) {
        const p = document.createElement("div");
        p.textContent = line;
        meta.appendChild(p);
    }
    el.appendChild(meta);

    if (c.topics && c.topics.length > 0) {
        const tags = document.createElement("div");
        tags.className = "conf-list-tags";
        for (const slug of c.topics) {
            const tag = document.createElement("span");
            tag.className = "conf-tag";
            tag.textContent = topicLabel(slug);
            tags.appendChild(tag);
        }
        el.appendChild(tags);
    }

    if (c.url) {
        const a = document.createElement("a");
        a.href = c.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.className = "conf-modal-url";
        a.textContent = "Official site ↗";
        el.appendChild(a);
    }

    const sig = document.createElement("div");
    sig.className = "conf-modal-signal";
    const sigH = document.createElement("h4");
    sigH.textContent = `Signal: ${c.signal?.rating || "unrated"}`;
    sig.appendChild(sigH);
    if (c.signal?.summary) {
        const p = document.createElement("p");
        p.textContent = c.signal.summary;
        sig.appendChild(p);
    }
    if (c.signal?.sources && c.signal.sources.length > 0) {
        const ul = document.createElement("ul");
        ul.className = "conf-modal-sources";
        for (const s of c.signal.sources) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = s.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = s.note || s.url;
            li.appendChild(a);
            const typeSpan = document.createElement("span");
            typeSpan.className = "conf-modal-source-type";
            typeSpan.textContent = ` · ${s.type}`;
            li.appendChild(typeSpan);
            ul.appendChild(li);
        }
        sig.appendChild(ul);
    }
    if (c.signal?.lastReviewed) {
        const reviewed = document.createElement("div");
        reviewed.className = "conf-modal-reviewed";
        reviewed.textContent = `Last reviewed: ${c.signal.lastReviewed}`;
        sig.appendChild(reviewed);
    }
    el.appendChild(sig);

    openModal(el);
}
```

Wire clicks on calendar cards, list rows, and day-modal list items to `openConferenceModal`.

In `renderCalendar`, inside the visible-card loop, after `card.appendChild(text);`, add:

```js
            card.addEventListener("click", () => openConferenceModal(c));
```

In `renderList`, inside the loop, after `list.appendChild(li);` is set up (so after `li.appendChild(body);`, before `list.appendChild(li);`), add a click handler:

```js
        li.addEventListener("click", () => openConferenceModal(c));
```

In `openDayModal`, replace the `link.textContent = ...` block so that clicking a link opens the per-conference modal:

```js
        link.textContent = c.edition && c.edition !== c.name ? `${c.name} — ${c.edition}` : c.name;
        link.addEventListener("click", () => {
            closeModal();
            openConferenceModal(c);
        });
```

- [ ] **Step 2: Add per-conference modal styles to `conferences.css`**

Append:

```css
.conf-modal-meta {
    font-size: .9em;
    opacity: .75;
    margin-bottom: .75em;
    display: flex;
    flex-direction: column;
    gap: .15em;
}
.conf-modal-url {
    display: inline-block;
    margin-top: .5em;
    color: rgb(217, 119, 87);
}
.conf-modal-signal {
    margin-top: 1.5em;
    padding-top: 1em;
    border-top: 1px solid rgba(0,0,0,0.1);
}
.conf-modal-signal h4 {
    margin-top: 0;
    margin-bottom: .5em;
    font-size: 1em;
}
.conf-modal-sources {
    padding-left: 1.2em;
    margin: .5em 0;
    font-size: .9em;
}
.conf-modal-sources li {
    margin-bottom: .35em;
}
.conf-modal-source-type {
    opacity: .5;
    font-size: .85em;
}
.conf-modal-reviewed {
    font-size: .8em;
    opacity: .5;
    margin-top: .5em;
}
```

- [ ] **Step 3: Browser check**

Reload.

Expected:
- Click a calendar card (e.g. AI Engineer on June 3, 2026): modal opens with name, date range, city+country, format, topic tag, "Official site ↗" link, and a signal block showing rating `high`, summary text, "Last reviewed: 2026-04-21". The sources list does not render (seed entries have empty sources).
- Click a row in the list view: same modal appears
- Modal closes via ×, backdrop, or Escape

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: add per-conference detail modal"
```

---

## Task 11: Responsive — list view default on narrow viewports

Force list view under 640px.

**Files:**
- Modify: `conferences.js`
- Modify: `conferences.css`

- [ ] **Step 1: Add responsive default to `conferences.js`**

Above the existing `state` object, add a helper and change how `state.view` is initialized. Replace the `state` declaration with:

```js
function pickInitialView() {
    return window.matchMedia && window.matchMedia("(max-width: 640px)").matches ? "list" : "calendar";
}

const state = {
    view: pickInitialView(),
    currentMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    region: "",
    topic: "",
    conferences: [],
};
```

- [ ] **Step 2: Add media-query styling in `conferences.css`**

Append:

```css
@media (max-width: 640px) {
    .conf-controls {
        flex-direction: column;
        align-items: flex-start;
    }
    .conf-cal-cell {
        min-height: 70px;
    }
    .conf-cal-daynum {
        font-size: .7em;
    }
    .conf-card {
        font-size: .65em;
    }
    .conf-card-logo {
        width: 16px;
        height: 16px;
        flex-basis: 16px;
    }
}
```

- [ ] **Step 3: Browser check**

Reload. Use devtools to resize the viewport to 375px wide (iPhone).

Expected:
- Page defaults to the List view
- Filters and toggle stack vertically
- Switching to Calendar via the toggle still works and produces a small but legible grid

Resize back to desktop width and reload: Calendar is the default again.

- [ ] **Step 4: Commit**

```bash
git add conferences.js conferences.css
git commit -m "feat: default to list view on narrow viewports"
```

---

## Task 12: Empty and error states

Handle the case where `data/conferences.json` is missing, malformed, or empty.

**Files:**
- Modify: `conferences.js`

- [ ] **Step 1: Harden `load` and show friendly empty state**

Replace `load` with:

```js
async function load() {
    try {
        const res = await fetch("/data/conferences.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        state.conferences = (data.conferences || []).slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
    } catch (err) {
        console.error("Failed to load conferences:", err);
        state.conferences = [];
    }
}
```

Update the empty-state element to show a clearer message when there's truly no data versus when filters produced zero results. Replace the line in `render()`:

```js
    document.getElementById("conf-empty").hidden = filtered.length !== 0;
```

with:

```js
    const emptyEl = document.getElementById("conf-empty");
    emptyEl.hidden = filtered.length !== 0;
    if (state.conferences.length === 0) {
        emptyEl.textContent = "No conference data yet.";
    } else {
        emptyEl.textContent = "No conferences match the current filters.";
    }
```

- [ ] **Step 2: Browser check**

Temporarily rename `data/conferences.json` to `data/conferences.json.bak`:

```bash
mv data/conferences.json data/conferences.json.bak
```

Reload. Expected: Page still renders header, controls, calendar grid (empty cells), and shows "No conference data yet." above the list area. Console shows a load error.

Restore the file:

```bash
mv data/conferences.json.bak data/conferences.json
```

Reload. Set Region to `Europe` (no matches). Expected: "No conferences match the current filters." message.

Reset the filter.

- [ ] **Step 3: Commit**

```bash
git add conferences.js
git commit -m "feat: graceful empty and error states"
```

---

## Task 13: Link the page from the homepage

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add a Work list item for `/conferences`**

In `index.html`, find this line:

```html
            <li><a href="/tokens">Tokens</a> <span class="tag">meta</span> live Claude Code token usage</li>
```

Insert directly after it:

```html
            <li><a href="/conferences">Conferences</a> <span class="tag">meta</span> high-signal software engineering conferences, agent-maintained</li>
```

- [ ] **Step 2: Browser check**

Open `http://localhost:4000/`. Expected: A new "Conferences" row under Work, between Tokens and Art, linking to `/conferences`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: link conferences page from homepage Work list"
```

---

## Task 14: Update `CLAUDE.md` with a `/conferences` section

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Add the section**

In `CLAUDE.md`, find this line (end of the `/tokens Page` section):

```md
- If the agent is down, `data/usage.json` becomes stale but the page still renders the most recent snapshot.
```

Insert directly after it (blank line, then the new section):

```md

## /conferences Page (Agent-Maintained)

- `data/conferences.json` is maintained by the skill at `.claude/skills/maintaining-conference-calendar/SKILL.md`. A human can also hand-edit entries; mark those with `"source": "manual"`.
- Page lives at `conferences.html` (serves at `/conferences`). Styles in `conferences.css`. Renderer in `conferences.js`.
- Logos (optional) live under `conferences/logos/` and are referenced by relative path in each entry's `logo` field.
- Agent updates should be committed with `data: update conference calendar`.
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: document /conferences page in CLAUDE.md"
```

---

## Task 15: Write the maintenance skill

Create the skill that guides future Claude Code instances through researching, validating, and writing conference entries.

**Files:**
- Create: `.claude/skills/maintaining-conference-calendar/SKILL.md`

- [ ] **Step 1: Create the skill directory and file**

First, verify the parent path exists, then create the file. Run:

```bash
mkdir -p .claude/skills/maintaining-conference-calendar
```

Write this exact content to `.claude/skills/maintaining-conference-calendar/SKILL.md`:

````markdown
---
name: maintaining-conference-calendar
description: Research, validate, and write entries for the /conferences page. Use when asked to "update the conferences page", "add a conference", "refresh the calendar", or when auditing existing entries for stale dates or low signal.
---

# Maintaining the Conference Calendar

You maintain `data/conferences.json`, the source of truth for the `/conferences` page on geoffchan23.github.io. Your job is to keep entries current, high-signal, and honest. Low signal is worse than no entry.

## When to use this skill

- User asks to update, refresh, or audit the conferences page
- User asks to add a specific conference
- A scheduled run invokes this workflow
- You spot a conference in the data with dates in the past or a `lastReviewed` older than six months

## Inputs you work from

- `data/conferences.json` — current state. Read it before doing anything.
- `docs/superpowers/specs/2026-04-21-conference-calendar-design.md` — the design spec defines the data model, quality bar, and inclusion rules. Re-read if uncertain.
- Web search, for each candidate conference

## Output

- An updated `data/conferences.json`, sorted by `startDate`, with `generatedAt` set to now (UTC, ISO 8601)
- A commit with message `data: update conference calendar`

## Quality bar (strict)

A conference is eligible only if it meets **all** of these:

1. **Dates are announced.** No placeholder dates. If next edition is unannounced, skip.
2. **Practitioner-driven program.** Named engineers speaking, not only vendor staff or marketing.
3. **Independent positive signal.** At least two of:
    - A Reddit thread from a relevant subreddit with substantive positive discussion
    - A practitioner blog or write-up recapping a recent edition
    - LinkedIn or X/Twitter posts from named practitioners recommending it
4. **Not vendor-sales-driven.** Exclude events that are structurally pitch sessions or pay-to-speak.

Assign a rating:
- `high` — all three signal sources are strong
- `medium` — signal is present but niche; include with a note
- `low` — do not write the entry; explain the exclusion in the commit body

## Research workflow (per candidate)

1. **Web search** for the next edition: `"<conference name> <likely year>"`, look for the official site and dates.
2. **Reddit signal search:** query site:reddit.com with the conference name and the prior year. Useful subreddits include `r/ExperiencedDevs`, `r/programming`, `r/MachineLearning`, `r/LocalLLaMA`, `r/webdev`, `r/devops`, `r/reactjs`, `r/Python`. Look for threads with multiple upvoted comments, not a single promotional post.
3. **Blog / write-up search:** query `<conference> <year> recap` or `<conference> <year> thoughts` or `what I learned at <conference> <year>`. Prefer engineer-written posts on personal blogs over corporate marketing.
4. **Social signal:** search X/Twitter and LinkedIn for posts by named engineers recommending or reflecting on the event.
5. **Capture 2–5 source URLs** with a one-line note each. Do not inflate the count — fewer strong sources beats many weak ones.
6. **Write the entry** with fields per the schema below. Set `source: "agent"` and `signal.lastReviewed` to today.

## Data model

Each entry must have all of these fields:

```json
{
  "id": "<slug>-<year>",
  "series": "<slug shared across editions>",
  "name": "<official conference name>",
  "edition": "<city or distinguishing label, or empty string>",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "city": "<city>",
  "country": "<country>",
  "region": "north-america | europe | asia-pacific | latam | global-virtual",
  "format": "in-person | hybrid | virtual",
  "url": "<official site>",
  "topics": ["<one or more of: ai-engineering, ml-research, web, systems, languages, security, general>"],
  "logo": "logos/<slug>.svg | null",
  "signal": {
    "rating": "high | medium",
    "summary": "<one to two sentences on why it's worth including>",
    "sources": [
      { "type": "reddit | blog | linkedin | x | other", "url": "...", "note": "<one line>" }
    ],
    "lastReviewed": "YYYY-MM-DD"
  },
  "source": "agent"
}
```

## Multi-location series

Conferences like **AI Engineer World's Fair** run multiple editions per year (SF flagship, official NYC / London / Singapore, plus partner-run regionals). Each edition is its own entry with:

- A unique `id` that includes the city slug, e.g. `ai-engineer-worlds-fair-nyc-2026`
- A shared `series` value, e.g. `ai-engineer-worlds-fair`
- An `edition` label that distinguishes it, e.g. `"NYC"`, `"Community — Toronto"`

Official editions → `rating: "high"` is typical. Partner-run regionals require independent signal on top of the AI Engineer brand; be stricter.

## Exclusions (always skip)

- Vendor summits that are structurally product pitches (common pattern: single-vendor "AI Summit", full keynote lineup from the same company)
- Pay-to-speak conferences
- Virtual-only webinar series without a distinct practitioner community around them
- Trade shows where the tech track is a sidecar

## What NOT to overwrite

- Any entry with `"source": "manual"` — leave it alone unless the user explicitly asks for an update. A human put it there for a reason.
- An entry whose `lastReviewed` is within the last 30 days, unless you have new information.

## Writing back

1. Read `data/conferences.json` fully.
2. Make your changes to the in-memory JS/JSON object.
3. Sort `conferences` by `startDate` ascending.
4. Set `generatedAt` to the current UTC time in ISO 8601 (e.g. `2026-04-21T17:00:00Z`).
5. Write the file back with 2-space indentation.
6. Validate: `python3 -c "import json; json.load(open('data/conferences.json')); print('ok')"`.
7. Commit with message `data: update conference calendar`. In the commit body, list conferences added, updated, or excluded (with one-line reason for exclusions).

## When the list should shrink

If an included conference has become low-signal on re-review (declining discussion, departure of key organizers, quality complaints in recent threads), remove it. Note the removal and reason in the commit body. Growing the list is not a goal; calibration is.

## Final sanity check before committing

- Every `high` entry has at least two distinct non-vendor sources
- Every `startDate` / `endDate` is a real announced date, not a guess
- No duplicate `id`s
- Every `region`, `topic`, `format` uses the allowed slugs listed above
- `generatedAt` is updated
````

- [ ] **Step 2: Verify the skill directory listing**

Run: `ls .claude/skills/maintaining-conference-calendar/`
Expected: `SKILL.md`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/maintaining-conference-calendar/SKILL.md
git commit -m "feat: add skill for maintaining conference calendar"
```

---

## Task 16: Initial research pass — populate real data via the skill

Use the skill that was just written to produce a real first batch. This task differs from earlier tasks: instead of writing code, the agent researches and writes data.

**Files:**
- Modify: `data/conferences.json`

- [ ] **Step 1: Read the skill**

Read `.claude/skills/maintaining-conference-calendar/SKILL.md` in full and follow it.

- [ ] **Step 2: Build a candidate list**

Candidate conferences to research (non-exhaustive; drop low-signal, add others you validate):

- AI Engineer World's Fair — SF flagship
- AI Engineer — NYC
- AI Engineer — London
- AI Engineer — Singapore
- NeurIPS
- ICML
- KubeCon + CloudNativeCon — North America
- KubeCon + CloudNativeCon — Europe
- PyCon US
- React Conf
- QCon — one or two editions
- GOTO — one or two editions
- ConFoo (Montreal)
- NDC Toronto
- Web Summit Vancouver
- Strange Loop revival or successor events, if any

For each, execute the research workflow from the skill. Keep only conferences meeting the quality bar. Expect to drop some.

- [ ] **Step 3: Write the updated `data/conferences.json`**

Follow the skill's "Writing back" section. Do not remove the four existing seed entries unless your research concludes they should be excluded; if re-researched and kept, upgrade their `signal` block with real sources and set `source: "agent"` and `signal.lastReviewed` to today.

- [ ] **Step 4: Validate**

Run: `python3 -c "import json; json.load(open('data/conferences.json')); print('ok')"`
Expected: `ok`

- [ ] **Step 5: Browser check**

Reload `http://localhost:4000/conferences` and navigate through months that should now have entries (at minimum: next 12 months). Open a modal on any entry and confirm its signal block shows sources (an empty sources list means research didn't meet the bar).

- [ ] **Step 6: Commit**

```bash
git add data/conferences.json
git commit -m "$(cat <<'EOF'
data: update conference calendar

Initial agent-maintained population. Added/updated: <list names>.
Excluded: <names and one-line reasons>.
EOF
)"
```

Replace `<list names>` and `<names and one-line reasons>` with the actual results of the research pass.

---

## Self-Review

Run through these checks before handing the plan to the executor.

**Spec coverage:**
- Scope & quality bar → Task 15 (skill) codifies the quality bar; Task 16 applies it
- UX light theme → Task 2 (no dark styles), Task 3+ (matches existing palette)
- Calendar view with per-day cards on multi-day confs → Task 6–7
- List view with same modal → Task 3, Task 10
- Filters (region + topic) → Task 9
- Modal with signal sources → Task 10
- Mobile list default → Task 11
- Data model match → Task 1 seed and Task 15 skill both mirror the schema
- Logos with text fallback → Task 3 (list), Task 7 (calendar)
- Homepage link → Task 13
- CLAUDE.md section → Task 14
- Skill location → Task 15

**Placeholder scan:** no `TBD`, no "similar to", no "add appropriate X".

**Type consistency:** `state.view`, `state.currentMonth`, `state.region`, `state.topic`, `state.conferences` are defined consistently across tasks. Function names — `load`, `render`, `renderList`, `renderCalendar`, `openModal`, `openConferenceModal`, `openDayModal`, `closeModal`, `applyFilters`, `populateFilters`, `wireControls`, `pickInitialView`, `formatDateRange`, `formatMonthLabel`, `buildMonthDays`, `conferencesOnDay`, `isoDate`, `topicLabel` — referenced consistently. DOM IDs — `conf-month-label`, `conf-empty`, `conf-calendar`, `conf-list`, `conf-region`, `conf-topic`, `conf-modal`, `conf-modal-body` — referenced consistently.
