#!/usr/bin/env node
// Store Screenshot Studio CLI. Run from the project root.
//
//   node SKILL_DIR/scripts/studio.mjs init <screens-dir> [--ws store-screenshots] [--statusbar auto|clean|keep]
//   node store-screenshots/engine/studio.mjs doctor                           check Node, renderer, browser
//   node store-screenshots/engine/studio.mjs palette [--brand hex,hex]        brand colours → plan/palettes.png
//   node store-screenshots/engine/studio.mjs storyboard [plan/plan.json]      screens + copy → plan/storyboard.png
//   node store-screenshots/engine/studio.mjs round <n> [--from <round-dir>]   new versioned round folder
//   node store-screenshots/engine/studio.mjs render <round-dir | file.html>   → out/<name>/01..NN.png + previews
//   node store-screenshots/engine/studio.mjs final <round-dir/file.html> [--only iphone,ipad,android,tab,feature]
//   node store-screenshots/engine/studio.mjs check <dir | file.html>          copy lint (dashes) + PNG sizes
//   node store-screenshots/engine/studio.mjs props [--c hex] [--c2 hex] [--accent hex] [--prefix p-] [--only star,box]   3D prop pack
//   node store-screenshots/engine/studio.mjs model "<out>=<model>?<query>" …   one procedural 3D prop → assets/3d
//
// Add --open to init/palette/storyboard/render/final to pop the result open in the system image viewer.
// Slides are authored once at 1320x2868 (App Store 6.9"); `final` re-anchors them for every store size (layout.js).
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ENGINE = path.dirname(fileURLToPath(import.meta.url));
const [cmd, ...rest] = process.argv.slice(2);
const flags = {}, args = [];
const BOOL = new Set(['open']);   // flags without a value
for (let i = 0; i < rest.length; i++) {
  if (!rest[i].startsWith('--')) args.push(rest[i]);
  else if (BOOL.has(rest[i].slice(2))) flags[rest[i].slice(2)] = true;
  else flags[rest[i].slice(2)] = rest[++i];
}

const W0 = 1320, H0 = 2868;
const SIZES = {   // key → output folder, canvas
  iphone: ['iphone-6.9in_1320x2868', 1320, 2868], ipad: ['ipad-13in_2048x2732', 2048, 2732],
  android: ['android-phone_1080x1920', 1080, 1920], tab: ['android-tab-7in_1200x1920', 1200, 1920],
};
const ENGINE_FILES = ['shared.css', 'shared.js', 'layout.js', 'studio.mjs', 'models.html', 'models.mjs'];
const die = m => { console.error('✗ ' + m); process.exit(1); };
const wsOf = p => {   // the workspace this CLI copy lives in (store-screenshots/engine/studio.mjs), else search up from p
  if (fs.existsSync(path.join(ENGINE, '..', 'studio.json'))) return path.dirname(ENGINE);
  let d = path.resolve(p); while (d !== path.dirname(d)) { if (fs.existsSync(path.join(d, 'studio.json'))) return d; d = path.dirname(d); } die('no studio.json above ' + p + ' (run init first)'); };
const pngSize = f => { const b = fs.readFileSync(f); return [b.readUInt32BE(16), b.readUInt32BE(20)]; };
// --open: show a result in the system image viewer (nice for non-technical users); never fails the command
const openFile = f => { if (!flags.open) return;
  const c = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start ""' : 'xdg-open';
  try { execSync(`${c} "${f}"`, { stdio: 'ignore', shell: true }); } catch {} };

// ---------- colour ----------
const hx = h => { h = h.replace('#', ''); if (h.length === 3) h = [...h].map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255); };
const toHex = rgb => '#' + rgb.map(v => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0')).join('');
function rgb2hsl([r, g, b]) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1)), h = mx === r ? ((g - b) / d + 6) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function hsl2rgb(h, s, l) {
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}
const lumi = hex => { const f = c => c <= .03928 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; const [r, g, b] = hx(hex).map(f); return .2126 * r + .7152 * g + .0722 * b; };
const contrast = (a, b) => { const [x, y] = [lumi(a), lumi(b)].sort((p, q) => q - p); return (x + .05) / (y + .05); };
const hueOf = hex => rgb2hsl(hx(hex))[0];
const tone = (hex, s, l, dh = 0) => { const [h, S] = rgb2hsl(hx(hex)); return toHex(hsl2rgb((h + dh + 360) % 360, s ?? S, l)); };
const hueDist = (a, b) => { const d = Math.abs(hueOf(a) - hueOf(b)) % 360; return Math.min(d, 360 - d); };
const ACCENTS = { lime: '#d8ff3e', sun: '#ffe14d', pink: '#ff4fa3', cyan: '#41f0ff', tangerine: '#ff7a1a', peach: '#ffb27a', mint: '#7dffc4', lilac: '#c9b2ff', coral: '#ff6b5e' };
// the acid accent that pops hardest on this base while staying away from its hue (and from `avoid`)
const pickAccent = (base, avoid = []) => Object.values(ACCENTS)
  .map(a => [a, contrast(base, a) * (hueDist(a, base) >= 50 ? 1 : .45) * (avoid.some(v => hueDist(a, v) < 30) ? .6 : 1)])
  .sort((p, q) => q[1] - p[1])[0][0];
