/**
 * Hover reflow audit: does hovering one thing move anything else?
 *
 * WHY THIS EXISTS. The founder reported on 2026-09-29 that hovering a card made
 * its neighbours move and the text glitch. The cause was a transition that
 * included `border-width` and `padding` - layout properties. A transition on a
 * layout property re-runs layout on every frame, and because border-width snaps
 * to whole DEVICE pixels while padding does not, the two do not stay in step
 * mid-transition even when their endpoints are exactly compensated. The content
 * box changes width, the text can rewrap, the card's height changes, and the
 * whole grid row reflows.
 *
 * WHAT IT ASSERTS, and why these are the right invariants:
 *   - a PEER's top must never move. Nothing about hovering element A justifies
 *     moving element B. This is the founder's actual complaint, stated as a
 *     measurement.
 *   - the hovered element's own TEXT WIDTH must never change. A width change is
 *     the signature of a reflow inside the card, and it is what makes text
 *     rewrap and appear to glitch.
 * The hovered element's own top IS expected to move - that is the lift, and it
 * is a transform, which cannot affect layout.
 *
 * WHY IT DRIVES A REAL BROWSER. A synthetic `mouseover` does not trigger `:hover`
 * in CSS, and `.focus()` does not apply focus styles when the window lacks focus.
 * Both were tried and both produced a VACUOUS PASS against a build already known
 * to be broken. Only a trusted input event exercises the rule, so this dispatches
 * one through the DevTools Protocol.
 *
 * SELF-TEST. `--selftest` re-adds the offending properties to the transition at
 * runtime and re-runs. If that does not fail, the probe is not measuring what it
 * claims and the run aborts: a check that cannot fail is not evidence.
 *
 *   node scripts/hover-reflow-audit.mjs [--base http://localhost:3000] [--selftest]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = (process.argv.find(a => a.startsWith('--base=')) || '--base=http://localhost:3000').split('=').slice(1).join('=');
const SELFTEST = process.argv.includes('--selftest');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const PORT = 9315;

/** Every hoverable surface on the site, with a page that actually carries it. */
const TARGETS = [
  { path: '/engineering/custom-software-saas', sel: '.card' },
  { path: '/about-us', sel: '.card' },
  { path: '/insights', sel: '.card' },
  { path: '/ai-automation/services', sel: '.service-card' },
  { path: '/industries', sel: '.service-card' },
  { path: '/case-studies', sel: '.work-card' },
  { path: '/blockchain', sel: '.work-card' },
  { path: '/blog/where-ai-agents-should-work', sel: '.ins-card' },
  { path: '/blog/how-we-evaluate-ai-systems', sel: '.ins-card' },
  /* `.mini-card` is deliberately absent: it has a hover rule in globals.css and
     sits in ScrollReveal's selector list, but NO component renders it. Testing a
     class nothing uses would report a pass that means nothing. Reported instead. */
  { path: '/insights/archive', sel: '.arc-item' },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

let seq = 0;
function rpc(ws, method, params = {}) {
  const id = ++seq;
  return new Promise((resolve, reject) => {
    const onMsg = ev => {
      let m; try { m = JSON.parse(ev.data); } catch { return; }
      if (m.id !== id) return;
      ws.removeEventListener('message', onMsg);
      m.error ? reject(new Error(method + ': ' + m.error.message)) : resolve(m.result);
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
    setTimeout(() => { ws.removeEventListener('message', onMsg); reject(new Error(method + ' timed out')); }, 30000);
  });
}

const evaluate = async (ws, expression) => {
  const r = await rpc(ws, 'Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || ''));
  return r.result.value;
};

/* Armed before the pointer moves, so the very first frame of the transition is
   captured. A sampler installed afterwards measures only the tail. */
const ARM = (sel, idx) => `(() => {
  const els=[...document.querySelectorAll(${JSON.stringify(sel)})];
  const c=els[${idx}]; if(!c) return null;
  const t=c.querySelector('h3,h4,p,strong,span')||c.firstElementChild; if(!t) return null;
  const peers=els.filter((_,i)=>i!==${idx}).slice(0,3);
  window.__s=[];
  const snap=()=>({ms:Math.round(performance.now()-window.__t0),
    tw:+t.getBoundingClientRect().width.toFixed(3),
    peers:peers.map(p=>+p.getBoundingClientRect().top.toFixed(3))});
  c.addEventListener('mouseenter',()=>{
    window.__t0=performance.now();
    const tick=()=>{ window.__s.push(snap());
      if(performance.now()-window.__t0<520) requestAnimationFrame(tick); };
    tick(); requestAnimationFrame(tick);
  },{once:true});
  const b=c.getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2), y:Math.round(b.y+b.height/2),
          inView: b.top>4 && b.bottom<innerHeight-4, count:els.length};
})()`;

const READ = `(() => {
  const s=window.__s||[];
  if(s.length<8) return {frames:s.length, insufficient:true};
  const widths=[...new Set(s.map(x=>x.tw))];
  const peerSets=[...new Set(s.map(x=>JSON.stringify(x.peers)))];
  const peerDrift = s[0].peers.length
    ? +Math.max(...s[0].peers.map((_,i)=>
        Math.max(...s.map(x=>x.peers[i]))-Math.min(...s.map(x=>x.peers[i])))).toFixed(3)
    : 0;
  return {frames:s.length, widths, peerSets, peerCount:s[0].peers.length,
    widthDrift:+(Math.max(...s.map(x=>x.tw))-Math.min(...s.map(x=>x.tw))).toFixed(3),
    peerDrift};
})()`;

async function scrollIntoView(ws, sel, idx) {
  await evaluate(ws, `(() => { const e=document.querySelectorAll(${JSON.stringify(sel)})[${idx}];
    if(e) e.scrollIntoView({block:'center', behavior:'instant'}); return true; })()`);
  // Settle rather than guess: the page sets `scroll-behavior: smooth`, so a fixed
  // wait raced the scroll and reported elements as off-screen while still moving.
  let prev = null;
  for (let i = 0; i < 20; i++) {
    await sleep(100);
    const top = await evaluate(ws, `(() => { const e=document.querySelectorAll(${JSON.stringify(sel)})[${idx}];
      return e ? Math.round(e.getBoundingClientRect().top) : null; })()`);
    if (top !== null && top === prev) return;
    prev = top;
  }
}

async function probe(ws, { path, sel }, idx = 0) {
  await rpc(ws, 'Page.navigate', { url: BASE + path });
  await sleep(1600);
  // park the pointer away from anything hoverable, so the move is a real entry
  await rpc(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5, button: 'none' });
  await scrollIntoView(ws, sel, idx);
  const pos = await evaluate(ws, ARM(sel, idx));
  if (!pos) return { path, sel, status: 'ABSENT' };
  if (!pos.inView) return { path, sel, status: 'NOT-IN-VIEW' };
  await rpc(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos.x, y: pos.y, button: 'none' });
  await sleep(750);
  const r = await evaluate(ws, READ);
  if (r.insufficient) return { path, sel, status: 'NO-HOVER', frames: r.frames };
  const clean = r.widthDrift === 0 && r.peerDrift === 0;
  return { path, sel, status: clean ? 'CLEAN' : 'REFLOW', count: pos.count, ...r };
}

async function main() {
  const profile = mkdtempSync(join(tmpdir(), 'hover-audit-'));
  const edge = spawn(EDGE, ['--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`, '--window-size=1440,900',
    '--force-device-scale-factor=1', '--no-first-run', '--disable-gpu', 'about:blank'],
    { stdio: 'ignore' });

  let wsUrl = null;
  for (let i = 0; i < 40 && !wsUrl; i++) {
    await sleep(300);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      wsUrl = list.find(t => t.type === 'page')?.webSocketDebuggerUrl || null;
    } catch { /* not up yet */ }
  }
  if (!wsUrl) { edge.kill(); try { rmSync(profile, { recursive: true, force: true }); } catch {} throw new Error('Edge did not expose a debugger target'); }

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  await rpc(ws, 'Page.enable'); await rpc(ws, 'Runtime.enable');

  const results = [];
  for (const t of TARGETS) results.push(await probe(ws, t));

  let selftest = null;
  if (SELFTEST) {
    // Re-introduce the defect at runtime and demand the probe catches it.
    const t = TARGETS[0];
    await rpc(ws, 'Page.navigate', { url: BASE + t.path });
    await sleep(1600);
    await evaluate(ws, `(() => { const s=document.createElement('style');
      s.textContent='.card.card{transition:transform .4s ease,box-shadow .4s ease,border-color .2s ease,border-width .2s ease,padding .2s ease !important}';
      document.head.appendChild(s); return true; })()`);
    await rpc(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5, button: 'none' });
    await scrollIntoView(ws, t.sel, 0);
    const pos = await evaluate(ws, ARM(t.sel, 0));
    if (pos && pos.inView) {
      await rpc(ws, 'Input.dispatchMouseEvent', { type: 'mouseMoved', x: pos.x, y: pos.y, button: 'none' });
      await sleep(750);
      const r = await evaluate(ws, READ);
      selftest = r.insufficient ? { caught: false, reason: 'no hover frames' }
        : { caught: r.widthDrift > 0 || r.peerDrift > 0, widthDrift: r.widthDrift, peerDrift: r.peerDrift, frames: r.frames };
    } else selftest = { caught: false, reason: 'target not reachable' };
  }

  ws.close(); edge.kill();
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* Edge still holds it; a leftover temp profile must not fail an audit that ran */ }

  console.log('\nhover reflow audit  (base ' + BASE + ')\n');
  for (const r of results) {
    const head = `  ${r.status.padEnd(11)} ${r.sel.padEnd(14)} ${r.path}`;
    console.log(r.frames !== undefined && r.status !== 'NO-HOVER'
      ? `${head}   ${r.frames} frames, text width drift ${r.widthDrift}px, ` +
        (r.peerCount ? `peer drift ${r.peerDrift}px` : 'no peer on the page')
      : head + (r.frames !== undefined ? `   (${r.frames} frames)` : ''));
  }
  const reflow = results.filter(r => r.status === 'REFLOW');
  const measured = results.filter(r => r.status === 'CLEAN' || r.status === 'REFLOW');
  const unmeasured = results.filter(r => !['CLEAN', 'REFLOW'].includes(r.status));

  if (selftest) {
    console.log(`\n  self-test (defect re-injected): ${selftest.caught ? 'CAUGHT' : 'NOT CAUGHT'}` +
      (selftest.caught ? `  width drift ${selftest.widthDrift}px, peer drift ${selftest.peerDrift}px` : `  (${selftest.reason || 'no drift seen'})`));
    if (!selftest.caught) {
      console.log('\n  ABORT: the probe did not catch a deliberately reintroduced defect,');
      console.log('  so a clean result from it means nothing. Fix the probe before trusting it.\n');
      process.exit(2);
    }
  }

  console.log(`\n  measured ${measured.length}/${results.length}` +
    (unmeasured.length ? `, not measured: ${unmeasured.map(r => r.sel + ' ' + r.path + ' (' + r.status + ')').join(', ')}` : ''));
  console.log(reflow.length ? `  ${reflow.length} SURFACE(S) REFLOW ON HOVER\n` : '  no hover moves a neighbour\n');
  process.exit(reflow.length ? 1 : 0);
}

main().catch(e => { console.error('hover audit failed:', e.message); process.exit(3); });
