// Colours on stickers/laurels (data-seal, data-ink, data-laurel, data-burst) accept CSS vars, e.g. var(--accent).
// Builds iPhone 17 Pro mockups (.phone) and real-UI crops ([data-crop]) from the app's raw screens.
// screens/screens.js (written by `studio init`) sets window.SRC = { w, h } (source pixel size) before this file loads.
const SRC = window.SRC || { w: 1206, h: 2622 }, SRC_W = SRC.w, AR = SRC.h / SRC.w;
const IMG = n => `${window.SCREENS || '../../screens'}/${n}.png`;
document.documentElement.style.setProperty('--ar', AR);

const ICONS = `<span class="ic">
<svg viewBox="0 0 19 12"><rect x="0" y="7.5" width="3.2" height="4.5" rx="1" fill="currentColor"/><rect x="5.2" y="5" width="3.2" height="7" rx="1" fill="currentColor"/><rect x="10.4" y="2.5" width="3.2" height="9.5" rx="1" fill="currentColor"/><rect x="15.6" y="0" width="3.2" height="12" rx="1" fill="currentColor"/></svg>
<svg viewBox="0 0 17 12"><path fill="currentColor" d="M8.5 2.4c2.4 0 4.6.9 6.2 2.5l1.3-1.3A10.6 10.6 0 0 0 8.5.5 10.6 10.6 0 0 0 1 3.6l1.3 1.3a8.7 8.7 0 0 1 6.2-2.5Zm0 3.7c1.4 0 2.7.5 3.6 1.4l1.3-1.3a7 7 0 0 0-9.8 0l1.3 1.3c.9-.9 2.2-1.4 3.6-1.4Zm0 3.6c-.5 0-1 .2-1.3.5l1.3 1.3 1.3-1.3a1.8 1.8 0 0 0-1.3-.5Z"/></svg>
<svg class="bat" viewBox="0 0 28 13"><rect x=".6" y=".6" width="23.4" height="11.8" rx="3.6" fill="none" stroke="currentColor" stroke-opacity=".4" stroke-width="1.1"/><rect x="2.4" y="2.4" width="19.8" height="8.2" rx="2.1" fill="currentColor"/><path d="M25.6 4.4v4.2c.9-.3 1.6-1.2 1.6-2.1s-.7-1.8-1.6-2.1Z" fill="currentColor" fill-opacity=".45"/></svg></span>`;

// [side, top as fraction of height, length as fraction of height]
const BUTTONS = [['l', .182, .042], ['l', .262, .072], ['l', .352, .072], ['r', .285, .108], ['r', .598, .062]];

