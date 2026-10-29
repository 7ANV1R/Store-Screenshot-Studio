#!/usr/bin/env node
// Store Screenshot Studio CLI: node SKILL_DIR/scripts/studio.mjs <cmd>, from the project (or any folder inside it).
// ROUND is a round or one concept in it, the way the folders read: 3 · 3/clean-violet · round-3/clean-violet
//
//   init <screens-dir> [--ws store-screenshots] [--statusbar auto|clean|keep]   new workspace from raw screens
//   status                                       where the project stands: gates, rounds, final, decision notes
//   doctor                                       check Node, renderer, browser
//   storyboard                                   .studio/plan/plan.json → 1-storyboard.png
//   palette [--brand hex,hex]                    brand colours → 2-palettes.png
//   round [--from ROUND]                         next round folder (empty, or a copy of ROUND)
//   render ROUND                                 → round-N/<concept>/01..NN.png + round-N/overview.png
//   final [ROUND] [--only iphone,ipad,android,tab,feature,header,search]   concept → every store asset; no ROUND re-renders
//   check [ROUND]                                copy lint (dashes, claims) + PNG sizes; no ROUND = everything
//   props [--c hex] [--c2 hex] [--accent hex] [--look glossy|clay|toon|lowpoly|metal] [--prefix p-] [--only star,box]   3D prop pack
//   model "<out>=<model>?<query>" …              one procedural 3D prop → .studio/assets/3d
//
// Add --open to init/palette/storyboard/render/final to pop the result open in the system image viewer.
// Slides are authored once at 1320x2868 (App Store 6.9"); `final` re-anchors them for every store size (layout.js).
// The user's folder holds only images; everything editable lives in its hidden .studio/ and the renderer
// (node_modules) in the OS temp folder, reinstalled whenever it is missing.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPTS = path.dirname(fileURLToPath(import.meta.url)), SKILL = path.dirname(SCRIPTS);
const ENGINE = path.join(os.tmpdir(), 'store-screenshot-studio'), HIDDEN = '.studio';
const [cmd, ...rest] = process.argv.slice(2);
const flags = {}, args = [];
const BOOL = new Set(['open']);   // flags without a value
for (let i = 0; i < rest.length; i++) {
  if (!rest[i].startsWith('--')) args.push(rest[i]);
  else if (BOOL.has(rest[i].slice(2))) flags[rest[i].slice(2)] = true;
  else flags[rest[i].slice(2)] = rest[++i];
}

