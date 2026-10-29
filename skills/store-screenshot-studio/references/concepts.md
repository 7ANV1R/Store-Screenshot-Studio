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
5. **The reference library** in inspiration.md: the seven principles and what each top set does with colour,
   layout, 3D and proof. Download and view the 2 to 4 sets closest to this app.
6. **Fresh references.** Search for great store screenshots and posters in this category (WebSearch, or the
   user's favourite sites). Pick 3 to 6 that are outstanding, and note one idea from each.

## Writing a concept

For each of the four concepts, write a short card before you build:

- **Name**: two or three words ("Receipt tape", "Boarding pass", "Pixel arcade").
- **Big idea**: one sentence. What does the set look and feel like?
- **Visual metaphor or world**: what the slides are made of.
- **Layout system**: where the device goes, how slides connect (separate, panorama, sequence).
- **Type**: which typeface and why. Any Google font is fine.
- **Colour system**: tonal brand, clean canvas, rhythm, pastel family or dark + glow (design-taste.md), and the
  palette from `2-palettes.png` it uses.
- **Signature move**: the one thing people will remember.
- **Device treatment**: tilted phone, flat phone, landscape phone, no phone (full-bleed screen), several phones,
  a cropped close-up, or a mix.
- **3D and objects**: which slides get one, what it is (from the app's world), its look (glossy, clay, toon,
  lowpoly or photo-real) and its size (big hero or small inline). "None" is a valid answer.
- **Proof**: where the real numbers go (laurel under the slide 1 headline, a bottom band, stat tiles), if the user
  has any.

Show the four cards to the user only if they want to choose concepts before round 1. Otherwise, build.

## Making the four concepts different

- They must differ in at least **three** of: metaphor, layout system, type, colour system, device treatment, 3D
  look, energy.
- Spread the colour systems: at least one concept on the brand's own colour and at least one on a neutral canvas
  (clean white or paper), so the user sees both.
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

## Layout moves (from the reference library)

Signature moves that top sets are built around. Use one per concept, made your own.

- **Eyebrow + headline**: a small label (icon + category, a handwritten line, an uppercase brand-colour word) above
  a big headline.
- **Inline object chip**: a small icon, avatar or 3D object sitting inside the headline as part of the sentence.
- **The headline is the number**: "100K+ audiobooks", "2.7x faster" set huge, the label small.
- **Pop-out on a tinted phone**: the phone tinted in the brand colour; the one card that matters pops out in white.
- **A thread through the set**: a route, a dashed path, a connector line or a numbered trail running across slides.
- **Across the seam**: one phone, mascot or object crossing from one slide into the next.
- **Proof band**: a bottom strip or two split tiles carrying the rating and a count, each in a laurel.
- **Compare card**: "other apps" vs "with us", ticks and crosses, on the slide that sells the difference.
- **Quote slide**: five stars and one real review in the user's words.
- **Content as the art**: no phone; the app's own output (covers, cards, pills, results) enlarged and arranged
  as the slide.
- **Seam headline**: one giant word or line rotated and running across two slides.
- **How it works**: numbered headlines ("1. Find", "2. Pick", "3. Share") across a sequence of slides.
- **Poster type**: mixed widths (extended + condensed caps) or condensed all-caps that fills the width; one key
  word in the brand colour or italic.
- **Illustrated world**: the whole set lives in one drawn world (pixel art, papercut, isometric city) running
  across slides, with the phones placed inside it.
- **Real hands and real things**: a hand holding the phone or the app's subject (a car, a burger), with floating UI
  cards around it (only with photos the user owns or licenses).

## Building blocks you can use

The engine gives parts, not a style (references/engine.md):
- 3D iPhone (portrait or landscape), flat or tilted, one or many per slide
- full-bleed screens with no device, cropped close-ups, real UI pop-outs
- 3D props (generated in brand colours, or the user's own)
- stickers, laurels, tapes and seals (use only if they fit the concept)
- any HTML, CSS and SVG: illustrations, textures, paper, grain, patterns, photos the user owns

`SKILL_DIR/assets/templates/parts-demo.html` shows every part working. It is a parts reference. Do not copy its look.

## Choosing palettes

The user picks from `2-palettes.png` at gate B. If they say "you choose", the rules are:
- Every palette is already built from the brand. Never bring in an accent from outside it, and never reuse a
  colour the user liked on another project.
- No two concepts may share the same base and accent.
- At most two concepts may sit on the brand's base hue; at least one sits on a neutral canvas.
- A concept may need its own palette (a "receipt tape" concept wants paper white). That is fine. Say why.

Paste a palette's `css` line from `.studio/plan/palettes.json` into a concept's `<style>`. The parts read the variables
`--base --base2 --glow --accent --on-base --on-accent --ink`.

## Presenting round 1

One line per concept: name, big idea, palette, and why it fits this app. Rank them, strongest first.