const textOn = (bg, dark) => contrast(bg, '#ffffff') >= contrast(bg, dark) ? '#ffffff' : dark;

// a spread of palettes around the brand colour: brand-led, contrasting, neutral, and two proven classics
function palettes(brands) {
  const brand = brands[0], second = brands.find((b, i) => i && hueDist(b, brand) > 40);
  const [, S, Lb] = rgb2hsl(hx(brand)), sat = Math.min(.88, Math.max(.6, S)), ink = tone(brand, .55, .1);
  const mk = (id, name, why, base, base2, glow, accent, onBase) => {
    onBase = onBase || textOn(base, ink);
    return { id, name, why, base, base2, glow, accent, onBase, onAccent: textOn(accent, ink), ink,
      contrast: +contrast(base, onBase).toFixed(1), pop: +contrast(base, accent).toFixed(1) };
  };
  // keep the exact brand colour where it already works as a base; only nudge it when it is too light or too dark
  const bold = Lb >= .16 && Lb <= .42 ? brand : tone(brand, sat, .33), vivid = Lb > .42 && Lb <= .62 ? brand : tone(brand, Math.max(sat, .72), .5);
  const comp = tone(brand, .72, .32, 180), mid = tone(brand, .38, .09);
  const muddy = h => h > 40 && h < 95, step = [70, -70, 100, -100].find(d => !muddy((hueOf(brand) + d + 360) % 360)) ?? 70;
  const neigh = tone(brand, .74, .34, step);
  const boldAccent = second && contrast(bold, second) >= 3 ? second : pickAccent(bold), flood = boldAccent;
  return [
    mk('brand-bold', 'Brand bold', second ? 'your two brand colours, as they are' : 'your colour, deep, with an acid accent', bold, tone(bold, sat, Math.max(.08, rgb2hsl(hx(bold))[2] - .1)), tone(brand, .9, .6), boldAccent),
    mk('brand-vivid', 'Brand vivid', 'your colour at full strength', vivid, tone(brand, sat, .41), tone(brand, .95, .7), pickAccent(vivid, [brand])),
    mk('accent-flood', 'Accent flood', 'the whole set on the accent, your colour as ink', flood, tone(flood, .9, .62), '#ffffff', bold, tone(brand, .7, .2)),
    mk('complement', 'Complement', 'opposite hue base, your colour as the pop', comp, tone(brand, .72, .22, 180), tone(brand, .9, .6, 180),
      contrast(comp, tone(brand, .95, .62)) >= 3 ? tone(brand, .95, .62) : pickAccent(comp)),
    mk('neighbour', 'Neighbour', 'a sibling hue, fresh but on-brand', neigh, tone(neigh, .74, .24), tone(neigh, .9, .62), pickAccent(neigh, [brand])),
    mk('midnight', 'Midnight', 'near-black tinted with your hue, glowing accent', mid, tone(brand, .4, .05), tone(brand, .8, .32),
      contrast(mid, tone(brand, .95, .62)) >= 4 ? tone(brand, .95, .62) : pickAccent(mid)),
    mk('paper', 'Paper', 'warm off-white, ink type, highlighter in your colour', '#f4f1ea', '#e9e3d6', '#ffffff',
      contrast(tone(brand, .95, .72), '#141414') >= 7 ? tone(brand, .95, .72) : '#ffe36b', '#141414'),
    mk('cobalt-lime', 'Cobalt × lime', 'electric classic (proven, brand-neutral)', '#1d4cf2', '#0e2fc4', '#7aa0ff', '#d8ff3e'),
    mk('tangerine-sun', 'Tangerine × sun', 'hot poster classic (brand-neutral)', '#ff5a1f', '#e2400a', '#ffa066', '#ffe14d', '#ffffff'),
  ];
}
const paletteCss = p => `:root{--base:${p.base};--base2:${p.base2};--glow:${p.glow};--accent:${p.accent};--on-base:${p.onBase};--on-accent:${p.onAccent};--ink:${p.ink}}`;

// ---------- browser ----------
let chromium;
function loadPlaywright(engineDir) {
  const req = createRequire(path.join(engineDir, 'package.json'));
  try { ({ chromium } = req('playwright-core')); } catch { die(`playwright-core missing in ${engineDir} (cd there and run: npm install)`); }
}
async function launch() {
  const args = ['--allow-file-access-from-files'];
  for (const channel of ['chrome', 'msedge', undefined]) {
    try { return await chromium.launch({ channel, args }); } catch {}
  }
  die('no Chromium-based browser found. Install Google Chrome, or run: npx playwright install chromium');
}
// 3D phones are many composited layers; one slide at a time + a warm-up capture keeps Chrome from dropping tiles
async function shoot(page, file) {
  await page.waitForTimeout(500);
  await page.screenshot();
  await page.waitForTimeout(200);
  await page.screenshot({ path: file });
}
async function sheet(browser, html, file, width) {
  const tmp = path.join(path.dirname(file), `_sheet_${Date.now()}.html`);
  fs.writeFileSync(tmp, html);
  const pg = await browser.newPage({ viewport: { width, height: 800 } });
  await pg.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
  await pg.screenshot({ path: file, fullPage: true });
  await pg.close();
  fs.unlinkSync(tmp);
}