const W0 = 1320, H0 = 2868;
const SIZES = {   // key → output folder in final/, canvas
  iphone: ['app-store-iphone-6.9in', 1320, 2868], ipad: ['app-store-ipad-13in', 2048, 2732],
  android: ['google-play-phone', 1080, 1920], tab: ['google-play-tablet-7in', 1200, 1920],
};
// banners: one banner.html, its .key block (KEY design px) fitted into each format's safe area [x, y, w, h], the
// background filling the canvas. ponytail: the safe areas are third-party measurements (Apple's templates, Play guides);
// re-measure from Apple's templates or Play Console's preview if a store changes its crops.
const KEY = [2160, 1030];
const BANNERS = {
  feature: ['google-play-feature-graphic.png', 1024, 500, [154, 75, 716, 350]],
  header: ['app-store-header.png', 3840, 1646, [1097, 493, 1646, 661]],
  search: ['app-store-search-result.png', 3840, 2560, [836, 765, 2168, 1030]],
};
const DEPS = { 'playwright-core': '^1.55.0', three: '^0.186.1', 'd3-array': '^3.2.4', 'd3-geo': '^3.1.1', 'topojson-client': '^3.1.0', 'world-atlas': '^2.0.2' };
const die = m => { console.error('✗ ' + m); process.exit(1); };
const rel = p => path.relative(process.cwd(), p) || '.';
// the workspace: the cwd, a store-screenshots/ in it, or either of those in a parent folder
const wsOf = () => {
  for (let d = process.cwd(); ; d = path.dirname(d)) {
    for (const ws of [d, path.join(d, 'store-screenshots')]) if (fs.existsSync(path.join(ws, HIDDEN, 'studio.json'))) return ws;
    if (d === path.dirname(d)) die('no workspace here: cd into the project, or run init first');
  }
};
const concepts = dir => fs.readdirSync(dir).filter(f => f.endsWith('.html') && !f.startsWith('_')).sort().map(f => f.slice(0, -5));
const roundNums = ws => fs.readdirSync(path.join(ws, HIDDEN, 'rounds')).map(f => +(f.match(/^round-(\d+)$/) || [])[1]).filter(Boolean).sort((a, b) => a - b);
// ROUND → { name: 'round-3', dir: hidden source, out: visible folder, file: concept html or undefined }
function ref(ws, s) {
  const m = String(s || '').match(/^(?:round-?)?(\d+)(?:\/([\w.-]+?)(?:\.html)?)?\/?$/) || die(`"${s || ''}" is not a round: use 3 or 3/concept (see: status)`);
  const name = 'round-' + m[1], dir = path.join(ws, HIDDEN, 'rounds', name), file = m[2] && path.join(dir, m[2] + '.html');
  if (!fs.existsSync(dir)) die(`no ${name} yet (have: ${roundNums(ws).join(', ') || 'none'})`);
  if (file && !fs.existsSync(file)) die(`${name} has no "${m[2]}" (has: ${concepts(dir).join(', ')})`);
  return { name, dir, file, out: path.join(ws, name) };
}
// ponytail: the OS prunes temp files unused for a few days, maybe file by file. Rather than detect a half-pruned
// tree, start clean after 2 idle days; npm's own cache makes the reinstall quick and usually offline.
function engine() {
  const stamp = path.join(ENGINE, '.last-used');
  if (!fs.existsSync(stamp) || Date.now() - fs.statSync(stamp).mtimeMs > 2 * 864e5) fs.rmSync(ENGINE, { recursive: true, force: true });
  fs.mkdirSync(ENGINE, { recursive: true });
  for (const f of ['models.html', 'models.mjs']) fs.copyFileSync(path.join(SCRIPTS, f), path.join(ENGINE, f));
  fs.writeFileSync(path.join(ENGINE, 'package.json'), JSON.stringify({ name: 'store-screenshot-engine', private: true, type: 'module', dependencies: DEPS }, null, 2));
  if (Object.keys(DEPS).some(d => !fs.existsSync(path.join(ENGINE, 'node_modules', d, 'package.json')))) {
    console.log('setting up the renderer (needs internet the first time) …');
    execSync('npm install --silent --no-audit --no-fund --prefer-offline', { cwd: ENGINE, stdio: 'inherit' });
  }
  fs.writeFileSync(stamp, '');
  loadPlaywright(ENGINE);
}
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
const textOn = (bg, dark) => contrast(bg, '#ffffff') >= contrast(bg, dark) ? '#ffffff' : dark;
// the first candidate that pops on this base (3:1 or more), else white or ink, whichever reads better
const popOn = (base, ink, ...c) => c.find(x => x && contrast(base, x) >= 3) || textOn(base, ink);

// every palette is built from the brand: its colours, their shades and tints, white, and a brand-tinted ink. No stock
// accent colours (they made every set look alike): a new hue only comes from the brand's own second colour, or from
// the one 'complement' option.
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
  const comp = tone(brand, .72, .32, 180), mid = tone(brand, .38, .09), deep = tone(brand, sat, .15), wash = tone(brand, Math.min(.9, sat + .1), .92);
  const muddy = h => h > 40 && h < 95, step = [40, -40, 60, -60].find(d => !muddy((hueOf(brand) + d + 360) % 360)) ?? 40;
  const neigh = tone(brand, .74, .34, step), light = tone(brand, .95, .7);
  return [
    mk('brand-bold', 'Brand bold', second ? 'your two brand colours, as they are' : 'your colour, deep, with white highlights', bold,
      tone(bold, sat, Math.max(.08, rgb2hsl(hx(bold))[2] - .1)), tone(brand, .9, .6), popOn(bold, ink, second, '#ffffff')),
    mk('brand-vivid', 'Brand vivid', 'your colour at full strength', vivid, tone(brand, sat, .41), tone(brand, .95, .7), popOn(vivid, ink, '#ffffff', second)),
    mk('tonal', 'Tonal', 'one hue only, from a deep shade to a bright tint', deep, tone(brand, sat, .08), tone(brand, .9, .42), popOn(deep, ink, light, vivid)),
    mk('clean', 'Clean white', 'white canvas, your colour only on the key word and UI', '#ffffff', '#f0f1f4', wash, popOn('#ffffff', ink, vivid, bold), ink),
    mk('wash', 'Soft wash', 'a pale wash of your colour with deep brand ink', wash, tone(brand, Math.min(.9, sat), .86), '#ffffff', popOn(wash, ink, bold, deep), tone(brand, .6, .16)),
    mk('midnight', 'Midnight', 'near-black tinted with your hue, glowing accent', mid, tone(brand, .4, .05), tone(brand, .8, .32), popOn(mid, ink, light, '#ffffff')),
    mk('paper', 'Paper', 'warm off-white, ink type, highlighter in your colour', '#f4f1ea', '#e9e3d6', '#ffffff',
      contrast(tone(brand, .95, .78), '#141414') >= 7 ? tone(brand, .95, .78) : tone(brand, .95, .85), '#141414'),
    mk('neighbour', 'Neighbour', 'a sibling hue, fresh but on-brand', neigh, tone(neigh, .74, .24), tone(neigh, .9, .62), popOn(neigh, ink, second, '#ffffff')),
    mk('complement', 'Complement', 'opposite hue base, your colour as the pop', comp, tone(brand, .72, .22, 180), tone(brand, .9, .6, 180), popOn(comp, ink, light, '#ffffff')),
  ];
}
const paletteCss = p => `:root{--base:${p.base};--base2:${p.base2};--glow:${p.glow};--accent:${p.accent};--on-base:${p.onBase};--on-accent:${p.onAccent};--ink:${p.ink}}`;

