// UI audit: node audit.cjs <engine> <device|WxH> <prefix> <steps.json>
// Takes full-page screenshots and runs automated layout checks at every "shot".
const pw = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const root=require('path').resolve(__dirname,'../../..');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.json':'application/json'};
const CHECK = () => {
  const vw = document.documentElement.clientWidth, out = [];
  if (document.documentElement.scrollWidth > vw + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${vw}`);
  const vis = (el) => { const s = getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && +s.opacity > 0.05; };
  const name = (el) => el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0,2).join('.') : '');
  for (const el of document.querySelectorAll('#app *, .modal *, .unbox *')) {
    if (!vis(el) || el.closest('svg') || el.closest('.fx-canvas') || el.closest('.title-sky') || el.closest('.title-float') || el.closest('.ub-rays') || el.closest('.rays')) continue;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    if (r.right > vw + 2 || r.left < -2) out.push(`off-screen x: ${name(el)} [${Math.round(r.left)}..${Math.round(r.right)}]`);
    // clipped text inside fixed-size boxes
    const s = getComputedStyle(el);
    if ((s.overflow === 'hidden' || s.overflowX === 'hidden' || s.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 2 && el.textContent.trim() && !el.matches('.box-shop,.room-wrap,.ticket-rail,.rush,.d-prog,.mg-bar,.tk-bar,.star-bar,.bo-ready,.strip i,.title-screen,.stage,.unbox,.hub-stage,.fire-cover'))
      out.push(`text clipped: ${name(el)} "${el.textContent.trim().slice(0,30)}"`);
  }
  // content spilling outside its own box (buttons, rows, cards)
  for (const el of document.querySelectorAll('#app button, #app .row, #app .m-row, #app .miss, #app .q-card, #app .shop-item, #app .mini-card, #app .recipe, .modal button, .unbox button, #app .face')) {
    if (!vis(el)) continue;
    if (el.scrollWidth > el.clientWidth + 3) out.push(`spills sideways: ${name(el)} "${el.textContent.trim().slice(0,25)}"`);
    if (el.matches('.face') && el.scrollHeight > el.clientHeight + 3) out.push(`spills down: ${name(el)}`);
  }
  // overlapping cards/buttons that are siblings in a grid/flex (should never overlap)
  const groups = document.querySelectorAll('.bo-q, .drills, .extras, .hub-menu, .map-path, .opts, .bo-tiles, .shop-grid, .recipe-grid, .col-grid, .rv-secs, .tc-format, .bank, .fc-btns, .test-nav, .modal-actions, .chain-cards, .answer-area');
  for (const g of groups) { const kids = [...g.children].filter(vis); for (let i=0;i<kids.length;i++) for (let j=i+1;j<kids.length;j++) {
    const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
    const ox = Math.min(a.right,b.right)-Math.max(a.left,b.left), oy = Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
    if (ox > 4 && oy > 4) out.push(`overlap in ${name(g)}: ${name(kids[i])} & ${name(kids[j])}`); } }
  return [...new Set(out)].slice(0, 25);
};
(async()=>{
const srv=http.createServer((req,res)=>{let p=decodeURIComponent(req.url.split('?')[0]);if(p.endsWith('/'))p+='index.html';const f=path.join(root,p);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end();return;}res.writeHead(200,{'content-type':types[path.extname(f)]||'application/octet-stream'});res.end(d);});}).listen(0);
const port = srv.address().port;
const [,,engine,dev,prefix,stepsFile]=process.argv; const steps=JSON.parse(fs.readFileSync(stepsFile,'utf8'));
const b = await pw[engine].launch();
let ctxOpts;
if (/^\d+x\d+$/.test(dev)) { const [w,h]=dev.split('x').map(Number); ctxOpts={viewport:{width:w,height:h},hasTouch:true}; }
else { ctxOpts = {...pw.devices[dev]}; if (engine==='firefox') delete ctxOpts.isMobile; }
const ctx = await b.newContext(ctxOpts); const pg = await ctx.newPage();
const errs=[]; pg.on('pageerror',e=>errs.push(e.message)); pg.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
const report = {};
for (const s of steps) {
  if (s.goto) await pg.goto(`http://localhost:${port}`+s.goto);
  if (s.eval) { try { await pg.evaluate(s.eval); } catch(e){ errs.push('eval:'+e.message.split('\n')[0]); } }
  if (s.click) { try { await pg.click(s.click,{timeout:3000,force:true}); } catch(e){ errs.push('click '+s.click+': '+e.message.split('\n')[0]); } }
  if (s.wait) await pg.waitForTimeout(s.wait);
  if (s.shot) { await pg.screenshot({path:`${prefix}_${s.shot}.png`, fullPage: s.full !== false}); report[s.shot] = await pg.evaluate(CHECK); }
}
for (const [k,v] of Object.entries(report)) if (v.length) console.log(`[${k}]`, v.join(' | ')); 
console.log('errors:', JSON.stringify(errs)); await b.close(); srv.close();
})();
