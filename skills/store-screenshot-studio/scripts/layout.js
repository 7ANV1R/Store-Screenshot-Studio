// Responsive pass, runs after shared.js has built everything at the authored 1320x2868 size.
// Every top-level piece of a slide gets wrapped in a 1320x2868 box that is scaled + re-anchored onto the target canvas:
//   copy (.logo .copy .award)  → scale hs, pinned to the top centre (+hy)
//   everything else            → scale s, pinned to the bottom centre (+dy)
//   data-pin="l" / "r"         → same, but hugging the left / right canvas edge instead of the centre
// Tweaks: size-wide { edge, k }, plus per slide { s, hs, hy, dy, k }; k = { <data-k>: { dx, dy, x (extra zoom) } }.
// edge = extra zoom for data-pin="l|r" pieces (stickers, blurred props) so wide canvases don't feel empty.
// Defaults: s = hs = H / 2868 (fit height, so every gap keeps the iPhone proportions).
window.SIZES = {
  iphone:  { W: 1320, H: 2868 },
  ipad:    { W: 2048, H: 2732, edge: 1.25 },
  android: { W: 1080, H: 1920 },
  tab:     { W: 1200, H: 1920, edge: 1.1 },
};

(async () => {
  const key = new URLSearchParams(location.search).get('size') || 'iphone', cfg = SIZES[key], { W, H } = cfg;
  const fit = H / 2868, wide = key !== 'iphone';
  const slides = [...document.querySelectorAll('.slide')], n = slides.length;
  await document.fonts.ready;

  // slide-size art (e.g. a ribbon render) with a wider render for wide canvases: data-wide="file" data-wide-x="-600"
  // data-wide-w="3000" (the wide render's left edge and width in slide px)
  for (const el of document.querySelectorAll('[data-wide]')) {
    if (!wide) continue;
    Object.assign(el.style, { left: (el.dataset.wideX || -600) + 'px', width: (el.dataset.wideW || 3000) + 'px' });
    el.src = el.dataset.wide;
  }
  if (wide) document.querySelectorAll('.tape').forEach(t => extendTape(t, 1600));

  Object.assign(document.documentElement.style, { width: W * n + 'px', height: H + 'px' });
  Object.assign(document.body.style, { width: W * n + 'px', height: H + 'px' });
  slides.forEach((sl, i) => {
    const c = (cfg.slides || [])[i] || {}, s = c.s ?? cfg.s ?? fit, hs = c.hs ?? cfg.hs ?? s;
    Object.assign(sl.style, { left: i * W + 'px', width: W + 'px', height: H + 'px' });
    sl.style.setProperty('--u', s);
    for (const el of [...sl.children]) {
      if (el.matches('.grain,.blob')) continue;
      const head = el.matches('.logo,.copy,.award'), pin = el.dataset.pin || 'c';
      const o = { ...(cfg.k || {})[el.dataset.k], ...(c.k || {})[el.dataset.k] };
      const k = (head ? hs : s) * (o.x || (pin !== 'c' && cfg.edge) || 1);
      const ax = { l: 0, c: 660, r: 1320 }[pin], cx = { l: 0, c: W / 2, r: W }[pin] + (o.dx || 0);
      const ay = head ? 0 : 2868, cy = (head ? c.hy || 0 : H + (c.dy || 0)) + (o.dy || 0);
      const g = document.createElement('div');
      g.style.cssText = `position:absolute;left:0;top:0;width:1320px;height:2868px;transform-origin:0 0;` +
        `transform:translate(${cx - ax * k}px,${cy - ay * k}px) scale(${k})`;
      el.replaceWith(g);
      g.appendChild(el);
    }
  });
  await Promise.all([...document.images].map(i => i.decode().catch(() => {})));
  document.body.dataset.ready = 1;
})();

// .tape = rotated band of repeating words (overflow hidden, flex row). Lengthen it by D on both ends without moving it or its words: the words are repeated on either side
// and the run is shifted so the original words stay exactly where they were.
function extendTape(t, D) {
  const sep = '<i>✦</i>', copy = `<span style="display:flex;align-items:center;gap:inherit;flex:none">${t.innerHTML}</span>`;
  t.innerHTML = `<span style="display:flex;align-items:center;gap:inherit;flex:none">${[copy, copy, copy, copy, copy].join(sep)}</span>`;
  const run = t.firstChild, orig = run.children[4];   // children: copy, i, copy, i, copy(original) ...
  run.style.marginLeft = D + parseFloat(getComputedStyle(t).paddingLeft) - orig.offsetLeft + 'px';
  Object.assign(t.style, { left: parseFloat(t.style.left) - D + 'px', width: parseFloat(t.style.width) + 2 * D + 'px' });
}
