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

function formatMonthLabel(date) {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

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

async function load() {
    const res = await fetch("/data/conferences.json", { cache: "no-store" });
    const data = await res.json();
    state.conferences = (data.conferences || []).slice().sort((a, b) => a.startDate.localeCompare(b.startDate));
}

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

async function init() {
    await load();
    wireControls();
    render();
}

init();
