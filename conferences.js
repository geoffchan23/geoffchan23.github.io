// /conferences page renderer.
// Fetches /data/conferences.json and renders calendar + list views.

async function init() {
    const res = await fetch("/data/conferences.json", { cache: "no-store" });
    const data = await res.json();
    console.log("conferences loaded:", data.conferences.length);
}

init();
