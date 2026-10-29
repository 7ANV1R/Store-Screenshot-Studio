# Design taste

This file has three parts:

1. **Principles.** They apply to every app, every concept and every style.
2. **Patterns to avoid**, then how to handle colour, 3D objects and proof. This is the default. The user's own
   references can override any row.
3. **One worked example.** These are the exact choices of one client. Learn from them. Do not copy them.

The taste comes from a real client project with 11 review rounds. It went from "you made worst!" to a shipped set
the client loved. When a user brings their own references or brand rules, theirs win where they conflict.

## North star

The goal is store screenshots that **pop**: eye-catching, natural, beautiful, and made for *this* app. They look
like a top studio made them. They never look templated, and they never look "AI made this".

The test: someone scrolling the store stops on your first slide. Each slide reads in one second at thumbnail size.
Second test: hide every word. If the slides still say roughly what the app does, the visual idea is strong enough.

## 1. Principles (always)

**Sell the outcome.** People want the result (calmer, fitter, paid sooner), not the feature. Slide 1 is the value
prop, and every slide reinforces the same outcome.

**One idea per slide.** One message, one focal point. Everything else supports it or goes.

**Look before read.** Find the visual hook first, then write the headline. If a slide needs its copy to be
understood, a stronger visual idea is waiting.

**Proof on the page.** Real ratings, user counts, awards, press and quotes make an app feel safe to install. Show
them small and confident (see "Proof: laurels and stats" below). Never invent one.

**Contrast you can feel.** Text, device and background must separate clearly at thumbnail size. This works with any
colour story: loud saturated colour, deep dark, or calm paper. A grey middle does not work. When a client says
"more contrasty", they mean stronger colour, a brighter accent and darker ink.

**Big, confident type.** Headlines are short and large: 2 or 3 lines. Pick a typeface with character that suits the
concept. Highlight one word, in a way that fits the concept (a pill, a colour, a marker swipe, an underline, a
sticker).

**Real things look real.** If there is a device, it must look like real hardware. Props must be as sharp as the UI.
Shadows fall in one direction. Nothing is blurry by accident.

**Meaning over decoration.** Every object must tell the slide's story. A random sparkle, blob or icon is noise. One
strong object beats five weak ones. Empty space is fine. Clutter is not.

**A set, not seven posters.** The slides share one system (type, colour, device treatment, rhythm), but no two slides
are the same. Change the composition from slide to slide. Give the set a beat, for example one inverted slide.

**Visual balance.** A turned phone is centred by how it looks, not by its box (`data-vc`). Bleeds are deliberate
(more than half visible) or not there at all. Text never touches a sticker edge.

**Humanize when it fits.** A face, a hand or a real moment catches the eye faster than another mockup. Use photos
the user owns or licenses; never fake people.

**Honest words.** Short, plain, true. No dashes. No claims nobody can check (see copywriting.md).

**The app is the hero.** Show real screens. Decoration frames the product. It never hides it.

## 2. Patterns to avoid (default)

| Avoid | Prefer |
|---|---|
| The same layout or device pose on every slide | Change composition every slide; never repeat a pose on neighbours |
| Many floating UI cut-outs around the phone | One purposeful pop-out per slide at most, one or two per set |
| Dramatic close-camera perspective that distorts the device | Gentle turns, or flat |
| Splitting one phone across two slides again and again | One deliberate panorama moment, if the concept needs it |
| Low-contrast, muddy or pastel sets with no point of focus | A clear colour story with a strong accent |
| Props added to "fill" space; props unrelated to the slide | One meaningful prop, or none |
| Low-resolution or mixed-sharpness assets; mixed 3D styles in one set | Assets at 1.3x display size or more, all equally sharp, one look per set |
| A stock "pop" accent (acid lime, volt, hot pink) that is not in the brand | Accents from the brand: its own colours, tints, white or ink |
| A 3D prop on every slide, mid-size, floating beside the phone | 3D on a few slides, either big and meaningful or small and inline |
| Fake-looking hand models holding the phone | Device alone, unless the user's references use real photography |
| Promo badges with no real deal ("12% OFF", "New In") | Devices that fit the concept |
| Glitchy layers: slivers peeking out, half-hidden shapes | Simplify until every edge reads cleanly |
| Elements chopped awkwardly by the slide edge | Bleed on purpose, or keep inside |
| Motion pointing in different directions | One direction that follows the story |
| Dotted or dashed motion lines | Speed bars, a ribbon, or real motion blur |
| Generic "AI" decoration: aurora blobs, mesh gradients, bokeh, random sparkles | Texture and objects that belong to the concept |

## Colour: from the brand, used as a system

The palettes (`studio palette`) are all built from the brand. Pick a **colour system** for each concept, not just
two hex codes. Systems that work (references/inspiration.md shows each one):

| System | How | Feels |
|---|---|---|
| Tonal brand | one hue from a deep shade to a bright tint; white type; nothing else | immersive, premium, owned |
| Clean canvas | white or light grey slides; the brand only on the key word, buttons and UI | trustworthy, modern, calm |
| Rhythm | brand slide, white slide, dark slide, repeat | energetic, editorial |
| Pastel family | each slide its own pastel, all from one family around the brand | friendly, warm, kids, lifestyle |
| Dark + glow | near-black tinted with the brand, the brand as light | night, media, focus, premium |

