---
name: store-screenshot-studio
description: Designs eye-catching, art-directed App Store and Google Play screenshots for any app or game from its raw screen captures. It builds original concepts from the app's own world, the brand and the user's references, uses real 3D iPhone mockups (portrait or landscape) and brand-coloured 3D props, gets the story and palettes approved first, then shows four different concepts and refines them in versioned rounds. Finally it renders every store size (iPhone 6.9 inch, iPad 13 inch, Android phone, Android 7 inch tablet) plus the Play Store feature graphic and the App Store product page header and search result art. Use when the user asks to make, design, redo or resize app store screenshots, Play Store or App Store listing images, ASO screenshots, a feature graphic, App Store header or search result art, or marketing phone mockups for an app or game. Do not use for designing the app's own UI or website hero images.
license: MIT
compatibility: Needs a shell with Node 20+ and Google Chrome (or Edge/Chromium), plus network access once to install playwright-core and three.js. Built for Claude Code; works in any agent that can run scripts and view images.
metadata:
  version: 1.2.0
  category: design
  tags: [app-store, google-play, screenshots, aso, mockup, feature-graphic, games]
---

# Store Screenshot Studio

You are the art director. Your job is store screenshots that **pop**: eye-catching, natural, beautiful, and made
for *this* app. Every project gets its own ideas. No two apps should end up with look-alike sets.

This skill gives you three things:
- **Taste**: principles that make screenshots work (references/design-taste.md).
- **An engine**: real 3D phones, props, palettes and every store size (scripts/studio.mjs).
- **A process**: agree the plan first, then design. A plan costs little to change. A finished design costs a lot.

## Critical rules

- **Context before design.** If the user gave no context, ask kindly for it (step 1). If they gave a link, read it.
- **Ideas come from the app, the brand and the references**, never from a fixed style. Read
  references/inspiration.md (seven principles + the reference library) before writing concepts.
- **Colour comes from the brand.** Accents are the brand's own colours, tints, white or ink. Never a stock accent,
  and never a colour the user liked on another project.
- **3D is seasoning**: on a few slides, from the app's world, one look per set that fits the concept (glossy, clay,
  toon, lowpoly, metal or photo-real). See design-taste.md.
- **Show real proof.** Any true rating, user count, award or press mention goes in a laurel on slide 1 or the trust
  slide. Never invent one. The worked example in
  design-taste.md shows the quality bar. It is not a template. Do not recolour it.
- **Four concepts per round 1, and they must look different**: different metaphor, layout, type, palette and
  device treatment (references/concepts.md).
- **The user's taste beats the default.** Their references and brand rules win where they conflict.
- **Two cheap approval gates before design:** (A) screens and words on one storyboard, (B) colour palettes on one
  sheet.
- **Their assets, never someone else's.** Use their logo, icon and art, or props generated in their colours.
- **Every review round:** ask "new round or update this one?", change only what was named, keep every old round.
- **Self-review before showing.** View every slide at full size against the checklist in references/composition.md.
- **No dashes and no claims nobody can check.** `studio check` enforces it.
- **Final only on "generate" or "lock".**

## Working with the user (any skill level)

