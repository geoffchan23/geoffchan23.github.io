// /tokens page renderer.
// Fetches /data/usage.json, paints headline, draws main chart + brush navigator.

const ACCENT = "rgb(217, 119, 87)";
const ACCENT_FILL = "rgba(217, 119, 87, 0.15)";
const TEXT = "#333";
const TEXT_DIM = "rgba(51,51,51,0.5)";
const GRID = "rgba(0,0,0,0.08)";
const BRUSH_OUTSIDE = "rgba(249, 249, 249, 0.65)";

const PRESETS = [
    { id: "24h", label: "past 24h", ms: 24 * 60 * 60 * 1000 },
    { id: "48h", label: "past 48h", ms: 48 * 60 * 60 * 1000 },
    { id: "7d",  label: "past week",  ms: 7 * 24 * 60 * 60 * 1000 },
    { id: "30d", label: "past month", ms: 30 * 24 * 60 * 60 * 1000 },
];

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
            agg = { t: d.t, tokens: 0, byModel: {} };
            weeks.set(key, agg);
        }
        agg.tokens += d.tokens;
        for (const [m, n] of Object.entries(d.byModel)) {
            agg.byModel[m] = (agg.byModel[m] || 0) + n;
        }
    }
    return Array.from(weeks.values())
        .map(w => ({ t: w.t, tokens: w.tokens, byModel: w.byModel }))
        .sort((a, b) => a.t.localeCompare(b.t));
}

function bucketsForRange(data, startMs, endMs) {
    const gran = pickGranularity(startMs, endMs);
    let points;
    if (gran === "hourly") {
        points = data.hourly.filter(b => {
            const t = new Date(b.t).getTime();
            return t >= startMs && t <= endMs;
        }).map(b => ({ t: b.t, tokens: b.tokens, byModel: b.byModel }));
    } else if (gran === "daily") {
        points = data.daily.filter(b => {
            const t = new Date(b.t + "T00:00:00Z").getTime();
            return t >= startMs && t <= endMs;
        }).map(b => ({
            t: b.t + "T00:00:00Z",
            tokens: b.tokens,
            byModel: b.byModel,
        }));
    } else {
        const weekly = rollupDailyToWeekly(data.daily);
        points = weekly.filter(b => {
            const t = new Date(b.t + "T00:00:00Z").getTime();
            return t >= startMs && t <= endMs;
        }).map(b => ({
            t: b.t + "T00:00:00Z",
            tokens: b.tokens,
            byModel: b.byModel,
        }));
    }
    anchorLatestToNow(points, gran, endMs);
    return { granularity: gran, points };
}

// Pulls the last bucket's x to the right edge of the current window when the
// bucket represents the still-in-progress current period. Makes the chart line
// reach "now" instead of stopping at the last bucket's start timestamp, which
// is what makes the view feel real-time for the current preset.
function anchorLatestToNow(points, granularity, endMs) {
    if (!points.length) return;
    const now = Date.now();
    const tolerance = 60 * 1000; // 1 min
    if (endMs < now - tolerance) return; // not looking at "now"
    const target = Math.min(endMs, now);
    const last = points[points.length - 1];
    const lastT = new Date(last.t).getTime();
    if (lastT >= target) return;

    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;
    let bucketCoversNow = false;
    if (granularity === "hourly") {
        bucketCoversNow = now - lastT < hourMs;
    } else if (granularity === "daily") {
        bucketCoversNow = new Date(lastT).toISOString().slice(0, 10) === new Date(now).toISOString().slice(0, 10);
    } else if (granularity === "weekly") {
        bucketCoversNow = now - lastT < 7 * dayMs;
    }
    if (bucketCoversNow) {
        last.t = new Date(target).toISOString();
    }
}

function totalForRange(data, startMs, endMs) {
    const spanMs = endMs - startMs;
    const dayMs = 24 * 60 * 60 * 1000;
    // Hourly buckets give better precision for short windows. Beyond ~3 days,
    // daily buckets are both sufficient and what the brush/main chart already use.
    if (spanMs <= 3 * dayMs && data.hourly?.length) {
        return data.hourly.reduce((sum, b) => {
            const t = new Date(b.t).getTime();
            return t >= startMs && t <= endMs ? sum + b.tokens : sum;
        }, 0);
    }
    return (data.daily || []).reduce((sum, b) => {
        const t = new Date(b.t + "T00:00:00Z").getTime();
        return t >= startMs && t <= endMs ? sum + b.tokens : sum;
    }, 0);
}