function buildPhone(p) {
  const w = +p.dataset.w || 900;
  p.style.setProperty('--w', w + 'px');
  const h = (w - 2 * w * (.0125 + .0215)) * AR + 2 * w * (.0125 + .0215);
  if (p.dataset.c) { // data-c="cx,cy": position by centre (easier to aim rotated phones)
    let [cx, cy] = p.dataset.c.split(',').map(Number);
    cx += (+p.dataset.s || 0) * 1320; // data-s="n": slide index for phones placed at strip level (outside .slide)
    Object.assign(p.style, { left: cx - w / 2 + 'px', top: cy - h / 2 + 'px' });
  }
  const bar = p.dataset.bar === 'light' ? ' light' : '';
  const src = p.dataset.src;
  const face = `<div class="face"><div class="bezel"></div><div class="screen">
    <img src="${IMG(src)}"><div class="sb${bar}"><span>9:41</span>${ICONS}</div><div class="island"></div><div class="glare"></div>
  </div></div>`;

  if (!p.dataset.tilt) {
    const btns = BUTTONS.map(([s, t, l]) => `<i class="btn ${s}" style="top:${t * h}px;height:${l * h}px"></i>`).join('');
    p.innerHTML = btns + face;
    return;
  }

  // 3D: real extrusion. The rounded outline is walked with thin side strips (straight edges + segmented corners),
  // each shaded by its angle to a top-left light; buttons are raised strips on the side walls.
  const lifts = [...p.querySelectorAll(':scope > .lift')];
  const [rx, ry, rz] = p.dataset.tilt.split(',').map(Number);
  const D = w * .1, R = w * .168, pr = w * .0065, hw = w / 2, hh = h / 2;
  const shade = th => {
    const d = Math.cos(th) * -.55 + Math.sin(th) * -.83;
    const o = d > 0 ? `rgba(255,255,255,${(.32 * d).toFixed(3)})` : `rgba(0,0,0,${(.5 * -d).toFixed(3)})`;
    return `linear-gradient(${o},${o}),linear-gradient(90deg,rgba(255,255,255,.65),var(--band1) 8%,var(--band2) 34%,var(--band2) 66%,var(--band3) 92%,rgba(0,0,0,.55))`;
  };
  const strip = (x, y, th, L, t = D, bg = shade(th), inner = '') =>
    `<i style="width:${t}px;height:${L}px;margin:${-L / 2}px 0 0 ${-t / 2}px;background:${bg};` +
    `transform:translate3d(${x}px,${y}px,${-D / 2}px) rotateZ(${th}rad) rotateY(90deg)">${inner}</i>`;
  let sides = strip(hw, 0, 0, h - 2 * R + 2) + strip(-hw, 0, Math.PI, h - 2 * R + 2) +
              strip(0, -hh, -Math.PI / 2, w - 2 * R + 2) + strip(0, hh, Math.PI / 2, w - 2 * R + 2);
  const seg = 12;
  for (const [cx, cy, a0] of [[hw - R, -hh + R, -Math.PI / 2], [hw - R, hh - R, 0], [-hw + R, hh - R, Math.PI / 2], [-hw + R, -hh + R, Math.PI]])
    for (let k = 0; k < seg; k++) {
      const th = a0 + (k + .5) * Math.PI / 2 / seg;
      sides += strip(cx + R * Math.cos(th), cy + R * Math.sin(th), th, R * Math.PI / 2 / seg + 1.5);
    }
  for (const [s, t, l] of BUTTONS) {
    const th = s === 'l' ? Math.PI : 0, x = (s === 'l' ? -1 : 1) * (hw + pr);
    sides += strip(x, -hh + (t + l / 2) * h, th, l * h, D * .42,
      `linear-gradient(90deg,var(--band3),var(--band1) 30%,var(--band2) 70%,var(--band3))`);
  }
  const sx = p.dataset.sx || 0, sy = p.dataset.sy || w * .08;
  p.innerHTML = `<div class="pshadow" style="transform:translateZ(${-D - 30}px) translate(${sx}px,${sy}px)"></div>` +
    `<div class="back" style="transform:translateZ(${-D}px)"></div><div class="ext">${sides}</div>` +
    face.replace('class="face"', 'class="face" style="transform:translateZ(.5px)"');
  p.style.setProperty('--shadow', 'none');
  lifts.forEach(el => liftOff(p, el, w));
  p.style.transform = `perspective(${p.dataset.persp || 4200}px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`;
}

// <div class="lift" data-crop="screen x y w h r" data-z="110" data-edge="#0a3fae"> inside a tilted .phone:
// the cropped UI floats data-z px above the glass in the phone's own 3D space, with a solid extruded body
// (data-edge colour) down to the screen and a soft shadow cast onto the screen.
function liftOff(p, el, w) {
  const [, x, y, cw, ch, r = 0] = el.dataset.crop.trim().split(/\s+/).map((v, i) => i ? +v : v);
  const off = w * .034, k = (w - 2 * off) / SRC_W;
  const L = off + x * k, T = off + y * k, Wd = cw * k, Ht = ch * k, R = r * k, z = +el.dataset.z || w * .1;
  el.dataset.w = Wd;
  const sc = +el.dataset.scale || 1;       // data-scale: grow the lifted piece slightly
  Object.assign(el.style, { left: L + 'px', top: T + 'px', transform: `translateZ(${z}px) scale(${sc})`, zIndex: 5 });
  const box = (extra) => `<div style="position:absolute;left:${L}px;top:${T}px;width:${Wd}px;height:${Ht}px;border-radius:${R}px;${extra}"></div>`;
  let body = box(`transform:translateZ(1.5px) translate(${w * .02}px,${w * .045}px) scale(${sc});background:rgba(0,10,40,.55);filter:blur(${w * .025}px)`);
  // data-flat: a separate floating layer (same plane as the screen, just higher), no extruded sides
  const edge = el.dataset.edge || '#0a3fae', n = el.dataset.flat !== undefined ? 0 : Math.ceil(z / 2.5);
  for (let i = 1; i < n; i++) body += box(`transform:translateZ(${(i / n) * z}px);background:${edge};filter:brightness(${.62 + .38 * i / n})`);
  p.insertAdjacentHTML('beforeend', body);
  p.appendChild(el);
}