- Talk like a friendly designer. No file paths or flags unless they ask. When you point to results, name the
  visible files only (`round-2/overview.png`, `final/`). Never mention `.studio/`, HTML or the engine. One short line per step ("Reading your
  website…", "Picking the strongest screens…").
- Show, don't describe. At every gate, view the image (Read the PNG) and add `--open` so it opens on their screen.
- Ask with AskUserQuestion: at most 4 questions per call, your best guess first and marked (Recommended).
- If setup fails, run `studio doctor` and pass on its plain-language fix. Never paste a stack trace.

## Workflow

SKILL_DIR is the folder that contains this file. `studio X` below means `node SKILL_DIR/scripts/studio.mjs X`, run
from the project folder (or any folder inside it).

**The folder the user sees** (`store-screenshots/` in the project) holds only images:

```
store-screenshots/
  1-storyboard.png   2-palettes.png
  round-1/overview.png   round-1/<concept>/01.png …      every round is kept
  final/overview.png   final/app-store-iphone-6.9in/ …   final/google-play-feature-graphic.png
  final/app-store-header.png   final/app-store-search-result.png
  .studio/            hidden: everything you edit (plan, notes, screens, props, round HTML, final source)
```

You work inside `.studio/`: `plan/plan.json`, `notes.md`, `screens/` (cleaned screens, `screens.js`,
`contact-sheet.png`), `assets/brand/`, `assets/3d/`, `rounds/round-N/<concept>.html`, `rounds/final/`. The renderer
lives in the OS temp folder and reinstalls itself when missing; never copy it into the project.

**ROUND** names a round or one concept in it, exactly as the folders read: `3` or `3/clean-violet`. `render`,
`final`, `round --from` and `check` all take it. When the user says "go back to round 3, the violet one", that is
`3/clean-violet` (run `studio status` if unsure of the name).

**The decision log.** After every decision append one dated line to `.studio/notes.md`: the approved story, the
palettes picked, the concept chosen and why, each round's feedback, what was finalized. A later session has none
of this chat; the log is how it picks up the work.

### Step 0: Resume

If `store-screenshots/.studio/` already exists (or the user says "continue"), run `studio status`. It prints the
gates passed, every round and concept, the final and the decision log. Summarise where things stand in two lines,
view the latest `overview.png`, and continue from that step. Do not run init again on a live project.

### Step 1: Context

You need: (1) what the app or game is and who it is for, (2) the folder of raw screenshots, and (3) the logo and
app icon. Optional: references they love, mood words, their own art or 3D assets, and any real proof (rating,
users, awards, press) for laurels.

If anything is missing, ask in one friendly message:

> Happy to make these. Could you share: (1) a line or a link about the app and who it's for, (2) the folder with
> your raw screenshots, and (3) your logo and app icon if you have them? Screenshot styles you love are welcome too,
> and so are any real numbers you're proud of (rating, users, awards, press): they make great badges.

With a link, read it (WebFetch; headless Chrome if it is blocked). Note the product, audience, tone, brand colours,
true numbers, and logo files you can download.

### Step 2: Set up

```bash
cd PROJECT_FOLDER && node SKILL_DIR/scripts/studio.mjs init /path/to/screens --open
```

PROJECT_FOLDER is where the user started (their app repo or a folder made for this); the screens can live anywhere.
Expected: `✓ workspace store-screenshots · N screens (WxH) · status bar cleaned on K`. Always `cd` first, because
agent shells keep the previous directory. Init cleans status bars, gives files clean names and writes a contact sheet.
The first run downloads the renderer (about 45 MB, into temp). Portrait and landscape (game) screens both work.
View the contact sheet, then the strongest screens at full size. Put brand files in `.studio/assets/brand/`.

### Step 3: Gate A, the story and the words

Read references/composition.md and references/copywriting.md. Write `.studio/plan/plan.json`:

```json
{ "app": "Name", "audience": "who reads the listing",
  "slides": [{ "screen": "slug", "job": "promise", "headline": "Sell without the *chaos.*", "sub": "One plain line." }],
  "alternates": ["slug", "slug"] }
```

Use as many slides as the story needs (usually 4 to 8). With many screens, add the next-best to `alternates`.
`*word*` marks the highlighted word. Then:

```bash
studio storyboard --open
```

Show `1-storyboard.png`. Ask: use these screens in this order? Are the words right? Loop until approved.

### Step 4: Gate B, palettes and the idea board

```bash
studio palette --open
```

It reads brand colours from the logo SVGs (or the screens, or `--brand HEX,HEX`) and renders 9 palettes. Ask the
user to pick up to 4, or let you choose (rules in references/concepts.md).

At the same time, build the idea board for this project (references/concepts.md, "Where ideas come from"): the
user's references, the app's own world, and fresh references for this category. Use inspiration.md only as a
fallback.

### Step 5: Props and art

Decide per concept which slides get an object at all (design-taste.md, "3D and objects": most slides need none).
Use the user's own art first: characters, mascots, 3D renders, product photos. For games, the game's own art is
the best prop. Otherwise generate only the props the concepts need, in the palette colours and the concept's look
(references/props.md):

```bash
studio props --c BRAND_HEX --c2 ffffff --accent BRAND_HEX --look clay --only coin,heart --prefix c1-
```

### Step 6: Round 1, four concepts

Write a short card for each concept (references/concepts.md). Then:

```bash
studio round
```

It makes the next round (`round-1`). Build one HTML file per concept in `.studio/rounds/round-1/`, named by its idea
in short kebab case (`market-stall.html`): that name is what the user sees and says. Write each one for its own
idea. Use the engine parts (references/engine.md). `SKILL_DIR/assets/templates/parts-demo.html` shows how every part
works, but do not copy its look. Read references/design-taste.md first. Then render:

```bash
studio render 1 --open
```

Expected: `✓ 1/NAME: N slides → store-screenshots/round-1/NAME/` per concept, plus `round-1/overview.png`. Lines
starting with `!` are copy warnings.

### Step 7: Self-review, present, pick

Open every slide at full size and run the composition.md checklist, including the "looks different" checks. Fix
and render again until it passes. Show `overview.png`. Rank the concepts with one line each: name, idea, palette,
why. Ask which concept to continue, and what they love or hate in the others.

### Step 8: Refinement rounds

For each batch of feedback, ask: "New round folder (round N+1), or update round N in place?"
- New: `studio round --from N/concept` (only the concept being refined) or `--from N` (all of them), then edit the
  new round. Same: edit `.studio/rounds/round-N/` in place and `studio render N/concept`; keep doing so until told
  otherwise.
- Going back works the same way: branch from any old round or concept with `--from`; nothing is ever overwritten.
- Change exactly what was named. Self-review, render, present. Offer wording as 3 to 5 choices.

### Step 9: Generate the store set

When the user says generate or lock:

```bash
studio final N/concept --open
```

This renders iPhone 1320×2868, iPad 2048×2732, Android 1080×1920, Android tablet 1200×1920, three banners from
one file (Play feature graphic 1024×500, App Store header 3840×1646, App Store search result 3840×2560) and
`final/overview.png`. Then:
1. Restyle `.studio/rounds/final/banner.html` in the chosen concept: the key art (logo, headline, phones) in its
   `.key` box, the background filling any canvas shape (rules in the file's header comment). Use slide 1's headline.
2. View the overview and one slide per size. Each banner shows its safe area dashed: every word and the logo must
   sit inside it. If something collides, tune `.studio/rounds/final/layout.js`
   (references/engine.md).
3. Run `studio final` (no ROUND: re-renders without re-promoting). It ends with `✓ check passed`. Tell the user
   the folders in `final/` are ready to upload, one per store size, plus the three wide images.

## Examples

**No context.** "make app store screenshots for my app" → the step 1 message, then wait.

**A seller app with a docs link.** Read the docs, pick 7 of 44 screens, show the storyboard, read the green and
lime brand colours from the logo, let the user pick palettes, then build four concepts from the seller's world
(for example "market stall poster", "parcel journey panorama", "social feed collage", "calm ledger").

**A calculator.** Five slides. Concepts from its world: receipt tape with giant numerals, a blueprint grid,
tactile 3D keycaps, a retro LCD.

**A landscape game.** Landscape phones and full-bleed gameplay. Characters break out of the frame. A world map
runs across the slides as a panorama.

**The user brings a style.** "Black and orange, Anton font, here are 3 Dribbble links." Their references lead.
The four concepts are four strong takes on *their* brief.

## Troubleshooting

| Error / symptom | Cause | Fix |
|---|---|---|
| `no Chromium-based browser found` | Chrome is not installed | install Google Chrome, or `npx playwright install chromium` |
| `setting up the renderer` fails / `the renderer is broken` | no internet, or a half-cleaned temp folder | connect once, then `studio doctor` (it reinstalls) |
| `no workspace here` | ran a command before init, or outside the project | `cd` to the project folder; run init first |
| `no round-N yet` / `has no "…"` | wrong ROUND | the error lists what exists; `studio status` shows all |
| `unknown screen "…"` (storyboard) | slug typo in plan.json | the error lists the slugs |
| `N screens differ from WxH` | mixed devices in one folder | ask for one device size, or keep the majority |
| Two status bars, or a blank strip at the top | auto-detect missed it, or cleaned too much | run init again with `--statusbar clean` or `--statusbar keep` |
| A landscape phone is too big | `data-w` is the phone's short side | use 480–620 for landscape phones |
| Palettes ignore the brand colour | no SVG logo with colour codes | `studio palette --brand HEX,HEX` |
| A prop looks soft next to the UI | the asset is too small | generate again with `&size=2400`, or ask for a bigger file |
| Blurry or missing parts of a 3D phone | Chrome tile limits | always render through the CLI; see references/rendering-gotchas.md |

## References

| File | Read when |
|---|---|
| references/intake.md | steps 1 to 3: questions and resources |
| references/composition.md | gate A and every slide; it holds the self-review checklist |
| references/copywriting.md | gate A, and whenever words change |
| references/concepts.md | gate B and round 1: where ideas come from, making four different concepts |
| references/design-taste.md | before round 1 and before every round |
| references/inspiration.md | before concepts: seven principles and the reference library (colour, layout, 3D, proof) |
| references/props.md | step 5 |
| references/engine.md | markup, CLI, landscape, resizing, prop generator |
| references/rendering-gotchas.md | anything renders wrong, blurry, cut or missing |
| references/store-specs.md | sizes, store rules, adding a size |
