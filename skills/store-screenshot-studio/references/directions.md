# Round 1: four directions

**Direction = layout archetype + palette.** The archetype decides type, composition rhythm and accent devices.
The palette comes from `plan/palettes.png` (`studio palette`). Round 1 is four complete 7-slide sets. Each set
uses a **different archetype with a different palette**. All four share the approved screens and copy
(plan/plan.json). This way the client compares the look, not the content.

## Choosing the four palettes

The user picks from `plan/palettes.png` at the plan gate (multi-select, up to 4). If they say "you choose":

- Always include **Brand bold** (their own colours).
- At most **two** palettes may sit on the brand's base hue (Brand bold, Brand vivid, Accent flood).
- Include at least one **contrasting** option (Complement, Neighbour, or a classic) and at most one **neutral**
  (Paper or Midnight).
- No two palettes may share base and accent. Thumbnail test: shrink the overview. If two rows read as the same
  colour story, swap one.
- Cobalt × lime and Tangerine × sun are classics, not defaults. Use them only when they suit the brand or the
  user picks them.

Paste the chosen palette's `css` line (plan/palettes.json) at the top of each direction's `<style>`. Every colour
in the starter reads from those variables: `--base --base2 --glow --accent --on-base --on-accent --ink`.

## The archetypes (pick four that differ)

### Electric: heavy grotesk + highlight pill
Starter: `templates/starter.html` as is. Bricolage Grotesque 800 at 158px, one word in a rotated accent pill or the
last line in the accent, Inter subtitle. Faint grid, glow, grain. One inverted accent slide (`.alt`), one shifted
slide (`.shift`). Devices: seal stickers, laurels, tapes, tag with bolt, speed bars, ribbon. The proven all-rounder.

### Poster: condensed caps
Anton (or Archivo Black) at about 250px uppercase, `line-height:.9`, the last line in the accent. Headline *below* the
phone on 1–2 slides (top/bottom alternation). Round "coin" crops of photos (white ring), dashed outline pills,
starburst sticker. Loud and great at thumbnail size. Reference: kree8 AI Meal Planner.

### Editorial: calm and premium, still high contrast
Geist or Sora 600–700 at about 130px sentence case, or a serif-italic accent word (Instrument Serif). A highlighter
swipe behind one word (skewed, 60% height), hand-drawn doodles in the accent (sparkle, curved arrow, underline loop),
thin laurel stat. Best on light palettes (Paper) but also strong on Midnight.

### Pop: outlines and hard shadows
Flat colour blocks, thick 6px `--ink` outlines on stickers and pop-out cards, hard offset shadows
(`12px 12px 0 var(--ink)`), Archivo Black or Bricolage, small stat cards cut from real UI. Playful and very
"not AI".

### Duotone split
Each slide is split diagonally between `--base` and `--accent`, with the phone straddling the seam and the headline
crossing it in `--on-base`/`--on-accent`. Strong set rhythm; keep props minimal.

### Close-up bleed
Phones scaled up (1200–1500px) and cropped hard, so the UI is the hero (kree8 Smart Reminders). One natural prop
breaks the frame edge. Centred headline. Works when the app's UI is itself beautiful.

## Presenting

One line per direction: the archetype + palette name ("Poster on Complement: crimson with mint caps"), why it
fits this app, and the ranking. Strongest first.
