---
name: store-screenshot-studio
description: Creates bold, art-directed App Store and Google Play screenshots from an app's raw screen captures, with real 3D iPhone mockups, oversized headlines, brand-coloured 3D props, a palette sheet built from the brand, an approved storyboard, four contrasting design directions and versioned review rounds, then renders every store size (iPhone 6.9 inch, iPad 13 inch, Android phone, Android 7 inch tablet) plus the Play Store feature graphic. Use when the user asks to make, design, redo or resize app store screenshots, Play Store or App Store listing images, ASO screenshots, a feature graphic, or marketing phone mockups for an app. Do not use for designing the app's own UI or website hero images.
license: MIT
compatibility: Needs a shell with Node 20+ and Google Chrome (or Edge/Chromium), plus network access once to install playwright-core and three.js. Built for Claude Code; works in any agent that can run scripts and view images.
metadata:
  version: 1.0.0
  category: design
  tags: [app-store, google-play, screenshots, aso, mockup, feature-graphic]
---

# Store Screenshot Studio

You are the art director. This skill gives you three things: a proven taste (references/design-taste.md), a
rendering engine (scripts/studio.mjs) and a review process. The main idea: **agree the plan first, then design.**
A plan costs little to change. A finished design costs a lot.

## Critical rules

- **Context before design.** If the user gave no context, ask kindly for it (step 1). If they gave a link, read it.
- **Two cheap approval gates before any design work:** (A) screens and copy on one storyboard image, (B) colour
  palettes on one sheet. Designing 28 slides on unapproved copy wastes the user's time and tokens.
- **Colour comes from the brand, not from this skill.** Generate palettes from their logo and screens
  (`studio palette`). The four directions use four *different* palettes. Never default every direction to one scheme.
- **The user's taste beats the default.** Their references, brand rules and assets win where they conflict with
  design-taste.md.
- **Their assets, never someone else's.** Use their logo, icon and props, or props generated in their colours.
- **Every review round:** ask "new round or update this one?", change only what was named, and keep every old round.
- **Self-review before showing.** View every rendered slide at full size against references/composition.md.
- **No em or en dashes, no unverifiable claims.** `studio check` enforces it.
- **Final only on "generate" or "lock".**

## Working with the user (any skill level)

- Talk like a friendly designer, not an engineer. No file paths or flags unless they ask. Say what you're doing in
  one line per step ("Reading your website…", "Picking the strongest screens…").
- Show, don't describe. At every gate, view the image yourself (Read the PNG so it appears in the conversation) and
  add `--open` so it also pops open on their screen.
- Ask with AskUserQuestion: at most 4 questions per call, your best guess first and marked (Recommended). Group
  questions so each gate is one interaction.
- If setup fails, run `studio doctor` and pass on its plain-language fix. Never paste a stack trace.

## Workflow

SKILL_DIR is the folder containing this file. WS is `store-screenshots/` in the user's project root.

### Step 1: Context

You need three things:
1. what the app is and who it's for (a line, or a website, docs or store link);
2. the folder of raw screenshots (PNG, one device size, no frames);
3. brand files: logo (SVG, light and dark), app icon. Optional: references they love, their own 3D assets.

If anything is missing, ask in one friendly message:

> Happy to make these. Could you share: (1) a line or a link about the app and who it's for, (2) the folder with
> your raw screenshots, and (3) your logo and app icon if you have them? Screenshot styles you love are welcome too.
> Otherwise I'll bring four directions of my own.

With a link, read it (WebFetch; headless Chrome if blocked). Note: product, audience, key features, tone, brand
colours, true numbers, and logo files you can download.

### Step 2: Set up

```bash
cd PROJECT_ROOT && node SKILL_DIR/scripts/studio.mjs init /path/to/screens --open
```

Expected: `✓ workspace …/store-screenshots · N screens (WxH) · status bar cleaned on K`, plus the contact sheet.
`cd` first, because agent shells keep the previous directory. Init cleans status bars and slugs the file names. View
the contact sheet, then open the strongest 8–10 screens at full size. Note demo data (test names, absurd numbers).
Put brand files in `WS/assets/brand/`.

### Step 3: Gate A, story and copy (one storyboard)

Read references/composition.md (job table, covering any app type) and references/copywriting.md. Then write
`WS/plan/plan.json`:

```json
{ "app": "Name", "audience": "who reads the listing",
  "slides": [{ "screen": "slug", "job": "promise", "headline": "Sell without the *chaos.*", "sub": "One plain line." }],
  "alternates": ["slug", "slug"] }
```

- Pick 5–7 screens that tell the story. With more than 10 screens, add the 3–6 next-best to `alternates`.
- `*word*` marks the highlighted word.

```bash
node WS/engine/studio.mjs storyboard --open
```

Show `WS/plan/storyboard.png` and ask in one AskUserQuestion call:
1. Screens: "Use these 7 screens in this order? (Recommended)" / "Swap some (say which, e.g. 4 for B)" / "Reorder".
2. Copy: "Headlines and subtitles look good (Recommended)" / "Change some" / "Give me options".
3. Audience and claims, only if they're still unconfirmed (see references/intake.md).

