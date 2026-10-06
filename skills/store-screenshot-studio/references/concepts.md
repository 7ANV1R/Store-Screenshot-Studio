# Concepts: four different ideas, made for this app

Every project gets its **own** concepts. Never ship a house style. Two different apps must never get look-alike
sets, and two concepts in the same round must never look alike.

A concept is not a colour swap or a font swap. It is a **big visual idea** that grows out of the app's world, the
brand and the references.

## Where ideas come from

Look in this order. Write down what you find before you design.

1. **The user's references.** If they shared any, these lead. Find what they have in common: mood, colour, type,
   composition, energy.
2. **The app's own world.** What objects, places, materials, rituals and feelings belong to this app? A travel
   app has tickets, stamps, maps and window seats. A calculator has receipt tape, big numerals and the click of keys.
   A game has its characters, its world and its loot.
3. **The brand.** Logo shape, colours, mascot, tone of voice.
4. **The audience.** What do they love? What does a great store page look like *to them*?
5. **Fresh references.** Search for great store screenshots and posters in this category (WebSearch, or the
   user's favourite sites). Pick 3 to 6 that are outstanding, and note one idea from each.
6. **The default board** in inspiration.md, only when nothing above gives enough.

## Writing a concept

For each of the four concepts, write a short card before you build:

- **Name**: two or three words ("Receipt tape", "Boarding pass", "Pixel arcade").
- **Big idea**: one sentence. What does the set look and feel like?
- **Visual metaphor or world**: what the slides are made of.
- **Layout system**: where the device goes, how slides connect (separate, panorama, sequence).
- **Type**: which typeface and why. Any Google font is fine.
- **Palette**: one from `plan/palettes.png`, or one the concept needs.
- **Signature move**: the one thing people will remember.
- **Device treatment**: tilted phone, flat phone, landscape phone, no phone (full-bleed screen), several phones,
  a cropped close-up, or a mix.

Show the four cards to the user only if they want to choose concepts before round 1. Otherwise, build.

## Making the four concepts different

- They must differ in at least **three** of: metaphor, layout system, type, palette, device treatment, energy.
- **At least two** concepts must come straight from the app's own world (step 2 above), not from a generic
  style.
- At most one concept may be a "proven" style (bold type with a highlight pill and stickers, the style of the worked
  example in design-taste.md).
- **Freshness check**: compare each concept with the worked example in design-taste.md. If it would look like a
  recolour of that example, rethink it, unless the user asked for that look.
- Range of energy: try to cover loud, playful, premium-calm and surprising.

## Sparks (starting points, not a menu)

Use these to start thinking. Change them, combine them, or ignore them.

| App world | Possible concepts |
|---|---|
| Travel | boarding passes and luggage tags, postcards with stamps, an endless map panorama, golden-hour photo frames |
| Calculator / utility | receipt tape with giant numerals, engineering blueprint grid, LCD retro display, tactile keycaps in 3D |
| Game | characters bursting out of the frame, a world map panorama across all slides, arcade cabinet, collectible cards |
| Fitness / health | bold sports-poster type, heart-rate line running through the set, morning-light calm, before and after |
| Food / delivery | top-down table scene, menu-board chalk, ingredient flat-lay, steam and warm light |
| Finance | clean ledger paper, coins and growth stacked as 3D objects, calm vault-dark premium, a single number hero |
| Education / kids | sticker book, chalkboard, notebook doodles, big friendly mascot |
| Music / media | album-cover grid, vinyl and sleeves, neon stage, waveform running across slides |
| Social / dating | chat bubbles as the layout, photo booth strips, polaroid wall, warm hand-written notes |
| Productivity | calm paper and ink, sticky notes, a desk from above, a single focused task per slide |
| Shopping / marketplace | bold retail poster, product flat-lays, shopping-bag props, price-tag stickers |

## Building blocks you can use

The engine gives parts, not a style (references/engine.md):
- 3D iPhone (portrait or landscape), flat or tilted, one or many per slide
- full-bleed screens with no device, cropped close-ups, real UI pop-outs
- 3D props (generated in brand colours, or the user's own)
- stickers, laurels, tapes and seals (use only if they fit the concept)
- any HTML, CSS and SVG: illustrations, textures, paper, grain, patterns, photos the user owns

`templates/parts-demo.html` shows every part working. It is a parts reference. Do not copy its look.

## Choosing palettes

The user picks from `plan/palettes.png` at gate B. If they say "you choose", the rules are:
- Include their own brand colours at least once.
- No two concepts may share the same base and accent.
- At most two concepts may sit on the brand's base hue.
- A concept may need its own palette (a "receipt tape" concept wants paper white). That is fine. Say why.

Paste a palette's `css` line from `plan/palettes.json` into a concept's `<style>`. The parts read the variables
`--base --base2 --glow --accent --on-base --on-accent --ink`.

## Presenting round 1

One line per concept: name, big idea, palette, and why it fits this app. Rank them, strongest first.