// ---------- copy lint ----------
function lint(htmlFile) {
  const html = fs.readFileSync(htmlFile, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/gi, '');
  const text = html.replace(/<[^>]+>/g, ' ');
  const issues = [];
  for (const [re, what] of [[/—/g, 'em dash'], [/–/g, 'en dash'], [/\b(#1|No\.? ?1|best|world'?s leading|award[- ]winning|guaranteed)\b/gi, 'unverifiable claim'], [/\b(free|cheapest)\b/gi, 'price claim (check store rules)']]) {
    for (const m of text.matchAll(re)) issues.push(`${what}: "…${text.slice(Math.max(0, m.index - 30), m.index + 30).replace(/\s+/g, ' ').trim()}…"`);
  }
  // the highlighted word (.mark pill / .lt accent line) should never repeat across the set
  const seen = {};
  for (const m of html.matchAll(/<span class="(?:mark|lt)"[^>]*>([\s\S]*?)<\/span>/g))
    for (const w of m[1].replace(/<[^>]+>/g, ' ').toLowerCase().match(/[a-z0-9']{4,}/g) || []) (seen[w] = (seen[w] || 0) + 1);
  for (const [w, n] of Object.entries(seen)) if (n > 1) issues.push(`highlighted word repeats ${n}x: "${w}"`);
  return issues;
}

// ---------- commands ----------
const commands = {

  async init() {
    const src = args[0] && path.resolve(args[0]);
    if (!src || !fs.existsSync(src)) die('usage: init <screens-dir> [--ws store-screenshots]');
    const ws = path.resolve(flags.ws || 'store-screenshots'), eng = path.join(ws, 'engine'), skill = path.dirname(ENGINE);
    for (const d of ['engine', 'screens', 'assets/3d', 'assets/brand', 'rounds', 'final']) fs.mkdirSync(path.join(ws, d), { recursive: true });
    for (const f of ENGINE_FILES) fs.copyFileSync(path.join(ENGINE, f), path.join(eng, f));
    fs.cpSync(path.join(skill, 'assets', 'templates'), path.join(ws, 'templates'), { recursive: true });
    if (!fs.existsSync(path.join(eng, 'package.json')))
      fs.writeFileSync(path.join(eng, 'package.json'), JSON.stringify({ name: 'store-screenshot-engine', private: true, type: 'module', dependencies: { 'playwright-core': '^1.55.0' } }, null, 2));
    if (!fs.existsSync(path.join(eng, 'node_modules', 'playwright-core'))) {
      console.log('installing playwright-core …');
      execSync('npm install --silent --no-audit --no-fund', { cwd: eng, stdio: 'inherit' });
    }
    if (!fs.existsSync(path.join(ws, '.gitignore'))) fs.writeFileSync(path.join(ws, '.gitignore'), 'engine/node_modules/\n');
    loadPlaywright(eng);

    // screens: copy as <slug>.png, strip the real status bar (the mockup draws its own 9:41 bar + Dynamic Island)
    const files = fs.readdirSync(src).filter(f => /\.(png|jpe?g|webp)$/i.test(f)).sort();
    if (!files.length) die('no png/jpg/webp screens in ' + src);
    const used = new Set(), list = [];
    for (const f of files) {
      let slug = f.replace(/\.[^.]+$/, '').toLowerCase().replace(/simulator screenshot - /, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'screen';
      for (let i = 2, s = slug; used.has(slug); i++) slug = `${s}-${i}`;
      used.add(slug); list.push({ file: f, slug });
    }
    const browser = await launch(), page = await browser.newPage();
    await page.goto(pathToFileURL(path.join(ws, 'screens')).href);
    const mode = flags.statusbar || 'auto', meta = [];
    for (const it of list) {
      const r = await page.evaluate(async ([url, mode]) => {
        const im = new Image(); im.src = url; await im.decode();
        const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas');
        c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
        const ar = h / w, band = Math.round(h * (ar > 2.05 && ar < 2.3 ? .0618 : .032));   // iOS notch phones vs others
        const ref = x.getImageData(0, band + 4, w, 1).data, top = x.getImageData(0, 0, w, band).data;
        let diff = 0;
        for (let y = 0; y < band; y++) for (let i = 0; i < w; i++) {
          const a = (y * w + i) * 4, b = i * 4;
          if (Math.max(Math.abs(top[a] - ref[b]), Math.abs(top[a + 1] - ref[b + 1]), Math.abs(top[a + 2] - ref[b + 2])) > 48) diff++;
        }
        const dirty = diff / (w * band) > .003, cleaned = mode === 'clean' || (mode === 'auto' && dirty);
        if (cleaned) {   // flat fill if the row under the bar is one colour, else stretch that row up (keeps gradients)
          const lum = []; for (let i = 0; i < w; i++) lum.push(ref[i * 4] + ref[i * 4 + 1] + ref[i * 4 + 2]);
          const med = [...lum].sort((p, q) => p - q)[w >> 1], flat = lum.filter(v => Math.abs(v - med) < 60).length > w * .95;
          const row = x.getImageData(0, band + 4, w, 1);
          if (flat) { const k = lum.indexOf(med) * 4; x.fillStyle = `rgb(${ref[k]},${ref[k + 1]},${ref[k + 2]})`; x.fillRect(0, 0, w, band + 4); }
          else for (let y = 0; y < band + 4; y++) x.putImageData(row, 0, y);
        }
        return { w, h, cleaned, data: c.toDataURL('image/png').split(',')[1] };
      }, [pathToFileURL(path.join(src, it.file)).href, mode]);
      fs.writeFileSync(path.join(ws, 'screens', it.slug + '.png'), Buffer.from(r.data, 'base64'));
      meta.push({ ...it, w: r.w, h: r.h, statusbarCleaned: r.cleaned });
    }
    const count = {}; meta.forEach(m => count[m.w + 'x' + m.h] = (count[m.w + 'x' + m.h] || 0) + 1);
    const [w, h] = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0].split('x').map(Number);
    const odd = meta.filter(m => m.w !== w || m.h !== h);
    fs.writeFileSync(path.join(ws, 'screens', 'screens.js'),
      `// written by studio init: source pixel size + screen names (use the name as data-src / data-crop)\nwindow.SRC = { w: ${w}, h: ${h} };\nwindow.SCREEN_NAMES = ${JSON.stringify(meta.map(m => m.slug))};\n`);
    fs.writeFileSync(path.join(ws, 'studio.json'), JSON.stringify({ source: src, src: { w, h }, screens: meta, created: new Date().toISOString() }, null, 2));
    // contact sheet: every screen with its name, so the agent can review the whole app in one look
    const cols = 8, cw = 240;
    await sheet(browser, `<body style="margin:0;padding:20px;background:#e9e9ee;font:600 15px system-ui;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:22px 18px">${
      meta.map(m => `<div><img src="${m.slug}.png" style="width:${cw}px;border-radius:14px;display:block;box-shadow:0 4px 14px rgba(0,0,0,.18)"><div style="margin-top:6px;word-break:break-all">${m.slug}</div></div>`).join('')}</body>`,
      path.join(ws, 'screens', 'contact-sheet.png'), cols * (cw + 18) + 40);
    await browser.close();
    console.log(`✓ workspace ${ws}  ·  ${meta.length} screens (${w}x${h})  ·  status bar cleaned on ${meta.filter(m => m.statusbarCleaned).length}`);
    if (odd.length) console.log(`! ${odd.length} screens differ from ${w}x${h}: ${odd.map(m => m.slug).join(', ')} (crops/phones assume one size)`);
    console.log(`  review: ${path.relative(process.cwd(), path.join(ws, 'screens', 'contact-sheet.png'))}`);
    openFile(path.join(ws, 'screens', 'contact-sheet.png'));
  },

  // setup check with plain-language fixes
  async doctor() {
    const ok = m => console.log('✓ ' + m), bad = m => console.log('✗ ' + m);
    const major = +process.versions.node.split('.')[0];
    major >= 20 ? ok(`Node ${process.versions.node}`) : bad(`Node ${process.versions.node}: needs 20 or newer (https://nodejs.org)`);
    const eng = fs.existsSync(path.join(ENGINE, 'node_modules', 'playwright-core')) ? ENGINE
      : fs.existsSync(path.join(process.cwd(), 'store-screenshots', 'engine', 'node_modules')) ? path.join(process.cwd(), 'store-screenshots', 'engine') : null;
    if (!eng) return console.log('… renderer not installed yet: `init` installs it (needs internet once)');
    loadPlaywright(eng);
    try { const b = await launch(); ok('browser found: ' + b.version()); await b.close(); } catch { /* launch() already explained */ }
  },

  // brand colours (logo SVGs, then the screens) → a sheet of contrasting palettes to choose from
  async palette() {
    const ws = wsOf('.'), plan = path.join(ws, 'plan');
    fs.mkdirSync(plan, { recursive: true });
    loadPlaywright(path.join(ws, 'engine'));
    const browser = await launch();
    let brand = flags.brand ? flags.brand.split(',').map(h => '#' + h.replace('#', '')) : [];
    const sat = h => { const [, S, L] = rgb2hsl(hx(h)); return S > .35 && L > .18 && L < .82; };
    if (!brand.length) {   // logo/icon SVG fills first
      const dir = path.join(ws, 'assets', 'brand');
      for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.svg')) : [])
        for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/#[0-9a-f]{6}\b/gi)) if (sat(m[0]) && !brand.includes(m[0].toLowerCase())) brand.push(m[0].toLowerCase());
    }
    if (!brand.length) {   // else the most common saturated hues across the screens
      const page = await browser.newPage();
      await page.goto(pathToFileURL(path.join(ws, 'screens')).href);
      const names = JSON.parse(fs.readFileSync(path.join(ws, 'studio.json'), 'utf8')).screens.map(m => m.slug).slice(0, 16);
      const bins = await page.evaluate(async names => {
        const bins = {};
        for (const n of names) {
          const im = new Image(); im.src = n + '.png'; await im.decode();
          const c = document.createElement('canvas'); c.width = 48; c.height = 104; const x = c.getContext('2d'); x.drawImage(im, 0, 0, 48, 104);
          const d = x.getImageData(0, 0, 48, 104).data;
          for (let i = 0; i < d.length; i += 4) {
            const r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, dl = mx - mn;
            if (!dl || dl / (1 - Math.abs(2 * l - 1)) < .4 || l < .18 || l > .8) continue;
            const h = mx === r ? ((g - b) / dl + 6) % 6 : mx === g ? (b - r) / dl + 2 : (r - g) / dl + 4, k = Math.floor(h * 60 / 20);
            (bins[k] = bins[k] || [0, 0, 0, 0]); bins[k][0]++; bins[k][1] += d[i]; bins[k][2] += d[i + 1]; bins[k][3] += d[i + 2];
          }
        }
        return Object.values(bins).sort((a, b) => b[0] - a[0]).slice(0, 3).map(([n, r, g, b]) => [r / n, g / n, b / n]);
      }, names);
      brand = bins.map(c => toHex(c.map(v => v / 255)));
      await page.close();
    }
    if (!brand.length) brand = ['#1d4cf2'];
    const list = palettes(brand).map((p, i) => ({ n: i + 1, ...p, css: paletteCss(p) }));
    fs.writeFileSync(path.join(plan, 'palettes.json'), JSON.stringify({ brand, palettes: list }, null, 2));
    const planFile = path.join(plan, 'plan.json'), meta = JSON.parse(fs.readFileSync(path.join(ws, 'studio.json'), 'utf8'));
    const shot = fs.existsSync(planFile) ? JSON.parse(fs.readFileSync(planFile, 'utf8')).slides?.[0]?.screen : meta.screens[0].slug;
    const tile = p => `<div class="t" style="background:radial-gradient(260px 320px at 72% 40%,${p.glow}88,transparent 70%),linear-gradient(170deg,${p.base},${p.base2})">
      <div class="h" style="color:${p.onBase}">Big idea,<br><span style="background:${p.accent};color:${p.onAccent}">here.</span></div>
      <div class="s" style="color:${p.onBase}">One plain subtitle line.</div>
      <img src="../screens/${shot}.png"><div class="seal" style="background:${p.accent};color:${p.onAccent}">Two<br>words</div></div>
      <div class="m"><b>${p.n} · ${p.name}</b><span>${p.why}</span><span class="sw">${[p.base, p.accent, p.onBase].map(c => `<i style="background:${c}"></i>${c}`).join(' ')}</span>
      <span>text contrast ${p.contrast}:1 · accent pop ${p.pop}:1</span></div>`;
    await sheet(browser, `<head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:wght@500;700&display=block" rel="stylesheet">
      <style>body{margin:0;padding:36px;background:#e9e9ee;font:500 15px Inter;display:grid;grid-template-columns:repeat(3,380px);gap:34px 30px}
      .t{position:relative;height:560px;border-radius:26px;overflow:hidden}.h{position:absolute;left:28px;top:34px;font:800 52px/.93 "Bricolage Grotesque";letter-spacing:-.05em}
      .h span{padding:0 .12em;border-radius:.18em;display:inline-block;transform:rotate(-2.5deg)}.s{position:absolute;left:30px;top:150px;opacity:.85}
      img{position:absolute;left:78px;top:205px;width:224px;border-radius:30px;border:9px solid #111;box-shadow:0 30px 50px -10px rgba(0,0,0,.45)}
      .seal{position:absolute;left:14px;top:420px;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;text-align:center;font:800 19px/.9 "Bricolage Grotesque";transform:rotate(-12deg)}
      .m{display:flex;flex-direction:column;gap:4px;margin-top:10px;color:#333}.m b{font:700 18px Inter}.sw i{display:inline-block;width:14px;height:14px;border-radius:4px;vertical-align:-2px;margin:0 4px 0 6px;border:1px solid #0002}</style></head>
      <body>${list.map(p => `<div>${tile(p)}</div>`).join('')}</body>`, path.join(plan, 'palettes.png'), 3 * 380 + 2 * 30 + 72);
    await browser.close();
    console.log(`✓ brand colour${brand.length > 1 ? 's' : ''} ${brand.join(' ')} → ${list.length} palettes`);
    console.log(`  review: ${path.join(plan, 'palettes.png')}  (CSS per palette in plan/palettes.json → "css")`);
    openFile(path.join(plan, 'palettes.png'));
  },

  // plan/plan.json (screens + copy per slide) → plan/storyboard.png for the user to approve before any design
  async storyboard() {
    const ws = wsOf('.'), plan = path.join(ws, 'plan'), file = path.resolve(args[0] || path.join(plan, 'plan.json'));
    if (!fs.existsSync(file)) die(`write ${file} first: { "app", "audience", "slides": [{ "screen", "job", "headline", "sub" }], "alternates": [] }`);
    const pj = JSON.parse(fs.readFileSync(file, 'utf8')), names = new Set(JSON.parse(fs.readFileSync(path.join(ws, 'studio.json'), 'utf8')).screens.map(m => m.slug));
    for (const sl of pj.slides) if (!names.has(sl.screen)) die(`slide "${sl.headline}": unknown screen "${sl.screen}" (see screens/screens.js)`);
    loadPlaywright(path.join(ws, 'engine'));
    const browser = await launch(), esc = t => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const hl = t => esc(t).replace(/\*([^*]+)\*/g, '<mark>$1</mark>');
    await sheet(browser, `<head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:wght@500;700&display=block" rel="stylesheet">
      <style>body{margin:0;padding:36px;background:#f1f1f4;font:500 16px Inter;color:#222}h1{font:800 34px "Bricolage Grotesque";margin:0 0 4px}
      .row{display:grid;grid-template-columns:repeat(${pj.slides.length},250px);gap:24px;margin-top:26px}.c{display:flex;flex-direction:column;gap:10px}
      .n{font:700 13px Inter;letter-spacing:.08em;text-transform:uppercase;color:#777}img{width:250px;border-radius:26px;border:8px solid #111}
      .h{font:800 28px/.98 "Bricolage Grotesque";letter-spacing:-.04em}mark{background:#d8ff3e;padding:0 .1em;border-radius:.15em}.alt{display:flex;gap:16px;flex-wrap:wrap;margin-top:12px}
      .alt div{width:120px;font-size:11px;word-break:break-all}.alt b{display:block;font:800 22px Bricolage Grotesque}.slug{font-size:12px;color:#888;word-break:break-all}.alt img{width:120px;border-width:4px;border-radius:14px}</style></head>
      <body><h1>${esc(pj.app)} · storyboard</h1><div>${esc(pj.audience)}</div>
      <div class="row">${pj.slides.map((sl, i) => `<div class="c"><div class="n">${i + 1} · ${esc(sl.job)}</div><img src="../screens/${sl.screen}.png">
        <div class="h">${hl(sl.headline)}</div><div>${esc(sl.sub)}</div><div class="slug">${sl.screen}</div></div>`).join('')}</div>
      ${(pj.alternates || []).length ? `<h1 style="font-size:22px;margin-top:34px">Other screens I could swap in</h1><div class="alt">${pj.alternates.map((a, i) => `<div><b>${String.fromCharCode(65 + i)}</b><img src="../screens/${a}.png">${a}</div>`).join('')}</div>` : ''}</body>`,
      path.join(plan, 'storyboard.png'), pj.slides.length * 274 + 60);
    await browser.close();
    const issues = pj.slides.flatMap(sl => [sl.headline, sl.sub]).flatMap(t => /[—–]/.test(t || '') ? [`dash in "${t}"`] : []);
    console.log(`✓ storyboard → ${path.join(plan, 'storyboard.png')}${issues.length ? '\n  ! ' + issues.join('\n  ! ') : ''}`);
    openFile(path.join(plan, 'storyboard.png'));
  },

  async round() {
    const ws = wsOf('.'), n = args[0] || die('usage: round <n> [--from <round-dir>]');
    const dir = path.join(ws, 'rounds', `round-${n}`);
    if (fs.existsSync(dir)) die(dir + ' exists (keep old rounds; pick a new number)');
    fs.mkdirSync(dir, { recursive: true });
    const from = flags.from && path.resolve(flags.from);
    for (const f of ['shared.css', 'shared.js']) fs.copyFileSync(path.join(from && fs.existsSync(path.join(from, f)) ? from : path.join(ws, 'engine'), f), path.join(dir, f));
    if (from) for (const f of fs.readdirSync(from).filter(f => f.endsWith('.html') && !f.startsWith('_'))) fs.copyFileSync(path.join(from, f), path.join(dir, f));
    console.log(`✓ ${path.relative(process.cwd(), dir)}${from ? ' (copied from ' + path.relative(process.cwd(), from) + ')' : ''}`);
  },

  async render() {
    const target = path.resolve(args[0] || die('usage: render <round-dir | file.html>')), ws = wsOf(target);
    loadPlaywright(path.join(ws, 'engine'));
    const jobs = target.endsWith('.html') ? [target] : fs.readdirSync(target).filter(f => f.endsWith('.html') && !f.startsWith('_')).sort().map(f => path.join(target, f));
    const browser = await launch();
    for (const file of jobs) {
      const dir = path.dirname(file), name = path.basename(file, '.html'), out = path.join(dir, 'out', name);
      fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
      const page = await browser.newPage({ viewport: { width: W0, height: H0 } });
      page.on('pageerror', e => console.error(`  ${name}: ${e.message}`));
      await page.goto(pathToFileURL(file).href, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
      for (let i = 0; i < n; i++) {
        await page.evaluate(i => {
          document.querySelectorAll('.slide').forEach((s, j) => { s.style.display = i === j ? '' : 'none'; });
          document.body.style.transform = `translateX(${-i * 1320}px)`;
        }, i);
        await shoot(page, path.join(out, `${String(i + 1).padStart(2, '0')}.png`));
      }
      await page.close();
      await sheet(browser, `<body style="margin:0;background:#e4e4e8;display:flex;gap:40px;padding:40px">${
        Array.from({ length: n }, (_, i) => `<img src="${name}/${String(i + 1).padStart(2, '0')}.png" style="width:440px;height:956px">`).join('')}</body>`,
        path.join(dir, 'out', `${name}-preview.png`), n * 480 + 40);
      const issues = lint(file);
      console.log(`✓ ${path.relative(process.cwd(), file)}: ${n} slides → out/${name}/${issues.length ? `\n  ! ${issues.join('\n  ! ')}` : ''}`);
    }
    for (const dir of new Set(jobs.map(path.dirname))) {
      const previews = fs.readdirSync(path.join(dir, 'out')).filter(f => f.endsWith('-preview.png')).sort();
      await sheet(browser, `<body style="margin:0;background:#e4e4e8;font:700 40px system-ui;color:#333">${
        previews.map(f => `<div style="padding:36px 40px 0">${f.replace('-preview.png', '')}</div><img src="out/${f}" style="display:block;width:3400px">`).join('')}</body>`,
        path.join(dir, 'overview.png'), 3400);
      console.log(`✓ overview → ${path.relative(process.cwd(), path.join(dir, 'overview.png'))}`);
      openFile(path.join(dir, 'overview.png'));
    }
    await browser.close();
  },

  async final() {
    const chosen = path.resolve(args[0] || die('usage: final <rounds/round-N/name.html> [--only iphone,ipad,android,tab,feature]'));
    const ws = wsOf(chosen), srcDir = path.join(ws, 'final', 'src'), finalDir = path.join(ws, 'final');
    loadPlaywright(path.join(ws, 'engine'));
    fs.mkdirSync(srcDir, { recursive: true });
    if (fs.existsSync(chosen) && chosen.startsWith(path.join(ws, 'rounds'))) {   // promote the chosen set (re-promoting overwrites)
      let html = fs.readFileSync(chosen, 'utf8');
      if (!html.includes('layout.js')) html = html.replace(/(<script src="shared\.js"><\/script>)/, '$1\n<script src="layout.js"></script>');
      fs.writeFileSync(path.join(srcDir, 'screens.html'), html);
      for (const f of ['shared.css', 'shared.js']) fs.copyFileSync(path.join(path.dirname(chosen), f), path.join(srcDir, f));
      if (!fs.existsSync(path.join(srcDir, 'layout.js'))) fs.copyFileSync(path.join(ws, 'engine', 'layout.js'), path.join(srcDir, 'layout.js'));
    }
    if (!fs.existsSync(path.join(srcDir, 'screens.html'))) die('nothing to finalize: pass a round file, e.g. final rounds/round-4/volt.html');
    if (!fs.existsSync(path.join(srcDir, 'feature-graphic.html')))
      fs.copyFileSync(path.join(ws, 'templates', 'feature-graphic.html'), path.join(srcDir, 'feature-graphic.html'));

    const only = (flags.only || 'iphone,ipad,android,tab,feature').split(',');
    const browser = await launch();
    for (const key of only.filter(k => SIZES[k])) {
      const [folder, W, H] = SIZES[key], out = path.join(finalDir, folder);
      fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
      const page = await browser.newPage({ viewport: { width: W0, height: H0 } });
      page.on('pageerror', e => console.error(`  ${key}: ${e.message}`));
      await page.goto(pathToFileURL(path.join(srcDir, 'screens.html')).href + '?size=' + key, { waitUntil: 'networkidle' });
      await page.waitForSelector('body[data-ready]', { timeout: 60000 });
      await page.setViewportSize({ width: W, height: H });
      const n = await page.evaluate(() => document.querySelectorAll('.slide').length);
      for (let i = 0; i < n; i++) {
        await page.evaluate(([i, W]) => {
          document.querySelectorAll('.slide').forEach((s, j) => { s.style.display = i === j ? '' : 'none'; });
          document.body.style.transform = `translateX(${-i * W}px)`;
        }, [i, W]);
        await shoot(page, path.join(out, `${String(i + 1).padStart(2, '0')}.png`));
      }
      await page.close();
      console.log(`✓ ${key}: ${n} × ${W}x${H} → final/${folder}/`);
    }
    if (only.includes('feature')) {
      // authored at 3x (3072x1500) at device scale 1, then downsampled: small 3D phones rendered at 1x get ~0.5px warp
      // blur, and deviceScaleFactor 3 doesn't help (a full-frame 3x capture falls back to low-res tiles)
      const page = await browser.newPage({ viewport: { width: 3072, height: 1500 } });
      await page.goto(pathToFileURL(path.join(srcDir, 'feature-graphic.html')).href, { waitUntil: 'networkidle' });
      await page.waitForSelector('body[data-ready]', { timeout: 60000 });
      const big = path.join(finalDir, '_feature-3x.png');
      await shoot(page, big);
      const small = await page.evaluate(async b64 => {
        const blob = await (await fetch('data:image/png;base64,' + b64)).blob();
        const bmp = await createImageBitmap(blob, { resizeWidth: 1024, resizeHeight: 500, resizeQuality: 'high' });
        const c = new OffscreenCanvas(1024, 500); c.getContext('2d').drawImage(bmp, 0, 0);
        const r = new FileReader(); r.readAsDataURL(await c.convertToBlob({ type: 'image/png' }));
        return new Promise(ok => r.onload = () => ok(r.result.split(',')[1]));
      }, fs.readFileSync(big).toString('base64'));
      fs.writeFileSync(path.join(finalDir, 'feature-graphic_1024x500.png'), Buffer.from(small, 'base64'));
      fs.unlinkSync(big);
      await page.close();
      console.log('✓ feature → final/feature-graphic_1024x500.png');
    }
    // overview: one labelled row per size + the feature graphic
    const rowH = 900, rows = Object.values(SIZES).filter(([f]) => fs.existsSync(path.join(finalDir, f)));
    const vw = Math.max(1200, ...rows.map(([, w, h]) => Math.ceil(7 * rowH * w / h) + 6 * 36 + 80));
    const fg = fs.existsSync(path.join(finalDir, 'feature-graphic_1024x500.png'));
    await sheet(browser, `<body style="margin:0;background:#e4e4e8;font:700 44px system-ui;color:#333;padding:20px 40px 40px">${rows.map(([f]) =>
      `<div style="padding:40px 0 20px">${f.replace('_', ' · ')}</div><div style="display:flex;gap:36px">${
        fs.readdirSync(path.join(finalDir, f)).filter(x => x.endsWith('.png')).sort()
          .map(x => `<img src="${f}/${x}" style="height:${rowH}px;border-radius:24px">`).join('')}</div>`).join('')}${
      fg ? `<div style="padding:40px 0 20px">feature graphic · 1024x500</div><img src="feature-graphic_1024x500.png" style="width:2048px;border-radius:24px">` : ''}</body>`,
      path.join(finalDir, 'overview.png'), vw);
    await browser.close();
    console.log('✓ overview → final/overview.png');
    openFile(path.join(finalDir, 'overview.png'));
    await commands.check([finalDir]);
  },

  async check(override) {
    const target = path.resolve((override || args)[0] || '.');
    const files = fs.statSync(target).isDirectory() ? fs.readdirSync(target, { recursive: true }).map(f => path.join(target, f)) : [target];
    let bad = 0;
    for (const f of files) {
      if (f.endsWith('.html') && !path.basename(f).startsWith('_')) for (const i of lint(f)) { bad++; console.log(`! ${path.relative(process.cwd(), f)}: ${i}`); }
      const k = Object.values(SIZES).find(([folder]) => f.includes(`${path.sep}${folder}${path.sep}`));
      if (f.endsWith('.png') && k) { const [w, h] = pngSize(f); if (w !== k[1] || h !== k[2]) { bad++; console.log(`! ${f}: ${w}x${h}, expected ${k[1]}x${k[2]}`); } }
      if (f.endsWith('feature-graphic_1024x500.png')) { const [w, h] = pngSize(f); if (w !== 1024 || h !== 500) { bad++; console.log(`! ${f}: ${w}x${h}`); } }
    }
    console.log(bad ? `✗ ${bad} issue(s)` : '✓ check passed');
  },

  // a brand-coloured pack of glossy 3D props (generic icons + parcel box + speed trails) → assets/3d/<prefix><name>.png
  async props() {
    const hex = (v, d) => (v || d).replace('#', ''), c = hex(flags.c, '2f6bff'), c2 = hex(flags.c2, 'ffffff'), acc = hex(flags.accent, 'd8ff3e'), pre = flags.prefix || '';
    const all = { star: `icon?shape=star&c=${c}`, heart: `icon?shape=heart&c=${c}`, bolt: `icon?shape=bolt&c=${c}`,
      chat: `icon?shape=chat&c=${c}&c2=${c2}`, shield: `icon?shape=shield&c=${c}&c2=${c2}`, pin: `icon?shape=pin&c=${c}&c2=${c2}`,
      coin: `icon?shape=coin&c2=${c2}`, chart: `icon?shape=chart&c=${c}`, bell: `icon?shape=bell&c=${c}&c2=${c2}`,
      magnifier: `icon?shape=magnifier&c=${c}&c2=${c2}`, gift: `icon?shape=gift&c=${c}&c2=${c2}`, box: `box?t=${c}&a=${acc}`,
      trail: `trail?c=${c}`, trail2: `trail?c=${c}&v=2` };
    const pick = flags.only ? flags.only.split(',') : Object.keys(all);
    args.length = 0; for (const k of pick) { if (!all[k]) die(`unknown prop "${k}" (have: ${Object.keys(all).join(', ')})`); args.push(`${pre}${k}=${all[k]}`); }
    await commands.model();
  },

  async model() {
    const ws = wsOf('.'), eng = path.join(ws, 'engine');
    const need = ['three', 'd3-array', 'd3-geo', 'topojson-client', 'world-atlas'].filter(d => !fs.existsSync(path.join(eng, 'node_modules', d)));
    if (need.length) { console.log('installing ' + need.join(' ') + ' …'); execSync(`npm install --silent --no-audit --no-fund ${need.join(' ')}`, { cwd: eng, stdio: 'inherit' }); }
    execSync(`node models.mjs ${args.map(a => JSON.stringify(a)).join(' ')}`, { cwd: eng, stdio: 'inherit' });
  },
};

if (!commands[cmd]) {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n').slice(1, 16).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
await commands[cmd]();
