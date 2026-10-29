# Engine reference

HTML + CSS + a little JS, rendered by headless Chrome (Playwright). Slides are authored once at 1320x2868 in one
horizontal strip; `studio final` re-anchors them for every store size.

## Workspace (created by `init` in the folder the user works in)

```
store-screenshots/                         what the user sees: images only
  1-storyboard.png  2-palettes.png
  round-N/overview.png  round-N/<concept>/01..NN.png
  final/overview.png  final/<store-size>/01..NN.png
  final/google-play-feature-graphic.png  final/app-store-header.png  final/app-store-search-result.png
  .studio/                                 hidden, everything you edit
    studio.json  notes.md                  source screens + slugs; the decision log (see SKILL.md)
    plan/plan.json  plan/palettes.json
    screens/<slug>.png                     cleaned screens + screens.js + contact-sheet.png
    assets/brand/  assets/3d/*.png         client logos; props (the user's own, or from `props` / `model`)
    rounds/round-N/                        <concept>.html + its own shared.css/js snapshot
    rounds/final/                          screens.html + layout.js + banner.html + from.txt (promoted set)
```

The renderer (playwright-core, three.js and friends, about 45 MB) lives in `$TMPDIR/store-screenshot-studio/` and is
shared by every project. The CLI reinstalls it when it is missing or has sat unused for two days (the OS may prune
it), from npm's cache when it can. Nothing of it is ever copied into the project.

## CLI (`node SKILL_DIR/scripts/studio.mjs <cmd>`, from anywhere inside the project)

ROUND = `3` (a whole round) or `3/concept` (one concept), as the folders read; `round-3/concept` works too.

| Command | Does |
|---|---|
| `init <screens-dir> [--statusbar auto\|clean\|keep]` | creates the workspace, cleans status bars, writes the contact sheet |
| `status` | gates passed, every round with its concepts, the final and where it came from, the decision log |
| `doctor` | checks Node, the renderer and the browser, with plain-language fixes |
| `storyboard` | `.studio/plan/plan.json` → screens + headline + subtitle per slide (+ lettered alternates) → `1-storyboard.png` (gate A) |
| `palette [--brand hex,hex]` | brand colours from logo SVGs or screens → 9 palettes → `2-palettes.png` + `.studio/plan/palettes.json` (gate B) |
| `round [--from ROUND]` | the next round number; `--from` copies that round, or only that concept, with its shared.* snapshot |
| `render ROUND` | slides → `round-N/<concept>/NN.png`, then `round-N/overview.png` (every concept in the round), copy lint |
| `final ROUND [--only ipad,feature,header,search]` | promotes one concept to `.studio/rounds/final/`, renders 4 sizes + 3 banners + overview, runs check |
| `final` | re-render after editing `.studio/rounds/final/*` (no re-promotion) |
| `check [ROUND]` | em/en dashes, superlatives, repeated highlight words, PNG dimensions, alpha channels, the Play 1 MB limit; no ROUND = everything |
| any command `--open` | also opens the result in the system image viewer |
| `model "<out>=<model>?<query>"` | procedural 3D prop → `.studio/assets/3d/<out>.png` |

## Page skeleton

```html
<html style="--n:7"> … <link rel="stylesheet" href="shared.css"> <script src="../../screens/screens.js"></script>
<div class="slide" style="left:0"> … </div>          <!-- slide i at left:i*1320px -->
<script src="shared.js"></script>                     <!-- builds everything; `final` adds layout.js after it -->
```

Colours: paste a palette's `css` line (`:root{--base…}` from .studio/plan/palettes.json). Every colour in parts-demo.html
reads from those variables, and sticker and laurel builders accept `var(--…)` too (`data-seal="var(--accent)"`).

Every top-level child of a `.slide` is positioned absolutely in slide pixels.

The engine gives parts, not a style. Write each concept's HTML and CSS freely: any Google font, any layout, SVG
illustration, textures, patterns, photos the user owns. Use the parts below where they help the idea.

**Landscape screens (games, video).** If the source screens are landscape, every `.phone` turns sideways on its own:
the device lies on its side and the picture stays upright. `data-w` is then the phone's *short* side (480–620 is
a good range). Force one phone with `data-orient="portrait|landscape"`. Use `.float` crops instead of `.lift` on
landscape phones.

**No device.** Show a screen as a rounded card: `<div data-crop="SLUG 0 0 W H 60" data-w="1100" class="float">`
(W and H are the source size), or full-bleed with `<img class="abs" src="../../screens/SLUG.png">`.

**Several phones or a panorama.** Put several `.phone` elements in one slide. For one phone across two slides,
place it outside the `.slide` elements in strip coordinates (`data-c="cx,cy"` plus `data-s="slide index"`).
It then appears in both slides. Use this once, and only when the concept needs it. `.copy` (headline `.h` + `.sub`),
`.logo` and `.award` are the **head**; everything else is the **stage** (this matters for resizing, see below).

## Building blocks