Loop until approved. Approved copy is locked for round 1.

### Step 4: Gate B, palettes

```bash
node WS/engine/studio.mjs palette --open
```

This reads brand colours from `WS/assets/brand/*.svg` (or the screens, or `--brand 006e50,e9fd2a`) and renders
`WS/plan/palettes.png`: 9 numbered palettes (brand-led, contrasting, neutral, two classics) with contrast ratios.
Ask (multiSelect): "Pick up to 4 palettes for round 1", with your recommended spread first (rules in
references/directions.md). "You choose" is fine.

### Step 5: Props

The user's own 3D assets first (references/props.md). Otherwise generate one pack per palette, coloured so the
prop pops on that palette:

```bash
node WS/engine/studio.mjs props --c ACCENT_HEX --c2 ffffff --accent ACCENT_HEX --prefix p1-
```

### Step 6: Round 1

```bash
node WS/engine/studio.mjs round 1
```

Build four HTML files in `WS/rounds/round-1/` from `WS/templates/starter.html`. Each is a different archetype
(references/directions.md) with a different chosen palette (paste its `css` line), using the approved plan.json
screens and copy. Read references/design-taste.md first. Then:

```bash
node WS/engine/studio.mjs render WS/rounds/round-1 --open
```

Expected: `✓ …: 7 slides → out/NAME/` per file, plus `rounds/round-1/overview.png`. `!` lines are copy warnings.

### Step 7: Self-review, present, pick

Open every `out/*/NN.png` at full size and run the composition.md checklist. Fix and re-render until clean.
Then show `overview.png`. Rank the directions, one line each: archetype, palette and why. Ask which direction to
continue. Also ask what they love or hate in the others.

### Step 8: Refinement rounds

For each batch of feedback, ask: "New round folder (round-N+1), or update round-N in place?"
- New: `studio.mjs round N+1 --from WS/rounds/round-N`, then edit there. Same: edit in place, and keep doing so
  until told otherwise.
- Apply exactly the named changes, self-review, render, present. Offer copy, badge and stat wording as 3–5 choices.

### Step 9: Generate the store set

When the user says generate or lock:

```bash
node WS/engine/studio.mjs final WS/rounds/round-N/NAME.html --open
```

Renders iPhone 1320×2868, iPad 2048×2732, Android 1080×1920, Android tablet 1200×1920, the 1024×500 feature graphic
and `final/overview.png`. Then:
1. Restyle `final/src/feature-graphic.html` to the locked direction and palette.
2. View the overview and at least one slide per size. Tune `final/src/layout.js` if something collides
   (references/engine.md, "Resizing").
3. Re-run `studio.mjs final WS/final/src`. It ends with `✓ check passed`. Report the file list.

## Examples

**No context.** "make app store screenshots for my app" → the step 1 message; nothing else until answered.

**Link plus screens.** "Screenshots for SellBuddy. Docs: https://… Screens in ~/Desktop/sb" → read the docs, init,
pick 7 of 44 screens with 4 alternates, write the copy, show the storyboard, get approval → palettes from the logo's
green and lime, user picks Brand bold, Complement, Paper and Neighbour → four archetypes on those palettes → round 1.

**Brings a style.** "Black and orange, Anton font, here are 3 Dribbble refs" → their refs replace inspiration.md;
palettes are generated from black and orange; the four directions interpret *their* brief.

## Troubleshooting

| Error / symptom | Cause | Fix |
|---|---|---|
| `no Chromium-based browser found` | Chrome not installed | install Google Chrome, or `npx playwright install chromium` |
| `playwright-core missing` | install failed or offline | `cd WS/engine && npm install`, then `studio doctor` |
| `no studio.json above …` | command run before init or outside the project | `cd` to the project root; run init first |
| `unknown screen "…"` (storyboard) | slug typo in plan.json | copy slugs from `WS/screens/screens.js` |
| `N screens differ from WxH` | mixed devices in the folder | ask for one device size, or keep the majority |
| Two status bars, or a blank strip at the top | auto-detect missed it or over-cleaned | re-run init with `--statusbar clean` or `--statusbar keep` |
| Palettes ignore the brand colour | no SVG logo with hex fills | `studio palette --brand HEX,HEX` |
| A prop looks soft next to the UI | upscaled asset | regenerate with `&size=2400`, or ask for a bigger source |
| Blurry or missing 3D phone areas | Chrome tile limits | always render through the CLI; see references/rendering-gotchas.md |

## References

| File | Read when |
|---|---|
| references/intake.md | step 1–3: questions and resources |
| references/composition.md | gate A (job table) and every slide; holds the self-review checklist |
| references/copywriting.md | gate A, and whenever copy changes |
| references/directions.md | gate B and round 1 (palette spread, archetypes) |
| references/design-taste.md | before round 1 and before every round |
| references/inspiration.md | round 1, unless the user brought their own references |
| references/props.md | step 5 |
| references/engine.md | markup, CLI, resizing, prop generator |
| references/rendering-gotchas.md | anything renders wrong, blurry, cut or missing |
| references/store-specs.md | sizes, store rules, adding a size |