- The accent is the brand colour, white, or ink. A second hue comes only from the brand itself (a second logo
  colour) or from the app's own content: posters, food, photos, drawings.
- A colour the user liked on another project is not a brand colour. Never carry it over. The worked example below
  is cobalt and acid lime because that was *its* brand; another app gets its own.
- Inside one set, keep to one system. Change it between concepts.

## 3D and objects: the balance

3D is seasoning. The references use it on about a third to half of the slides, never all of them, and never as
filler.

- **Dose**: at most one 3D object per slide, and most slides have none. Big (a mascot or hero object that owns the
  slide, often cropped by the edge or crossing into the next slide) or small and inline (a chip inside the
  headline, a coin next to a number, emoji-size objects matching the UI's icons). Avoid the mid-size prop floating
  beside the phone.
- **Meaning**: the object comes from the app's world (a parcel for delivery, a coin for rewards, a microphone for
  music, the brand mascot). If it could sit on any app's slide, drop it.
- **Interaction**: it touches the content. It peeks from behind the phone, rests on a card, is held in a hand,
  presses a button, or replaces a word in the headline.
- **Style matches the concept**, one style per set (`studio model … &look=`):

| Concept mood | Look | Example |
|---|---|---|
| bold commerce, fintech, utility | `glossy`: smooth 3D-icon plastic | a shopping bag, a coin, a shield |
| calm, wellness, friendly, kids | `clay`: matte and soft | a sleepy moon, a heart |
| game, playful, gamified habits | `toon`: flat cartoon bands + ink outline | a treasure chest, gold coins |
| tech, data, geometric, crypto | `lowpoly`: faceted | a gem, a chart, a planet |
| premium, realistic, alerts and rewards | `metal`: polished gold or chrome | a gold bell, gold coins, chrome arrows |
| real-world subject (cars, food, pets, travel) | photo-real: the user's photos or licensed cut-outs | a car, a burger, a dog |
| the brand has a mascot | the mascot, always | the brand's own art |

## Proof: laurels and stats

When the user has any real proof, show it. It is one of the strongest pops in the references.

- **What counts**: press ("As featured in" + the outlets' logos on one quiet panel), App Store or Play rating and rating count, users, downloads, items or actions counted by the
  app ("10M+ steps walked"), years running, real awards (Apps we love, App of the Day), press ("Featured on …"),
  partners, research backing, and measured outcomes ("-78% doomscrolling").
- **Where**: slide 1 under or above the headline (most common), a bottom proof band, split stat tiles, or the
  closing trust slide. One or two laurels side by side, never a wall of badges.
- **How**: a laurel (`data-laurel`, `data-leaf` to match the concept) around one big number and a small label
  ("4.8" / "on App Store", "100K+" / "users"). Colour it in the concept's on-base or accent. A scalloped seal for
  a single recognition, a pill for a running count.
- **Never fake it.** No data, no laurel. Ask at intake (intake.md, question 5).

## 3. Worked example: what one client approved

A white-label shopping app. **These are that client's choices, not rules.** Use them to understand the quality
level and the level of detail. Then make something new for your app.

- **Colour**: cobalt `#1d4cf2` gradient with acid lime `#d8ff3e`, ink `#08123f`. One lime slide for rhythm. Faint
  120px grid, one soft glow, 8% film grain.
- **Type**: Bricolage Grotesque 800, about 158px, tight spacing, left aligned. One word in a rotated lime pill.
  Inter 500 subtitle at 48px, the same gap on every slide.
- **Device**: real 3D iPhone, flat or turned `10,-22,8` / `10,22,-8`, never the same pose twice in a row. Phones bleed
  off the bottom on hero slides.
- **Props**: one glossy 3D icon per slide, each a literal symbol (search: magnifier, product: parcel, cart: cart,
  delivery: truck over a clay globe, trust: medal). Each prop hugs the phone and anchors to a real point in the UI.
- **Accent devices**: scalloped seal stickers with ring text, small laurels with 2-line claims, a big true stat
  (40K+), lime keyword tapes, lime price tags with a bolt icon tucked under the frame, a 3D ribbon around the phone,
  glossy lime speed bars.
- **Pop-outs**: one real CTA bar lifted in the phone's 3D space, and one tracking card floating flat.
- **Brand**: real logo files only. Sister brands as inline icons in a sentence.

You can see the result in the repository README. A concept for another app should feel as considered as this, and
look nothing like it.

## How clients give feedback (process taste)

- Feedback arrives as numbered notes per slide. Change exactly what was named. Everything else stays the same.
  Redesigning slides nobody asked about breaks trust.
- Copy decisions belong to the client. Offer 3 to 5 options as choices. Never decide silently.
- Every round gets its own folder. Never delete or overwrite a round unless told. Clients compare old rounds and
  ask to restore them.
- At each review, ask: new round, or update this one? If they say "do it inside round N", keep doing that until
  they say otherwise.
- Nudges are relative ("1x up", "close to the price"). Measure them against the element's own size or a named point
  in the UI. Then check the render.
- When something is "still wrong" after a fix, measure it. Do not guess twice. Report the real cause.