| Markup | Result |
|---|---|
| `<div class="phone" data-src="<slug>" data-w="860" style="left;top">` | flat iPhone Pro with buttons, island, 9:41 bar |
| `+ data-tilt="10,-22,8" data-vc="660" [data-persp="4200"]` | real 3D extrusion; `data-vc` = optical centre x |
| `class="phone blue\|night\|orange"` | titanium colourways (default silver) |
| `data-bar="light"` | white status-bar text (dark screens) |
| `<div data-crop="<slug> x y w h radius" data-w="1000">` | real UI crop (source px), e.g. `.float` for a shadowed pop-out |
| `<div class="lift" data-flat data-crop=… data-z="60" data-scale="1.12">` *inside* a tilted phone | UI piece floating above the glass in the phone's 3D space |
| `<div data-crop=… data-w="170" data-thick="22" data-edge="#cfcac4" data-pose="16,-20,10">` | product card with real shaded thickness |
| `<div class="seal"><svg data-seal="#d8ff3e" data-ring="TEXT • " [data-ink]></svg><b>Two<br>words</b></div>` | scalloped sticker with ring text |
| `<div class="award"><svg data-laurel="#fff" data-leaf="slim"></svg><b>Line,<br><em>line</em></b></div>` | laurel around a real stat; `data-leaf` = `classic` `slim` (fine, premium) `round` (chunky, cute) `wheat` (editorial, nature) |
| `<div class="tape solid">Word <i>✦</i> Word …</div>` rotated | keyword tape (auto-extended on wide sizes) |
| `<svg data-burst="#fff">` + `<b>` | starburst sticker |
| `<img class="obj" src="../../assets/3d/x.png">` / `.obj.bg` | prop with drop shadow / blurred background prop |
| `<div class="grain"></div>` | film grain (kept above the background, below the content) |
| `data-src="@3"`, `data-crop="@3 …"` | placeholder = 4th screen in screens.js (until real names are picked) |

Inline SVG works for custom shapes (tags, arrows, doodles). Put a `drop-shadow` on the svg and keep the paths simple.

## Resizing (layout.js, applied by `final`)

The design is authored for iPhone 6.9". For the other sizes every top-level slide child is wrapped and re-anchored:

- head → scaled `hs`, pinned top-centre; stage → scaled `s`, pinned bottom-centre. Defaults:
  `s = hs = H/2868` (fit height, every gap keeps its proportion).
- `data-pin="l"` / `"r"`: element hugs that canvas edge instead of the centre (corner stickers, edge-bleeding blurred
  props, edge stars). These also zoom by `SIZES[size].edge` on wide canvases.
- `data-k="name"` + `SIZES.<size>.k = { name: { dx, dy, x } }` (or per slide `slides[i].k`) nudges one element for one
  size. Per-slide `{ s, hs, hy, dy }` overrides whole groups.
- `.tape` elements are lengthened automatically. Full-slide art that must extend (a ribbon render) uses
  `data-wide="wide.png" data-wide-x="-600" data-wide-w="3000"`.
- Backgrounds scale with `--u` (set them up with `calc(…*var(--u))`, as in parts-demo.html).

Edit `.studio/rounds/final/layout.js` to tune; `iphone` must stay the identity (no tweaks).

## Banners (banner.html, rendered by `final`)

One file makes three assets. `.key` (2160x1030 px) holds the logo, headline, sub and phones. `final` fits it into
each format's safe area at about authored size, then downsamples (Lanczos-3) to the store size. That keeps the 3D
phones sharp, and every PNG is RGB, with no alpha channel.

| Asset | Canvas | Safe area (x, y, w, h) |
|---|---|---|
| Play feature graphic | 1024 × 500 | 154, 75, 716 × 350 |
| App Store product page header (21:9) | 3840 × 1646 | 1097, 493, 1646 × 661 |
| App Store search result (3:2) | 3840 × 2560 | 836, 765, 2168 × 1030 |

The safe areas are third-party measurements of Apple's templates and of Play's crops (`BANNERS` in studio.mjs).
Words and the logo stay inside `.key`. Phones and props may run past it. The background is `.slide`; its shape
changes per format, so use % positions and fill the area outside the safe box with art (Mac and iPad show the whole
header). Apple's 16:9 "universal" asset (5244 × 2950) is not made, because its safe area is not published.

## Props (`studio props`, `studio model`)

See references/props.md for *where props come from* (the user's own assets first). The generator:

- `studio props --c 00704f --c2 ffffff --accent ff4fa3 [--prefix p1-] [--only star,chat]` renders a brand-coloured pack
  into `.studio/assets/3d/`: `star heart bolt chat shield pin coin chart bell magnifier gift box trail trail2` (.png,
  transparent, trimmed, about 600–1100px). Use `--prefix` to keep one pack per direction.
- `studio model "<out>=<model>?<query>"` renders one prop with full control. Models in `SKILL_DIR/scripts/models.html`:
  `icon` (`shape`=one of the pack shapes, `c`, `c2`, `yaw`, `pitch`, `roll`), `box` (`dims`, `yaw`, `pitch`,
  `t`=tape hex, `a`=sticker hex), `cart2` (`c`=body, `h`=handle, `empty`), `truck3` (`c`=cab, `b`=cargo box, `s`=speed-streak colour, `speed`), `earth` (clay globe,
  `notruck`, `size=3000`; pins and parcels are lon/lat lists in models.html), `trail` (`c`, `v=2`), `ribbon`
  (slide-size, `part=back|front`, `x0`/`x1` to widen).
  Example: `studio model "hero-star=icon?shape=star&c=ffc83d&yaw=-30&size=2400"`.
- Every model takes `&look=`: `glossy` (default) · `clay` (matte, soft) · `toon` (cartoon bands + ink outline,
  `&ink=hex`) · `lowpoly` (faceted) · `metal` (polished; `c=e8b04a` gold, `c=dfe4ec` chrome). `studio props --look clay` applies it to the whole pack. Pick the look from
  the concept (design-taste.md, "3D and objects").
- three.js and friends come with the renderer in the temp folder (see Workspace).
