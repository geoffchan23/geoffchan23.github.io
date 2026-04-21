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
