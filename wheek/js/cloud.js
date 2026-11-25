/* Wheek World cloud backup: each player's save is one JSON file in a private GitHub repo.
   Every backup is a commit, so the repo history is a full timeline of past saves.
   The GitHub token is never in the code: a grown-up opens a setup link once per phone
   (#/setup/<player>/<token>) and it is kept in this phone's storage only. */
"use strict";
const CLOUD_KEY = "wheek-cloud-v1";
const CLOUD_REPO = "geoffchan23/wheek-saves";
function cloudCfg() { try { return JSON.parse(localStorage.getItem(CLOUD_KEY)); } catch { return null; } }
function cloudStore(c) { try { localStorage.setItem(CLOUD_KEY, JSON.stringify(c)); } catch {} }
const b64e = s => btoa(unescape(encodeURIComponent(s)));
const b64d = s => decodeURIComponent(escape(atob(s.replace(/\s/g, ""))));
async function ghApi(path, opts = {}) {
  const c = cloudCfg();
  return fetch("https://api.github.com/repos/" + CLOUD_REPO + path, Object.assign({ cache: "no-store" }, opts, {
    headers: Object.assign({ Authorization: "Bearer " + c.token, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" }, opts.body ? { "Content-Type": "application/json" } : {}),
  }));
}
const cloudPath = () => "/contents/saves/" + cloudCfg().player + ".json";
let cloudBusy = false;
async function cloudPush(force, minGap = 10 * MIN) {
  const c = cloudCfg(); if (!c || cloudBusy || !G) return false;
  if (!force && (c.last && now() - c.last < minGap)) return false;
  if (!force && c.lastSavedAt && c.lastSavedAt === G.savedAt) return false;
  cloudBusy = true;
  try {
    save();
    const msg = `${c.player}: level ${G.level}, ${G.coins} coins, ${G.guineas.length} guinea${G.guineas.length === 1 ? "" : "s"}`;
    const put = sha => ghApi(cloudPath(), { method: "PUT", body: JSON.stringify(Object.assign({ message: msg, content: b64e(JSON.stringify(G)) }, sha ? { sha } : {})) });
    let r = await put(c.sha);
    if (r.status === 409 || r.status === 422) {
      const g = await ghApi(cloudPath());
      c.sha = g.ok ? (await g.json()).sha : null;
      r = await put(c.sha);
    }
    if (r.ok) { const j = await r.json(); c.sha = j.content.sha; c.last = now(); c.lastSavedAt = G.savedAt; c.err = null; }
    else c.err = r.status === 401 || r.status === 403 ? "The backup key stopped working. Ask a grown-up to send a new setup link." : `Backup didn't work (error ${r.status}). Will try again.`;
  } catch (e) { c.err = "No internet right now. Will back up later."; }
  cloudStore(c); cloudBusy = false;
  return !c.err;
}
async function cloudHistory() {
  const c = cloudCfg();
  const r = await ghApi(`/commits?path=saves/${c.player}.json&per_page=40`);
  if (!r.ok) throw new Error("history " + r.status);
  return (await r.json()).map(x => ({ sha: x.sha, date: x.commit.committer.date, msg: x.commit.message }));
}
async function cloudFetch(ref) {
  const r = await ghApi(cloudPath() + (ref ? "?ref=" + ref : ""));
  if (r.status === 404) return null;
  if (!r.ok) throw new Error("fetch " + r.status);
  const j = await r.json();
  return { data: JSON.parse(b64d(j.content)), sha: j.sha };
}
function saveSummary(s) { return `Level ${s.level} · ${fmt(s.coins)} coins · ${s.guineas.length} guinea${s.guineas.length === 1 ? "" : "s"} (${s.guineas.slice(0, 3).map(g => g.name).join(", ")}${s.guineas.length > 3 ? "…" : ""})`; }
function useSave(data) {
  G = migrate(data); save();
  const c = cloudCfg(); if (c) { c.lastSavedAt = null; cloudStore(c); }
  location.hash = "#/home"; location.reload();
}

/* setup link: #/setup/<player>/<token> */
VIEWS.setup = (el, arg) => {
  const [player, token] = (arg || "").split("/");
  history.replaceState(null, "", "#/home");
  el.innerHTML = `<div class="pad center"><div class="big-emoji">☁️</div><h1 class="page-t">Connecting backup…</h1></div>`;
  if (!player || !token) { el.innerHTML = `<div class="pad center"><h1 class="page-t">That setup link looks broken</h1></div>`; return; }
  const name = player.toLowerCase().replace(/[^a-z0-9-]/g, "");
  const old = cloudCfg();
  cloudStore({ token, player: name, sha: old && old.player === name ? old.sha : null });
  (async () => {
    let remote = null;
    try { remote = await cloudFetch(); } catch (e) {
      el.innerHTML = `<div class="pad center"><div class="big-emoji">😬</div><h1 class="page-t">Couldn't reach the backup</h1><p class="muted">Check the internet and open the setup link again. (${esc(e.message)})</p><button class="btn green" onclick="go('home')">OK</button></div>`; return;
    }
    if (remote) {
      const c = cloudCfg(); c.sha = remote.sha; cloudStore(c);
      const m = openModal(`<div class="center"><div class="big-emoji">☁️</div><h2>Found ${esc(name)}'s cloud save!</h2>
        <div class="card note"><b>In the cloud:</b><br>${esc(saveSummary(remote.data))}<br><small class="muted">Saved ${new Date(remote.data.savedAt || 0).toLocaleString()}</small></div>
        <div class="card note"><b>On this phone:</b><br>${esc(saveSummary(G))}</div>
        <p class="mtext">Which game should this phone use?</p>
        <div class="mrow"><button class="btn green" data-cloud>Use the cloud save</button><button class="btn white" data-local>Keep this phone's game</button></div></div>`, { sticky: true, noClose: true });
      $("[data-cloud]", m.el).onclick = () => useSave(remote.data);
      $("[data-local]", m.el).onclick = async () => { m.close(); await cloudPush(true); toast("Backup is on! This phone's game is saved to the cloud.", "☁️"); go("home"); };
    } else {
      const ok = await cloudPush(true);
      toast(ok ? `Backup is on for ${name}!` : "Backup set up, but the first save didn't go through yet.", "☁️");
      go("home");
    }
  })();
};

function cloudSettingsHTML() {
  const c = cloudCfg();
  if (!c) return `<div class="card note"><b>☁️ Cloud backup is off</b><p>Ask a grown-up to send this phone the special setup link. Then your game is backed up automatically, even if the phone gets lost.</p></div>`;
  return `<div class="card note"><b>☁️ Cloud backup is ON</b><p>Player: <b>${esc(c.player)}</b><br>Last backup: <b>${c.last ? dur(now() - c.last) + " ago" : "not yet"}</b>${c.err ? `<br><span style="color:#c0203a">${esc(c.err)}</span>` : ""}</p>
    <div class="row-btns"><button class="btn small green" data-cloudnow>Back up now</button><button class="btn small white" data-cloudhist>Restore an older save</button></div></div>`;
}
function wireCloudSettings(el) {
  const n = $("[data-cloudnow]", el); if (n) n.onclick = async () => { n.disabled = true; n.textContent = "Backing up…"; const ok = await cloudPush(true); toast(ok ? "Backed up!" : (cloudCfg().err || "Didn't work"), ok ? "☁️" : "😬"); render(); };
  const h = $("[data-cloudhist]", el); if (h) h.onclick = async () => {
    const m = openModal(`<h2>Restore a save</h2><p class="muted center">Pick a time to go back to. Your current game gets backed up first, so you can always come back.</p><div id="histList" class="list"><p class="center">Loading…</p></div>`);
    try {
      const list = await cloudHistory();
      $("#histList", m.el).innerHTML = list.length ? list.map((x, i) => `<button class="row card hist" data-ref="${x.sha}"><div class="row-txt"><b>${new Date(x.date).toLocaleString([], { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</b><small>${esc(x.msg.replace(/^[^:]*:\s*/, ""))}</small></div><span class="btn small white">Use</span></button>`).join("") : `<p class="center muted">No backups yet.</p>`;
      $$("[data-ref]", m.el).forEach(b => b.onclick = async () => {
        if (!(await confirmBox("Go back to this save?", "Your game will switch to how it was at that time. (Today's game is backed up first.)", "Yes, restore", "Cancel"))) return;
        try { await cloudPush(true); const r = await cloudFetch(b.dataset.ref); useSave(r.data); } catch (e) { toast("Couldn't restore: " + e.message, "😬"); }
      });
    } catch (e) { $("#histList", m.el).innerHTML = `<p class="center muted">Couldn't load backups (${esc(e.message)}). Check the internet.</p>`; }
  };
}

/* automatic backups: on open, every few minutes while playing, and when the app is closed */
function startCloud() {
  try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch {}
  if (!cloudCfg()) return;
  setTimeout(() => cloudPush(false, 10 * MIN), 4000);
  setInterval(() => cloudPush(false, 10 * MIN), 2 * MIN);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cloudPush(false, 3 * MIN); });
  addEventListener("online", () => cloudPush(false, 3 * MIN));
}