function rangeForPreset(presetId) {
    const p = PRESETS.find(x => x.id === presetId);
    if (!p) return null;
    const endMs = Date.now();
    return { startMs: endMs - p.ms, endMs };
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
    const gran = ctx.tooltip.dataPoints[0].dataset.granularity || "daily";
    const timeLabel = formatTimestamp(point.x, gran);
    const modelLines = byModel.map(([id, n]) => {
        const pct = total > 0 ? Math.round((n / total) * 100) : 0;
        return `<div>${displayModel(id)} · ${pct}%</div>`;
    }).join("");
    tooltipEl.innerHTML = `
        <div class="tt-time">${timeLabel}</div>
        <div class="tt-total">${formatTokens(total)} tokens</div>
        ${modelLines ? `<div class="tt-section">${modelLines}</div>` : ""}
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

// --- Brush overlay plugin ---
// Draws the current main-chart window on top of the brush chart: a highlighted
// band for the selected range and a dim wash outside it. During an active drag,
// draws a live preview of the range being selected.

const brushOverlayPlugin = {
    id: "brushOverlay",
    afterDraw(chart) {
        const state = chart.$brushState;
        if (!state) return;
        const { ctx, chartArea, scales } = chart;
        const xScale = scales.x;
        const { top, bottom, left: areaLeft, right: areaRight } = chartArea;
        const clamp = (v) => Math.max(areaLeft, Math.min(areaRight, v));

        const winLeft = clamp(xScale.getPixelForValue(state.windowStart));
        const winRight = clamp(xScale.getPixelForValue(state.windowEnd));

        ctx.save();
        ctx.fillStyle = BRUSH_OUTSIDE;
        if (winLeft > areaLeft) ctx.fillRect(areaLeft, top, winLeft - areaLeft, bottom - top);
        if (winRight < areaRight) ctx.fillRect(winRight, top, areaRight - winRight, bottom - top);
        ctx.strokeStyle = ACCENT;
        ctx.lineWidth = 1;
        ctx.strokeRect(winLeft + 0.5, top + 0.5, Math.max(1, winRight - winLeft - 1), bottom - top - 1);

        if (state.drag && state.drag.active) {
            const dragLeft = clamp(Math.min(state.drag.startX, state.drag.endX));
            const dragRight = clamp(Math.max(state.drag.startX, state.drag.endX));
            ctx.fillStyle = "rgba(217, 119, 87, 0.2)";
            ctx.fillRect(dragLeft, top, dragRight - dragLeft, bottom - top);
            ctx.strokeStyle = ACCENT;
            ctx.strokeRect(dragLeft + 0.5, top + 0.5, Math.max(1, dragRight - dragLeft - 1), bottom - top - 1);
        }
        ctx.restore();
    },
};

// --- Chart builders ---

function buildMainChart(canvas, data, initialStartMs, initialEndMs) {
    const { granularity, points } = bucketsForRange(data, initialStartMs, initialEndMs);
    const chart = new Chart(canvas, {
        type: "line",
        data: {
            datasets: [{
                label: "Tokens",
                data: points.map(p => ({ x: new Date(p.t).getTime(), y: p.tokens, meta: { byModel: p.byModel } })),
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
                    zoom: {
                        drag: { enabled: true, backgroundColor: "rgba(217,119,87,0.1)" },
                        mode: "x",
                        onZoomComplete: ({ chart }) => onChartRangeChange(chart, data),
                    },
                },
            },
        },
    });
    canvas.addEventListener("dblclick", () => {
        const select = document.getElementById("tokens-range");
        const preset = select && select.value !== "custom" ? select.value : "24h";
        if (chart.$applyPreset) {
            chart.$applyPreset(preset);
        } else {
            chart.resetZoom();
            onChartRangeChange(chart, data);
        }
    });
    return chart;
}

function applyChartRange(chart, data, startMs, endMs) {
    // Write to the root config so Chart.js keeps the range on subsequent updates.
    // Writing only to chart.scales.x.options.min/max (the scale instance's
    // merged view) is unreliable: the axis can revert on update while the
    // data is filtered to the new range, producing a wider-than-expected axis.
    chart.options.scales.x.min = startMs;
    chart.options.scales.x.max = endMs;
    const { granularity, points } = bucketsForRange(data, startMs, endMs);
    chart.data.datasets[0].data = points.map(p => ({ x: new Date(p.t).getTime(), y: p.tokens, meta: { byModel: p.byModel } }));
    chart.data.datasets[0].granularity = granularity;
    chart.update("none");
    syncBrushWindow(chart);
    updateHeadlineTotal(data, startMs, endMs);
}

function onChartRangeChange(chart, data) {
    const xScale = chart.scales.x;
    applyChartRange(chart, data, xScale.min, xScale.max);
    const selectEl = document.getElementById("tokens-range");
    if (selectEl) setCustomMode(selectEl, true);
}

function syncBrushWindow(mainChart) {
    const brushChart = mainChart.$brushChart;
    if (!brushChart || !brushChart.$brushState) return;
    brushChart.$brushState.windowStart = mainChart.scales.x.min;
    brushChart.$brushState.windowEnd = mainChart.scales.x.max;
    brushChart.draw();
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
            events: [],
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: {
                x: { type: "time", display: false },
                y: { display: false, beginAtZero: true },
            },
        },
        plugins: [brushOverlayPlugin],
    });
    chart.$brushState = {
        windowStart: mainChart.scales.x.min,
        windowEnd: mainChart.scales.x.max,
        drag: null,
    };
    attachBrushInteractions(canvas, chart, mainChart, data);
    return chart;
}

function attachBrushInteractions(canvas, brushChart, mainChart, data) {
    const DRAG_THRESHOLD = 4;
    let pressX = null;
    let isDragging = false;

    function pixelFromEvent(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? e.changedTouches?.[0]?.clientX;
        if (clientX == null) return null;
        return clientX - rect.left;
    }

    function clampToArea(x) {
        const area = brushChart.chartArea;
        return Math.max(area.left, Math.min(area.right, x));
    }

    function onDown(e) {
        const x = pixelFromEvent(e);
        if (x == null) return;
        pressX = clampToArea(x);
        isDragging = false;
        brushChart.$brushState.drag = { active: true, startX: pressX, endX: pressX };
        brushChart.draw();
        if (e.type === "touchstart") e.preventDefault();
    }

    function onMove(e) {
        if (pressX == null) return;
        const x = pixelFromEvent(e);
        if (x == null) return;
        const clamped = clampToArea(x);
        if (Math.abs(clamped - pressX) > DRAG_THRESHOLD) isDragging = true;
        brushChart.$brushState.drag = { active: true, startX: pressX, endX: clamped };
        brushChart.draw();
    }

    function onUp(e) {
        if (pressX == null) return;
        const x = pixelFromEvent(e);
        const endX = x == null ? pressX : clampToArea(x);
        const xScale = brushChart.scales.x;

        if (isDragging) {
            const leftPx = Math.min(pressX, endX);
            const rightPx = Math.max(pressX, endX);
            applyRange(mainChart, brushChart, data, xScale.getValueForPixel(leftPx), xScale.getValueForPixel(rightPx));
        } else {
            const clickedMs = xScale.getValueForPixel(pressX);
            const windowSize = mainChart.scales.x.max - mainChart.scales.x.min;
            applyRange(mainChart, brushChart, data, clickedMs - windowSize / 2, clickedMs + windowSize / 2);
        }

        pressX = null;
        isDragging = false;
        brushChart.$brushState.drag = null;
        brushChart.draw();
    }

    canvas.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);
    window.addEventListener("touchcancel", onUp);
}

function applyRange(mainChart, brushChart, data, startMs, endMs) {
    const brushScale = brushChart.scales.x;
    const fullSpan = brushScale.max - brushScale.min;
    const minWindow = Math.max(60_000, fullSpan * 0.01);
    let start = Math.max(brushScale.min, Math.min(startMs, endMs));
    let end = Math.min(brushScale.max, Math.max(startMs, endMs));
    if (end - start < minWindow) {
        const mid = (start + end) / 2;
        start = Math.max(brushScale.min, mid - minWindow / 2);
        end = Math.min(brushScale.max, mid + minWindow / 2);
    }
    applyChartRange(mainChart, data, start, end);
    const selectEl = document.getElementById("tokens-range");
    if (selectEl) setCustomMode(selectEl, true);
}

// --- Headline + meta renderers ---

function updateHeadlineTotal(data, startMs, endMs) {
    const bigEl = document.getElementById("tokens-big");
    bigEl.textContent = formatTokens(totalForRange(data, startMs, endMs));
    bigEl.dataset.state = "ready";
}

function renderMeta(data) {
    const metaEl = document.getElementById("tokens-meta");
    const updated = new Date(data.generatedAt);
    metaEl.textContent = "updated " + updated.toLocaleString("en-CA", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function setCustomMode(selectEl, on) {
    let opt = selectEl.querySelector('option[value="custom"]');
    if (on) {
        if (!opt) {
            opt = document.createElement("option");
            opt.value = "custom";
            opt.textContent = "custom";
            selectEl.prepend(opt);
        }
        selectEl.value = "custom";
    } else if (opt) {
        opt.remove();
    }
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
    renderMeta(data);

    if (!data.daily || data.daily.length === 0) {
        document.getElementById("tokens-hint").textContent = "no historical data yet";
        return;
    }

    const rangeSelect = document.getElementById("tokens-range");
    const initialPreset = "24h";
    const { startMs, endMs } = rangeForPreset(initialPreset);
    rangeSelect.value = initialPreset;
    updateHeadlineTotal(data, startMs, endMs);

    const mainCanvas = document.getElementById("tokens-chart");
    const brushCanvas = document.getElementById("tokens-brush");
    const mainChart = buildMainChart(mainCanvas, data, startMs, endMs);
    const brushChart = buildBrushChart(brushCanvas, data, mainChart);
    mainChart.$brushChart = brushChart;
    syncBrushWindow(mainChart);

    mainChart.$applyPreset = (presetId) => {
        const r = rangeForPreset(presetId);
        if (!r) return;
        applyChartRange(mainChart, data, r.startMs, r.endMs);
        setCustomMode(rangeSelect, false);
        rangeSelect.value = presetId;
    };

    rangeSelect.addEventListener("change", () => {
        if (rangeSelect.value === "custom") return;
        mainChart.$applyPreset(rangeSelect.value);
    });
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
