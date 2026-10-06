// node models.mjs "<out>=<model>?<query>" … → ../assets/3d/<out>.png (transparent, trimmed). Usually via `studio model`.
// name:hex sets the main plastic colour (cart2 / truck2 / globe truck); out=model?query passes any query (c, h, empty)
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const names = process.argv.slice(2).length ? process.argv.slice(2) : ['box', 'cart', 'truck'];
const gpu = process.platform === 'darwin' ? ['--use-angle=metal', '--enable-gpu'] : ['--enable-gpu'];
let b; for (const channel of ['chrome', 'msedge', undefined]) { try { b = await chromium.launch({ channel, args: ['--allow-file-access-from-files', ...gpu] }); break; } catch {} }
if (!b) throw new Error('no Chromium-based browser found (install Google Chrome)');
for (const spec of names) {
  // spec: name | name:hex | out=name?query   (e.g. cart-white=cart2?c=f2f4f8&h=d8ff3e&empty)
  let [m, c] = spec.split(':'), outName = c ? `${m}-${c}` : m, query = c ? '&c=' + c : '';
  if (spec.includes('=') && spec.indexOf('=') < (spec.indexOf('?') + 1 || Infinity)) {
    [outName, m] = [spec.slice(0, spec.indexOf('=')), spec.slice(spec.indexOf('=') + 1)];
    [m, query] = [m.split('?')[0], m.includes('?') ? '&' + m.split('?')[1] : ''];
  }
  const full = m === 'ribbon';                                      // slide-sized, keep exact framing (no trim)
  const size = +(query.match(/size=(\d+)/) || [, 1600])[1];
  const span = (+(query.match(/x1=(-?\d+)/) || [, 1320])[1]) - (+(query.match(/x0=(-?\d+)/) || [, 0])[1]);
  const p = await b.newPage({ viewport: full ? { width: span, height: 2868 } : { width: size, height: size } });
  p.on('pageerror', e => console.error(m, e.message));
  await p.goto(pathToFileURL(path.join(dir, 'models.html')).href + '?m=' + m + query);
  await p.waitForSelector('body[data-done]', { timeout: 120000 });
  const out = path.join(dir, '..', 'assets', '3d', `${outName}.png`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  if (full) await p.locator('canvas').screenshot({ path: out, omitBackground: true });
  else {   // trim the transparent margin in the page (no Python needed)
    const b64 = await p.evaluate(() => {
      const src = document.querySelector('canvas'), w = src.width, h = src.height, c = document.createElement('canvas');
      c.width = w; c.height = h; const x = c.getContext('2d'); x.drawImage(src, 0, 0);
      const d = x.getImageData(0, 0, w, h).data; let l = w, t = h, r = 0, bt = 0;
      for (let y = 0; y < h; y++) for (let i = 0; i < w; i++) if (d[(y * w + i) * 4 + 3] > 2) { l = Math.min(l, i); r = Math.max(r, i); t = Math.min(t, y); bt = Math.max(bt, y); }
      const o = document.createElement('canvas'); o.width = r - l + 1; o.height = bt - t + 1;
      o.getContext('2d').drawImage(c, l, t, o.width, o.height, 0, 0, o.width, o.height);
      return o.toDataURL('image/png').split(',')[1];
    });
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
  }
  await p.close();
  console.log('ok', out);
}
await b.close();