// data-crop="screen x y w h radius" + data-w (display width in px)
function buildCrop(el) {
  const [src, x, y, w, h, rad = 0] = el.dataset.crop.trim().split(/\s+/);
  const W = +el.dataset.w, s = W / +w;
  Object.assign(el.style, {
    width: W + 'px', height: (+h * s) + 'px', borderRadius: (+rad * s) + 'px',
    backgroundImage: `url(${IMG(src)})`, backgroundSize: `${SRC_W * s}px auto`,
    backgroundPosition: `${-x * s}px ${-y * s}px`,
  });
}

// <svg data-laurel="color"> → two leafy branches framing the middle (viewBox 800x420)
function buildLaurel(svg) {
  const c = svg.dataset.laurel, cx = 400, cy = 185, rx = 360, ry = 195;
  let g = '';
  const pt = a => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  for (let i = 0; i < 9; i++) {
    const a = (104 + i * 13) * Math.PI / 180, [x, y] = pt(a);
    const tang = Math.atan2(ry * Math.cos(a), -rx * Math.sin(a)) * 180 / Math.PI; // direction of travel (up the branch)
    const s = 1 - i * .055;
    for (const side of [-1, 1])
      g += `<ellipse cx="${x}" cy="${y}" rx="${30 * s}" ry="${11 * s}" style="fill:${c}"
        transform="rotate(${tang + side * 38} ${x} ${y}) translate(${26 * s} 0)"/>`;
  }
  const [x0, y0] = pt(100 * Math.PI / 180), [x1, y1] = pt(212 * Math.PI / 180);
  g += `<path d="M${x0} ${y0} A${rx} ${ry} 0 0 1 ${x1} ${y1}" fill="none" style="stroke:${c}" stroke-width="5" stroke-linecap="round"/>`;
  svg.setAttribute('viewBox', '0 0 800 420');
  svg.innerHTML = `<g>${g}</g><g transform="translate(800 0) scale(-1 1)">${g}</g>`;
}

// window.BLOBS = [[x, y, radius, color], ...] in strip coords → soft light pools, painted into every slide they
// touch so they flow seamlessly across screenshot seams.
(window.BLOBS || []).forEach(([x, y, r, c]) => document.querySelectorAll('.slide').forEach(sl => {
  const L = sl.offsetLeft;
  if (x + r < L || x - r > L + 1320) return;
  const d = document.createElement('div');
  d.className = 'blob';
  Object.assign(d.style, { position: 'absolute', left: x - L - r + 'px', top: y - r + 'px', width: 2 * r + 'px', height: 2 * r + 'px',
    borderRadius: '50%', background: `radial-gradient(closest-side, ${c}, transparent)` });
  sl.prepend(d);
}));

