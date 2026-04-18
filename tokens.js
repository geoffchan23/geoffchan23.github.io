// /tokens page renderer.
// Fetches /data/usage.json, paints headline, draws main chart + brush navigator.

const ACCENT = "rgb(217, 119, 87)";
const ACCENT_FILL = "rgba(217, 119, 87, 0.15)";
const TEXT = "#333";
const TEXT_DIM = "rgba(51,51,51,0.5)";
const GRID = "rgba(0,0,0,0.08)";

const MODEL_DISPLAY = {
    "claude-opus-4-7": "Opus 4.7",
    "claude-opus-4-6": "Opus 4.6",
    "claude-opus-4-5": "Opus 4.5",
    "claude-sonnet-4-6": "Sonnet 4.6",
    "claude-sonnet-4-5": "Sonnet 4.5",
    "claude-haiku-4-5": "Haiku 4.5",
};

function displayModel(id) {
    const norm = id.replace(/-\d{8}$/, "");
    return MODEL_DISPLAY[norm] || norm;
}

function formatTokens(n) {
    if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + "B";
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
}

function formatTimestamp(ts, granularity) {
    const d = new Date(ts);
    if (granularity === "hourly") {
        return d.toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString("en-CA", { month: "short", day: "numeric", year: "numeric" });
}

// --- Data transforms ---

function pickGranularity(startMs, endMs) {
    const days = (endMs - startMs) / (24 * 60 * 60 * 1000);
    if (days <= 2) return "hourly";
    if (days <= 90) return "daily";
    return "weekly";
}

function rollupDailyToWeekly(daily) {
    const weeks = new Map();
    for (const d of daily) {
        const date = new Date(d.t + "T00:00:00Z");
        const yr = date.getUTCFullYear();
        const onejan = new Date(Date.UTC(yr, 0, 1));
        const weekNum = Math.ceil((((date - onejan) / 86400000) + onejan.getUTCDay() + 1) / 7);
        const key = yr + "-W" + String(weekNum).padStart(2, "0");
        let agg = weeks.get(key);
        if (!agg) {
            agg = { t: d.t, tokens: 0, byModel: {}, byProjectMap: new Map() };
            weeks.set(key, agg);
        }
        agg.tokens += d.tokens;
        for (const [m, n] of Object.entries(d.byModel)) {
            agg.byModel[m] = (agg.byModel[m] || 0) + n;
        }
        for (const p of d.byProject) {
            agg.byProjectMap.set(p.name, (agg.byProjectMap.get(p.name) || 0) + p.tokens);
        }
    }
    return Array.from(weeks.values())
        .map(w => ({
            t: w.t,
            tokens: w.tokens,
            byModel: w.byModel,
            byProject: Array.from(w.byProjectMap.entries())
                .map(([name, tokens]) => ({ name, tokens }))
                .sort((a, b) => b.tokens - a.tokens),
        }))
        .sort((a, b) => a.t.localeCompare(b.t));
}

function bucketsForRange(data, startMs, endMs) {
    const gran = pickGranularity(startMs, endMs);
    if (gran === "hourly") {
        return {
            granularity: "hourly",
            points: data.hourly.filter(b => {
                const t = new Date(b.t).getTime();
                return t >= startMs && t <= endMs;
            }),
        };
    }
    if (gran === "daily") {
        return {
            granularity: "daily",
            points: data.daily.filter(b => {
                const t = new Date(b.t + "T00:00:00Z").getTime();
                return t >= startMs && t <= endMs;
            }).map(b => ({
                t: b.t + "T00:00:00Z",
                tokens: b.tokens,
                byModel: b.byModel,
                byProject: b.byProject,
            })),
        };
    }
    const weekly = rollupDailyToWeekly(data.daily);
    return {
        granularity: "weekly",
        points: weekly.filter(b => {
            const t = new Date(b.t + "T00:00:00Z").getTime();
            return t >= startMs && t <= endMs;
        }).map(b => ({
            t: b.t + "T00:00:00Z",
            tokens: b.tokens,
            byModel: b.byModel,
            byProject: b.byProject,
        })),
    };
}

// --- Tooltip renderer ---

function renderTooltip(ctx) {
    const tooltipEl = ensureTooltip();
    if (ctx.tooltip.opacity === 0) {
        tooltipEl.style.opacity = "0";
        return;
    }
    const point = ctx.tooltip.dataPoints[0]?.raw;
    if (!point) return;
    const total = point.y;
    const byModel = Object.entries(point.meta.byModel).sort(([, a], [, b]) => b - a).slice(0, 2);
    const byProject = point.meta.byProject.slice(0, 3);
    const gran = ctx.tooltip.dataPoints[0].dataset.granularity || "daily";
    const timeLabel = formatTimestamp(point.x, gran);
    const modelLines = byModel.map(([id, n]) => {
        const pct = total > 0 ? Math.round((n / total) * 100) : 0;
        return `<div>${displayModel(id)} · ${pct}%</div>`;
    }).join("");
    const projectLines = byProject.map(p => `<div>${p.name} · ${formatTokens(p.tokens)}</div>`).join("");
    tooltipEl.innerHTML = `
        <div class="tt-time">${timeLabel}</div>
        <div class="tt-total">${formatTokens(total)} tokens</div>
        ${modelLines ? `<div class="tt-section">${modelLines}</div>` : ""}
        ${projectLines ? `<div class="tt-section">${projectLines}</div>` : ""}
    `;
    const canvasRect = ctx.chart.canvas.getBoundingClientRect();
    tooltipEl.style.opacity = "1";
    tooltipEl.style.left = (canvasRect.left + window.scrollX + ctx.tooltip.caretX + 14) + "px";
    tooltipEl.style.top = (canvasRect.top + window.scrollY + ctx.tooltip.caretY - 20) + "px";
}

function ensureTooltip() {
    let el = document.getElementById("tokens-tt");
    if (el) return el;
    el = document.createElement("div");
    el.id = "tokens-tt";
    el.style.cssText = [
        "position:absolute",
        "pointer-events:none",
        "background:#fff",
        "border:1px solid rgba(0,0,0,0.08)",
        "padding:10px 12px",
        "border-radius:5px",
        "font-family:'JetBrains Mono', monospace",
        "font-size:11px",
        "color:#333",
        "box-shadow:0 2px 8px rgba(0,0,0,0.06)",
        "opacity:0",
        "transition:opacity 0.15s ease",
        "z-index:20",
        "white-space:nowrap",
    ].join(";");
    const style = document.createElement("style");
    style.textContent = `
        #tokens-tt .tt-time { opacity: 0.5; margin-bottom: 2px; }
        #tokens-tt .tt-total { font-size: 13px; font-weight: 500; margin-bottom: 6px; }
        #tokens-tt .tt-section { padding-top: 6px; margin-top: 6px; border-top: 1px solid rgba(0,0,0,0.06); }
    `;
    document.head.appendChild(style);
    document.body.appendChild(el);
    return el;
}

// --- Chart builders ---

function buildMainChart(canvas, data, initialStartMs, initialEndMs) {
    const { granularity, points } = bucketsForRange(data, initialStartMs, initialEndMs);
    const chart = new Chart(canvas, {
        type: "line",
        data: {
            datasets: [{
                label: "Tokens",
                data: points.map(p => ({ x: new Date(p.t).getTime(), y: p.tokens, meta: { byModel: p.byModel, byProject: p.byProject } })),
                borderColor: ACCENT,
                backgroundColor: ACCENT_FILL,
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                pointHoverRadius: 4,
                pointHoverBackgroundColor: ACCENT,
                granularity,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 400, easing: "easeOutCubic" },
            interaction: { mode: "nearest", axis: "x", intersect: false },
            scales: {
                x: {
                    type: "time",
                    min: initialStartMs,
                    max: initialEndMs,
                    grid: { color: GRID, drawOnChartArea: false },
                    ticks: { color: TEXT_DIM, font: { family: "JetBrains Mono", size: 10 } },
                    border: { display: false },
                },
                y: {
                    beginAtZero: true,
                    grid: { color: GRID },
                    ticks: {
                        color: TEXT_DIM,
                        font: { family: "JetBrains Mono", size: 10 },
                        callback: (v) => formatTokens(v),
                    },
                    border: { display: false },
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false, external: renderTooltip },
                zoom: {
                    zoom: { drag: { enabled: true, backgroundColor: "rgba(217,119,87,0.1)" }, mode: "x", onZoomComplete: ({ chart }) => onChartRangeChange(chart, data) },
                    pan: { enabled: true, mode: "x", onPanComplete: ({ chart }) => onChartRangeChange(chart, data) },
                },
            },
        },
    });
    canvas.addEventListener("dblclick", () => {
        chart.resetZoom();
        onChartRangeChange(chart, data);
    });
    return chart;
}

function onChartRangeChange(chart, data) {
    const xScale = chart.scales.x;
    const { granularity, points } = bucketsForRange(data, xScale.min, xScale.max);
    chart.data.datasets[0].data = points.map(p => ({ x: new Date(p.t).getTime(), y: p.tokens, meta: { byModel: p.byModel, byProject: p.byProject } }));
    chart.data.datasets[0].granularity = granularity;
    chart.update("none");
}

function buildBrushChart(canvas, data, mainChart) {
    const allDaily = data.daily.map(d => ({ x: new Date(d.t + "T00:00:00Z").getTime(), y: d.tokens }));
    const chart = new Chart(canvas, {
        type: "line",
        data: {
            datasets: [{
                data: allDaily,
                borderColor: ACCENT,
                backgroundColor: ACCENT_FILL,
                borderWidth: 1,
                fill: true,
                tension: 0.3,
                pointRadius: 0,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { type: "time", display: false },
                y: { display: false, beginAtZero: true },
            },
            onClick: (evt) => {
                const xScale = chart.scales.x;
                const clickX = evt.x - chart.chartArea.left;
                const frac = clickX / chart.chartArea.width;
                const clickedMs = xScale.min + (xScale.max - xScale.min) * frac;
                const currentWindow = mainChart.scales.x.max - mainChart.scales.x.min;
                mainChart.scales.x.options.min = clickedMs - currentWindow / 2;
                mainChart.scales.x.options.max = clickedMs + currentWindow / 2;
                mainChart.update("active");
                onChartRangeChange(mainChart, data);
            },
        },
    });
    return chart;
}

// --- Headline + meta renderers ---

function renderHeadline(data) {
    const bigEl = document.getElementById("tokens-big");
    const subEl = document.getElementById("tokens-sub");
    const metaEl = document.getElementById("tokens-meta");
    bigEl.textContent = formatTokens(data.last24h.totalTokens);
    bigEl.dataset.state = "ready";
    subEl.textContent = "past 24h · tokens";
    const updated = new Date(data.generatedAt);
    metaEl.textContent = "updated " + updated.toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

// --- Init ---

async function init() {
    const res = await fetch("/data/usage.json", { cache: "no-store" });
    if (!res.ok) {
        document.getElementById("tokens-big").textContent = "—";
        document.getElementById("tokens-sub").textContent = "usage data unavailable";
        return;
    }
    const data = await res.json();
    renderHeadline(data);

    if (!data.daily || data.daily.length === 0) {
        document.getElementById("tokens-hint").textContent = "no historical data yet";
        return;
    }

    const endMs = Date.now();
    const startMs = endMs - 30 * 24 * 60 * 60 * 1000;

    const mainCanvas = document.getElementById("tokens-chart");
    const brushCanvas = document.getElementById("tokens-brush");
    const mainChart = buildMainChart(mainCanvas, data, startMs, endMs);
    buildBrushChart(brushCanvas, data, mainChart);
}

init().catch((err) => {
    console.error("tokens init failed:", err);
    const bigEl = document.getElementById("tokens-big");
    // Only clobber the headline if it never rendered. If the headline is set,
    // the fetch succeeded and the error is in chart rendering — let the data stay.
    if (bigEl && bigEl.dataset.state === "loading") {
        bigEl.textContent = "—";
        document.getElementById("tokens-sub").textContent = "error loading usage";
    } else {
        document.getElementById("tokens-hint").textContent = "chart failed to render — data above is current";
    }
});