// ---------- browser ----------
let chromium;
function loadPlaywright(engineDir) {
  const req = createRequire(path.join(engineDir, 'package.json'));
  try { ({ chromium } = req('playwright-core')); } catch { die(`the renderer is broken: delete ${engineDir} and run the command again`); }
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
// big render → exact store size with Lanczos-3 (Chrome's own 'high' resize is visibly softer on UI text), saved via a
// screenshot so the PNG is plain RGB: both stores reject files with an alpha channel
async function downsample(browser, big, out, W, H) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.goto(pathToFileURL(path.dirname(big)).href);
  await page.evaluate(async ([url, W, H]) => {
    const im = new Image(); im.src = url; await im.decode();
    const w = im.naturalWidth, h = im.naturalHeight, c = document.createElement('canvas');
    c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(im, 0, 0);
    const lz = t => t === 0 ? 1 : Math.abs(t) >= 3 ? 0 : 3 * Math.sin(Math.PI * t) * Math.sin(Math.PI * t / 3) / (Math.PI * Math.PI * t * t);
    // one separable pass: n source samples per line → m, along x (horiz) or y
    const pass = (d, sw, sh, m, horiz) => {
      const n = horiz ? sw : sh, lines = horiz ? sh : sw, ow = horiz ? m : sw, r = n / m, o = new Float32Array(ow * (horiz ? sh : m) * 4);
      for (let i = 0; i < m; i++) {
        const c = (i + .5) * r - .5, taps = [];
        let sum = 0;
        for (let k = Math.ceil(c - 3 * r); k <= Math.floor(c + 3 * r); k++) { const v = lz((k - c) / r); taps.push(Math.min(n - 1, Math.max(0, k)), v); sum += v; }
        for (let l = 0; l < lines; l++) {
          let R = 0, G = 0, B = 0;
          for (let t = 0; t < taps.length; t += 2) { const s = (horiz ? l * sw + taps[t] : taps[t] * sw + l) * 4, v = taps[t + 1]; R += d[s] * v; G += d[s + 1] * v; B += d[s + 2] * v; }
          const q = (horiz ? l * ow + i : i * ow + l) * 4; o[q] = R / sum; o[q + 1] = G / sum; o[q + 2] = B / sum;
        }
      }
      return o;
    };
    const f = pass(pass(x.getImageData(0, 0, w, h).data, w, h, W, true), W, h, H, false), id = new ImageData(W, H);
    for (let i = 0; i < f.length; i += 4) { id.data[i] = f[i]; id.data[i + 1] = f[i + 1]; id.data[i + 2] = f[i + 2]; id.data[i + 3] = 255; }
    const out = document.createElement('canvas'); out.width = W; out.height = H; out.getContext('2d').putImageData(id, 0, 0);
    document.body.style.margin = 0; document.body.replaceChildren(out);
  }, [pathToFileURL(big).href, W, H]);
  await page.screenshot({ path: out });
  await page.close();
}