// grain sits right above the background (under phones/cards) so it never textures the UI
document.querySelectorAll('.slide').forEach(sl => { const g = sl.querySelector(':scope>.grain'); if (g) sl.insertBefore(g, sl.querySelector(':scope>:not(.blob)')); });
// <svg data-burst="fill" [data-stroke="#fff"]> → 28-point starburst sticker (label goes in a sibling <b>)
document.querySelectorAll('[data-burst]').forEach(s => {
  const pts = [...Array(56)].map((_, i) => { const a = i * Math.PI / 28, r = i % 2 ? 43 : 50; return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`; });
  s.setAttribute('viewBox', '-2 -2 104 104');
  s.innerHTML = `<polygon points="${pts.join(' ')}" style="fill:${s.dataset.burst};stroke:${s.dataset.stroke || '#fff'}" stroke-width="1.8" stroke-linejoin="round"/>`;
});

// data-vc="x": after the 3D pose is applied, slide the phone so its VISIBLE silhouette (face + side walls) is
// centred on x (slide coordinates). A tilted phone's box centre and its optical centre differ.
function opticalCentre(p) {
  const slide = p.closest('.slide'), rects = [p.querySelector('.face'), ...p.querySelectorAll('.ext i')].map(e => e.getBoundingClientRect());
  const l = Math.min(...rects.map(r => r.left)), r = Math.max(...rects.map(r => r.right));
  const shift = +p.dataset.vc + (slide ? slide.getBoundingClientRect().left : 0) - (l + r) / 2;
  p.style.left = (parseFloat(getComputedStyle(p).left) + shift) + 'px';
}
// <svg data-seal="fill" data-ring="TEXT • "> → scalloped seal sticker with a dashed inner ring and circular text
// (centre label goes in a sibling <b>)
function buildSeal(svg) {
  const R = 96, n = 22, pts = [];
  for (let i = 0; i <= 360; i++) { const a = i * Math.PI / 180, r = R - 3.2 + 3.2 * Math.cos(n * a); pts.push(`${100 + r * Math.cos(a)},${100 + r * Math.sin(a)}`); }
  const ink = svg.dataset.ink || '#08123f', id = 'ring' + Math.random().toString(36).slice(2, 7);
  svg.setAttribute('viewBox', '0 0 200 200');
  svg.innerHTML = `<polygon points="${pts.join(' ')}" style="fill:${svg.dataset.seal}"/>
    <circle cx="100" cy="100" r="55" fill="none" style="stroke:${ink}" stroke-width="1.6" stroke-dasharray="2 4" opacity=".55"/>
    <path id="${id}" d="M100,100 m-67,0 a67,67 0 1,1 134,0 a67,67 0 1,1 -134,0" fill="none"/>
    <text font-family="Inter" font-weight="800" font-size="10.5" letter-spacing="2" style="fill:${ink}"><textPath href="#${id}" textLength="412">${svg.dataset.ring || ''}</textPath></text>`;
}
// placeholders: data-src="@2" / data-crop="@2 x y w h r" = the 3rd screen in screens.js (until real names are picked)
document.querySelectorAll('[data-src^="@"],[data-crop^="@"]').forEach(el => {
  const pick = v => v.replace(/^@(\d+)/, (_, i) => (window.SCREEN_NAMES || [])[+i] || 'missing');
  if (el.dataset.src) el.dataset.src = pick(el.dataset.src);
  if (el.dataset.crop) el.dataset.crop = pick(el.dataset.crop);
});
document.querySelectorAll('[data-seal]').forEach(buildSeal);

// <svg data-burst="fill"> → 24-point starburst sticker (label in a sibling <b>)
document.querySelectorAll('[data-burst]').forEach(s => {
  const pts = [...Array(48)].map((_, i) => { const a = i * Math.PI / 24, r = i % 2 ? 42 : 50; return `${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`; });
  s.setAttribute('viewBox', '0 0 100 100');
  s.innerHTML = `<polygon points="${pts.join(' ')}" style="fill:${s.dataset.burst};stroke:${s.dataset.burst}" stroke-width="3" stroke-linejoin="round"/>`;
});
document.querySelectorAll('[data-laurel]').forEach(buildLaurel);
document.querySelectorAll('.phone').forEach(buildPhone);
document.querySelectorAll('[data-crop]').forEach(buildCrop);
document.querySelectorAll('.phone[data-vc]').forEach(opticalCentre);

// <div data-crop=… data-thick="22" data-edge="#d9dce3" data-pose="14,-18,10"> → a product card with real depth:
// the cropped image is the front face; stacked slices behind it (shaded light→dark) form the rounded sides.
// No outline. data-pose = rotateX,rotateY,rotateZ (deg); +X / −Y reveal the bottom and right sides.
document.querySelectorAll('[data-thick]').forEach(el => {
  const d = +el.dataset.thick, [rx, ry, rz] = (el.dataset.pose || '14,-18,0').split(',').map(Number);
  const c = el.dataset.edge || '#d9dce3', W = el.offsetWidth, H = el.offsetHeight, R = el.style.borderRadius;
  const wrap = document.createElement('div');
  Object.assign(wrap.style, { position: 'absolute', left: el.style.left, top: el.style.top, width: W + 'px', height: H + 'px',
    transformStyle: 'preserve-3d', transform: `perspective(1600px) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` });
  const n = Math.ceil(d / 1.5);
  let html = `<div style="position:absolute;inset:0;border-radius:${R};background:rgba(2,8,48,.5);filter:blur(${d * 1.2}px);transform:translateZ(${-d - 30}px) translate(${d * .6}px,${d * 1.6}px)"></div>`;
  for (let i = n; i >= 1; i--) {
    const k = i / n;   // 0 = front edge, 1 = back
    html += `<div style="position:absolute;inset:0;border-radius:${R};transform:translateZ(${-k * d}px);
      background:linear-gradient(155deg, color-mix(in srgb, ${c} 82%, #fff) 0%, ${c} 40%, color-mix(in srgb, ${c} ${70 - 25 * k}%, #000) 100%)"></div>`;
  }
  wrap.innerHTML = html;
  el.parentNode.insertBefore(wrap, el);
  Object.assign(el.style, { left: 0, top: 0, transform: 'translateZ(.5px)', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,.35)' });
  wrap.appendChild(el);
});
