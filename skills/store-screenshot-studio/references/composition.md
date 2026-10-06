# Composition: the story and the slides

All sizes are on the 1320 × 2868 canvas that every slide is designed on.

## The story

The story lives in `plan/plan.json`. The user approves it on `plan/storyboard.png` before any design (gate A).

There is no fixed story. Build it from what makes **this** app worth installing:

1. **Find the hook.** What is the one reason to download? That is slide 1. The first three slides show in search
   results, so they carry the pitch.
2. **List the moments.** Which screens prove the hook? Each slide shows one thing the user gets, does or feels.
3. **Order for momentum.** Start with the promise, show the best moments, end with trust or a strong final image.
4. **Choose the count.** Use as many slides as the story needs, usually 4 to 8. Stop when the strong moments run out.

Example beats (mix, skip or replace them):

| Beat | What it shows | Example screens |
|---|---|---|
| Promise | the reason to install | home, main view, gameplay, the core result |
| Wow moment | the most impressive thing | a big result, a beautiful view, a boss fight |
| Core action | what you do every day | create, play, calculate, book, log |
| Ease | how little effort it takes | one-tap flows, smart defaults, automation |
| Depth | there is more to explore | levels, categories, themes, tools |
| Personal | it fits you | customisation, profiles, characters, colours |
| Social / proof | other people, real numbers | friends, reviews, leaderboards, true stats |
| Close | trust or a strong final image | security, offline use, awards the client owns, the brand |

**Games:** show the game, not the menus. Use action shots, characters and the world. Landscape games can use a
landscape phone or a full-bleed screen with no device. A panorama across slides suits games well.

**Small apps (a calculator, a timer):** 4 or 5 slides are enough. Make each one a strong single idea.

**Weak screens** (forms, settings, long text): use them only if the moment matters ("start in a minute"). Crop
hard, or lift the one meaningful card and let the concept carry the slide. Skip screens that are mostly text.

**Demo data** (test names, impossible numbers, personal links): raise it at intake. A new capture with clean data
is best. If that is not possible, edit the copy in `store-screenshots/screens/SLUG.png` (the original files stay
untouched). Paint over the area with the colour around it, or blur it. Tell the user which screens you edited.

**No true number?** Do not fake a stat (no "0 …", no "100%"). End with another strong idea.

## Devices

Pick the device treatment from the concept, not from habit.

| Treatment | How (references/engine.md) | Good for |
|---|---|---|
| Flat phone | `.phone` with no tilt | calm, readable UI |
| Turned phone | `data-tilt="10,-22,8"` or `"10,22,-8"`, plus `data-vc` | depth and energy |
| Landscape phone | landscape screens turn the phone automatically | games, video, maps |
| No device | the screen as a rounded card, or full-bleed | games, photo and media apps, bold poster ideas |
| Close-up | a big phone (1200–1500px) cropped hard | beautiful UI details |
| Several devices | two or three phones in one slide | comparisons, before and after, flows |
| Panorama | one phone or scene across two slides | worlds, timelines, journeys |

Pose rules for turned phones: never turn more than about 25° in Y. Scale perspective with size (4200px for an
860px-wide phone). Never repeat the same pose on two neighbouring slides.

## Starting values (change them freely)

These sizes worked in the worked example. Use them as a starting point, then design.

- Portrait phone width: 840–1060px. Landscape phone `data-w` (its short side): 480–620px. A landscape phone can
  also go big and bleed off both side edges when the gameplay is the hero.
- Headline: 120–250px depending on the typeface. Subtitle: 40–52px. Keep the gap the same on every slide.
- Keep about 6–9% of the slide height between the copy and the device.
- Hero prop: 300–550px, rotated a little, overlapping the device edge.
- Sticker or seal: 280–340px, with a generous inner margin around its text.

## Making a slide bold without making it messy

Pick one bold move per slide and commit to it: an oversized object, an inverted colour, a panorama, a huge number,
a dramatic crop. Two bold moves fight each other. If a slide feels empty, make the main element bigger before
you add anything.

## Self-review checklist

Run this on every rendered PNG at full size before you show anything.

- [ ] One-second read: the headline is readable at 20% size and there is one clear focal point
- [ ] The concept is clear on every slide, and the four concepts look clearly different from each other
- [ ] It does not look like a recolour of the worked example in design-taste.md (unless the user asked for that)
- [ ] Turned phones look centred; no two neighbouring slides share a pose
- [ ] Nothing is chopped awkwardly; bleeds are deliberate
- [ ] Text never collides with the device or props; sticker text has room
- [ ] All assets are equally sharp; shadows fall the same way
- [ ] `studio check` passes: no dashes, no claims nobody can check, no repeated highlight word
- [ ] The words speak to the real reader (intake question 1)