// base: the folder the sheet's relative image paths resolve from
async function sheet(browser, html, file, width, base = path.dirname(file)) {
  const tmp = path.join(base, `_sheet_${Date.now()}.html`);
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
    const ws = path.resolve(flags.ws || 'store-screenshots'), st = path.join(ws, HIDDEN), scr = path.join(st, 'screens');
    for (const d of ['screens', 'assets/3d', 'assets/brand', 'plan', 'rounds']) fs.mkdirSync(path.join(st, d), { recursive: true });
    const notes = path.join(st, 'notes.md');   // the decision log that lets a later session pick up where this one stopped
    if (!fs.existsSync(notes)) fs.writeFileSync(notes, '# Decisions\n\n');
    engine();

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
    await page.goto(pathToFileURL(scr).href);
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
      fs.writeFileSync(path.join(scr, it.slug + '.png'), Buffer.from(r.data, 'base64'));
      meta.push({ ...it, w: r.w, h: r.h, statusbarCleaned: r.cleaned });
    }
    const count = {}; meta.forEach(m => count[m.w + 'x' + m.h] = (count[m.w + 'x' + m.h] || 0) + 1);
    const [w, h] = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0].split('x').map(Number);
    const odd = meta.filter(m => m.w !== w || m.h !== h);
    fs.writeFileSync(path.join(scr, 'screens.js'),
      `// written by studio init: source pixel size + screen names (use the name as data-src / data-crop)\nwindow.SRC = { w: ${w}, h: ${h} };\nwindow.SCREEN_NAMES = ${JSON.stringify(meta.map(m => m.slug))};\n`);
    fs.writeFileSync(path.join(st, 'studio.json'), JSON.stringify({ source: src, src: { w, h }, screens: meta, created: new Date().toISOString() }, null, 2));
    // contact sheet: every screen with its name, so the agent can review the whole app in one look
    const cols = 8, cw = 240;
    await sheet(browser, `<body style="margin:0;padding:20px;background:#e9e9ee;font:600 15px system-ui;display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:22px 18px">${
      meta.map(m => `<div><img src="${m.slug}.png" style="width:${cw}px;border-radius:14px;display:block;box-shadow:0 4px 14px rgba(0,0,0,.18)"><div style="margin-top:6px;word-break:break-all">${m.slug}</div></div>`).join('')}</body>`,
      path.join(scr, 'contact-sheet.png'), cols * (cw + 18) + 40);
    await browser.close();
    console.log(`✓ workspace ${rel(ws)}  ·  ${meta.length} screens (${w}x${h})  ·  status bar cleaned on ${meta.filter(m => m.statusbarCleaned).length}`);
    if (odd.length) console.log(`! ${odd.length} screens differ from ${w}x${h}: ${odd.map(m => m.slug).join(', ')} (crops/phones assume one size)`);
    console.log(`  review: ${rel(path.join(scr, 'contact-sheet.png'))}`);
    openFile(path.join(scr, 'contact-sheet.png'));
  },

  // everything a fresh session needs to resume: gates passed, every round and concept, the final, the decision log
  async status() {
    const ws = wsOf(), st = path.join(ws, HIDDEN), meta = JSON.parse(fs.readFileSync(path.join(st, 'studio.json'), 'utf8'));
    const has = f => fs.existsSync(path.join(ws, f)) ? '✓' : '·', fin = path.join(st, 'rounds', 'final');
    console.log(`workspace ${rel(ws)}  ·  ${meta.screens.length} screens from ${meta.source}`);
    console.log(`  ${has('1-storyboard.png')} storyboard   ${has('2-palettes.png')} palettes`);
    for (const n of roundNums(ws)) console.log(`  round ${n}: ${concepts(path.join(st, 'rounds', 'round-' + n)).map(c => `${n}/${c}`).join('  ') || '(empty)'}`);
    if (fs.existsSync(path.join(fin, 'from.txt'))) console.log(`  ${has('final/overview.png')} final from ${fs.readFileSync(path.join(fin, 'from.txt'), 'utf8')}`);
    const notes = path.join(st, 'notes.md');
    if (fs.existsSync(notes)) console.log('\n' + fs.readFileSync(notes, 'utf8').trim());
  },

  // setup check with plain-language fixes
  async doctor() {
    const ok = m => console.log('✓ ' + m), bad = m => console.log('✗ ' + m);
    const major = +process.versions.node.split('.')[0];
    major >= 20 ? ok(`Node ${process.versions.node}`) : bad(`Node ${process.versions.node}: needs 20 or newer (https://nodejs.org)`);
    engine(); ok('renderer ready in ' + ENGINE);
    try { const b = await launch(); ok('browser found: ' + b.version()); await b.close(); } catch { /* launch() already explained */ }
  },

  // brand colours (logo SVGs, then the screens) → a sheet of contrasting palettes to choose from
  async palette() {
    const ws = wsOf(), st = path.join(ws, HIDDEN), plan = path.join(st, 'plan'), out = path.join(ws, '2-palettes.png');
    engine();
    const browser = await launch();
    let brand = flags.brand ? flags.brand.split(',').map(h => '#' + h.replace('#', '')) : [];
    const sat = h => { const [, S, L] = rgb2hsl(hx(h)); return S > .35 && L > .18 && L < .82; };
    if (!brand.length) {   // logo/icon SVG fills first
      const dir = path.join(st, 'assets', 'brand');
      for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.svg')) : [])
        for (const m of fs.readFileSync(path.join(dir, f), 'utf8').matchAll(/#[0-9a-f]{6}\b/gi)) if (sat(m[0]) && !brand.includes(m[0].toLowerCase())) brand.push(m[0].toLowerCase());
    }
    if (!brand.length) {   // else the most common saturated hues across the screens
      const page = await browser.newPage();
      await page.goto(pathToFileURL(path.join(st, 'screens')).href);
      const names = JSON.parse(fs.readFileSync(path.join(st, 'studio.json'), 'utf8')).screens.map(m => m.slug).slice(0, 16);
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
    const planFile = path.join(plan, 'plan.json'), meta = JSON.parse(fs.readFileSync(path.join(st, 'studio.json'), 'utf8'));
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
      <body>${list.map(p => `<div>${tile(p)}</div>`).join('')}</body>`, out, 3 * 380 + 2 * 30 + 72, plan);
    await browser.close();
    console.log(`✓ brand colour${brand.length > 1 ? 's' : ''} ${brand.join(' ')} → ${list.length} palettes`);
    console.log(`  review: ${rel(out)}  (CSS per palette in ${rel(path.join(plan, 'palettes.json'))} → "css")`);
    openFile(out);
  },

  // .studio/plan/plan.json (screens + copy per slide) → 1-storyboard.png for the user to approve before any design
  async storyboard() {
    const ws = wsOf(), st = path.join(ws, HIDDEN), plan = path.join(st, 'plan'), file = path.join(plan, 'plan.json'), out = path.join(ws, '1-storyboard.png');
    if (!fs.existsSync(file)) die(`write ${rel(file)} first: { "app", "audience", "slides": [{ "screen", "job", "headline", "sub" }], "alternates": [] }`);
    const pj = JSON.parse(fs.readFileSync(file, 'utf8')), names = new Set(JSON.parse(fs.readFileSync(path.join(st, 'studio.json'), 'utf8')).screens.map(m => m.slug));
    for (const sl of pj.slides) if (!names.has(sl.screen)) die(`slide "${sl.headline}": unknown screen "${sl.screen}" (have: ${[...names].join(', ')})`);
    engine();
    const browser = await launch(), esc = t => String(t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const hl = t => esc(t).replace(/\*([^*]+)\*/g, '<mark>$1</mark>');
    await sheet(browser, `<head><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,800&family=Inter:wght@500;700&display=block" rel="stylesheet">
      <style>body{margin:0;padding:36px;background:#f1f1f4;font:500 16px Inter;color:#222}h1{font:800 34px "Bricolage Grotesque";margin:0 0 4px}
      .row{display:grid;grid-template-columns:repeat(${pj.slides.length},250px);gap:24px;margin-top:26px}.c{display:flex;flex-direction:column;gap:10px}
      .n{font:700 13px Inter;letter-spacing:.08em;text-transform:uppercase;color:#777}img{width:250px;border-radius:26px;border:8px solid #111}
      .h{font:800 28px/.98 "Bricolage Grotesque";letter-spacing:-.04em}mark{background:#ffe58a;padding:0 .1em;border-radius:.15em}.alt{display:flex;gap:16px;flex-wrap:wrap;margin-top:12px}
      .alt div{width:120px;font-size:11px;word-break:break-all}.alt b{display:block;font:800 22px Bricolage Grotesque}.slug{font-size:12px;color:#888;word-break:break-all}.alt img{width:120px;border-width:4px;border-radius:14px}</style></head>
      <body><h1>${esc(pj.app)} · storyboard</h1><div>${esc(pj.audience)}</div>
      <div class="row">${pj.slides.map((sl, i) => `<div class="c"><div class="n">${i + 1} · ${esc(sl.job)}</div><img src="../screens/${sl.screen}.png">
        <div class="h">${hl(sl.headline)}</div><div>${esc(sl.sub)}</div><div class="slug">${sl.screen}</div></div>`).join('')}</div>
      ${(pj.alternates || []).length ? `<h1 style="font-size:22px;margin-top:34px">Other screens I could swap in</h1><div class="alt">${pj.alternates.map((a, i) => `<div><b>${String.fromCharCode(65 + i)}</b><img src="../screens/${a}.png">${a}</div>`).join('')}</div>` : ''}</body>`,
      out, pj.slides.length * 274 + 60, plan);
    await browser.close();
    const issues = pj.slides.flatMap(sl => [sl.headline, sl.sub]).flatMap(t => /[—–]/.test(t || '') ? [`dash in "${t}"`] : []);
    console.log(`✓ storyboard → ${rel(out)}${issues.length ? '\n  ! ' + issues.join('\n  ! ') : ''}`);
    openFile(out);
  },

  // the next free round number; --from ROUND copies that round, or only that one concept, with its shared.* snapshot
  async round() {
    const ws = wsOf(), from = flags.from && ref(ws, flags.from), n = Math.max(0, ...roundNums(ws)) + 1;
    const dir = path.join(ws, HIDDEN, 'rounds', `round-${n}`);
    fs.mkdirSync(dir);
    for (const f of ['shared.css', 'shared.js']) fs.copyFileSync(path.join(from && fs.existsSync(path.join(from.dir, f)) ? from.dir : SCRIPTS, f), path.join(dir, f));
    for (const c of from ? (from.file ? [from.file] : concepts(from.dir).map(c => path.join(from.dir, c + '.html'))) : []) fs.copyFileSync(c, path.join(dir, path.basename(c)));
    console.log(`✓ round ${n}${from ? ` (copy of ${flags.from})` : ''}: concepts go in ${rel(dir)}/`);
  },

  // ROUND → round-N/<concept>/01..NN.png and round-N/overview.png (every concept of that round, one row each)
  async render() {
    const ws = wsOf(), r = ref(ws, args.join('/')), jobs = r.file ? [path.basename(r.file, '.html')] : concepts(r.dir);
    if (!jobs.length) die(`${r.name} has no concepts yet: write <concept>.html files into ${rel(r.dir)}/`);
    engine();
    const browser = await launch();
    for (const name of jobs) {
      const file = path.join(r.dir, name + '.html'), out = path.join(r.out, name);
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
      const issues = lint(file);
      console.log(`✓ ${r.name.slice(6)}/${name}: ${n} slides → ${rel(out)}/${issues.length ? `\n  ! ${issues.join('\n  ! ')}` : ''}`);
    }
    const rows = concepts(r.dir).filter(c => fs.existsSync(path.join(r.out, c)))
      .map(c => [c, fs.readdirSync(path.join(r.out, c)).filter(f => f.endsWith('.png')).sort()]);
    await sheet(browser, `<body style="margin:0;background:#e4e4e8;font:700 40px system-ui;color:#333;padding:0 40px 40px">${rows.map(([c, pngs]) =>
      `<div style="padding:36px 0 20px">${c}</div><div style="display:flex;gap:40px">${pngs.map(p => `<img src="${c}/${p}" style="width:440px;height:956px">`).join('')}</div>`).join('')}</body>`,
      path.join(r.out, 'overview.png'), Math.max(...rows.map(([, p]) => p.length)) * 480 + 40);
    await browser.close();
    console.log(`✓ overview → ${rel(path.join(r.out, 'overview.png'))}`);
    openFile(path.join(r.out, 'overview.png'));
  },

  async final() {
    const ws = wsOf(), st = path.join(ws, HIDDEN), srcDir = path.join(st, 'rounds', 'final'), finalDir = path.join(ws, 'final');
    if (args.length) {   // promote the chosen concept (re-promoting overwrites it; a tuned layout.js is kept)
      const r = ref(ws, args.join('/'));
      if (!r.file) die(`pick one concept of ${r.name}: ${concepts(r.dir).map(c => r.name.slice(6) + '/' + c).join(', ')}`);
      fs.mkdirSync(srcDir, { recursive: true });
      let html = fs.readFileSync(r.file, 'utf8');
      if (!html.includes('layout.js')) html = html.replace(/(<script src="shared\.js"><\/script>)/, '$1\n<script src="layout.js"></script>');
      fs.writeFileSync(path.join(srcDir, 'screens.html'), html);
      for (const f of ['shared.css', 'shared.js']) fs.copyFileSync(path.join(r.dir, f), path.join(srcDir, f));
      if (!fs.existsSync(path.join(srcDir, 'layout.js'))) fs.copyFileSync(path.join(SCRIPTS, 'layout.js'), path.join(srcDir, 'layout.js'));
      fs.writeFileSync(path.join(srcDir, 'from.txt'), `${r.name.slice(6)}/${path.basename(r.file, '.html')}`);
    }
    if (!fs.existsSync(path.join(srcDir, 'screens.html'))) die('nothing to finalize yet: pick a concept, e.g. final 4/volt');
    if (!fs.existsSync(path.join(srcDir, 'banner.html')))
      fs.copyFileSync(path.join(SKILL, 'assets', 'templates', 'banner.html'), path.join(srcDir, 'banner.html'));
    engine();

    const only = (flags.only || [...Object.keys(SIZES), ...Object.keys(BANNERS)].join(',')).split(',');
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
      console.log(`✓ ${key}: ${n} × ${W}x${H} → ${rel(out)}/`);
    }
    for (const key of only.filter(k => BANNERS[k])) {
      // render so the key block sits at its authored size (3D phones under ~800px blur when drawn small), then
      // downsample to the store size; formats whose block needs no shrinking render 1:1
      const [file, W, H, [sx, sy, sw, sh]] = BANNERS[key], fit = Math.min(sw / KEY[0], sh / KEY[1]), k = Math.min(1, fit);
      const page = await browser.newPage({ viewport: { width: Math.round(W / k), height: Math.round(H / k) } });
      page.on('pageerror', e => console.error(`  ${key}: ${e.message}`));
      await page.goto(pathToFileURL(path.join(srcDir, 'banner.html')).href, { waitUntil: 'networkidle' });
      await page.waitForSelector('body[data-ready]', { timeout: 60000 });
      const ok = await page.evaluate(([x, y, s]) => {
        const el = document.querySelector('.key');
        if (el) Object.assign(el.style, { transformOrigin: '0 0', transform: `translate(${x}px,${y}px) scale(${s})` });
        return !!el;
      }, [(sx + (sw - KEY[0] * fit) / 2) / k, (sy + (sh - KEY[1] * fit) / 2) / k, fit / k]);
      if (!ok) die('banner.html has no .key block (start again from SKILL_DIR/assets/templates/banner.html)');
      const out = path.join(finalDir, file);
      if (k === 1) await shoot(page, out);
      else { const big = path.join(st, `_${key}-big.png`); await shoot(page, big); await downsample(browser, big, out, W, H); fs.unlinkSync(big); }
      await page.close();
      console.log(`✓ ${key}: ${W}x${H} → ${rel(out)}`);
    }
    // overview: one labelled row per size, then each banner with its safe area dashed
    const rowH = 900, rows = Object.values(SIZES).filter(([f]) => fs.existsSync(path.join(finalDir, f)));
    const vw = Math.max(2128, ...rows.map(([, w, h]) => Math.ceil(7 * rowH * w / h) + 6 * 36 + 80));
    const pct = (v, of) => `${(100 * v / of).toFixed(3)}%`;
    await sheet(browser, `<body style="margin:0;background:#e4e4e8;font:700 44px system-ui;color:#333;padding:20px 40px 40px">${rows.map(([f, w, h]) =>
      `<div style="padding:40px 0 20px">${f} · ${w}x${h}</div><div style="display:flex;gap:36px">${
        fs.readdirSync(path.join(finalDir, f)).filter(x => x.endsWith('.png')).sort()
          .map(x => `<img src="${f}/${x}" style="height:${rowH}px;border-radius:24px">`).join('')}</div>`).join('')}${
      Object.values(BANNERS).filter(([f]) => fs.existsSync(path.join(finalDir, f))).map(([f, w, h, [x, y, sw, sh]]) =>
        `<div style="padding:40px 0 20px">${f.slice(0, -4)} · ${w}x${h} <span style="font-weight:500;color:#777">(dashed: safe area)</span></div>
        <div style="position:relative;width:2048px"><img src="${f}" style="display:block;width:100%">
        <div style="position:absolute;left:${pct(x, w)};top:${pct(y, h)};width:${pct(sw, w)};height:${pct(sh, h)};outline:4px dashed #ff2d55"></div></div>`).join('')}</body>`,
      path.join(finalDir, 'overview.png'), vw);
    await browser.close();
    console.log(`✓ overview → ${rel(path.join(finalDir, 'overview.png'))}`);
    openFile(path.join(finalDir, 'overview.png'));
    await commands.check([finalDir, srcDir]);
  },

  // copy lint + PNG sizes for ROUND, or the whole workspace
  async check(targets) {
    if (!targets) { const ws = wsOf(); targets = args.length ? [(r => r.file || r.dir)(ref(ws, args.join('/')))] : [ws]; }
    let bad = 0;
    for (const target of targets) {
      const files = fs.statSync(target).isDirectory() ? fs.readdirSync(target, { recursive: true }).map(f => path.join(target, f)) : [target];
      for (const f of files) {
        if (f.endsWith('.html') && !path.basename(f).startsWith('_')) for (const i of lint(f)) { bad++; console.log(`! ${rel(f)}: ${i}`); }
        const k = Object.values(SIZES).find(([folder]) => f.includes(`${path.sep}${folder}${path.sep}`));
        if (f.endsWith('.png') && k) { const [w, h] = pngSize(f); if (w !== k[1] || h !== k[2]) { bad++; console.log(`! ${rel(f)}: ${w}x${h}, expected ${k[1]}x${k[2]}`); } }
        const bn = Object.values(BANNERS).find(([file]) => path.basename(f) === file);
        if (bn) { const [w, h] = pngSize(f); if (w !== bn[1] || h !== bn[2]) { bad++; console.log(`! ${rel(f)}: ${w}x${h}, expected ${bn[1]}x${bn[2]}`); } }
        if (bn === BANNERS.feature && fs.statSync(f).size > 1024 * 1024) { bad++; console.log(`! ${rel(f)}: over 1 MB, Google Play rejects it (less grain/noise)`); }
        // colour type 4/6 = has an alpha channel; App Store Connect and Play both refuse those
        if (f.endsWith('.png') && (k || bn) && [4, 6].includes(fs.readFileSync(f)[25])) { bad++; console.log(`! ${rel(f)}: has an alpha channel, stores reject it`); }
      }
    }
    console.log(bad ? `✗ ${bad} issue(s)` : '✓ check passed');
  },

  // a brand-coloured pack of glossy 3D props (generic icons + parcel box + speed trails) → .studio/assets/3d/<prefix><name>.png
  async props() {
    const hex = (v, d) => (v || d).replace('#', ''), c = hex(flags.c, '2f6bff'), c2 = hex(flags.c2, 'ffffff'), acc = hex(flags.accent, c), pre = flags.prefix || '';
    const all = { star: `icon?shape=star&c=${c}`, heart: `icon?shape=heart&c=${c}`, bolt: `icon?shape=bolt&c=${c}`,
      chat: `icon?shape=chat&c=${c}&c2=${c2}`, shield: `icon?shape=shield&c=${c}&c2=${c2}`, pin: `icon?shape=pin&c=${c}&c2=${c2}`,
      coin: `icon?shape=coin&c2=${c2}`, chart: `icon?shape=chart&c=${c}`, bell: `icon?shape=bell&c=${c}&c2=${c2}`,
      magnifier: `icon?shape=magnifier&c=${c}&c2=${c2}`, gift: `icon?shape=gift&c=${c}&c2=${c2}`, box: `box?t=${c}&a=${acc}`,
      trail: `trail?c=${c}`, trail2: `trail?c=${c}&v=2` };
    const pick = flags.only ? flags.only.split(',') : Object.keys(all);
    args.length = 0; for (const k of pick) { if (!all[k]) die(`unknown prop "${k}" (have: ${Object.keys(all).join(', ')})`); args.push(`${pre}${k}=${all[k]}${flags.look ? '&look=' + flags.look : ''}`); }
    await commands.model();
  },

  async model() {
    const ws = wsOf();
    engine();
    execSync(`node models.mjs ${args.map(a => JSON.stringify(a)).join(' ')}`,
      { cwd: ENGINE, stdio: 'inherit', env: { ...process.env, STUDIO_OUT: path.join(ws, HIDDEN, 'assets', '3d') } });
  },
};

if (!commands[cmd]) {
  const src = fs.readFileSync(fileURLToPath(import.meta.url), 'utf8').split('\n');
  console.log(src.slice(1, src.findIndex(l => l.startsWith('import'))).map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(cmd ? 1 : 0);
}
await commands[cmd]();
