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

const MAX_CARDS_PER_DAY = 3;

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

function safeUrl(u) {
    return typeof u === "string" && /^https?:\/\//i.test(u) ? u : null;
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
            card.addEventListener("click", () => openConferenceModal(c));
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
        cell.appendChild(items);
        grid.appendChild(cell);
    }
    root.appendChild(grid);
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
        li.addEventListener("click", () => openConferenceModal(c));
        list.appendChild(li);
    }
}

function render() {
    document.getElementById("conf-month-label").textContent = formatMonthLabel(state.currentMonth);
    const filtered = applyFilters(state.conferences);
    const emptyEl = document.getElementById("conf-empty");
    emptyEl.hidden = filtered.length !== 0;
    if (state.conferences.length === 0) {
        emptyEl.textContent = "No conference data yet.";
    } else {
        emptyEl.textContent = "No conferences match the current filters.";
    }
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
    for (const el of document.querySelectorAll("#conf-modal [data-close]")) {
        el.addEventListener("click", closeModal);
    }
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeModal();
    });
    document.getElementById("conf-region").addEventListener("change", (e) => {
        state.region = e.target.value;
        render();
    });
    document.getElementById("conf-topic").addEventListener("change", (e) => {
        state.topic = e.target.value;
        render();
    });
}

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
        link.addEventListener("click", () => {
            closeModal();
            openConferenceModal(c);
        });
        li.appendChild(link);
        list.appendChild(li);
    }
    container.appendChild(list);
    openModal(container);
}

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

    const safeConfUrl = safeUrl(c.url);
    if (safeConfUrl) {
        const a = document.createElement("a");
        a.href = safeConfUrl;
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
            const safeSrc = safeUrl(s.url);
            if (!safeSrc) continue;
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = safeSrc;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = s.note || safeSrc;
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

async function init() {
    await load();
    populateFilters();
    wireControls();
    render();
}

init();
