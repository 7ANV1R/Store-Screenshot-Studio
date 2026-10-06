# Design taste

This is the **default** taste. It comes from a real client project (a white-label shopping app) with 11 review
rounds. The project went from "you made worst!" to a locked, shipped set. When a user brings their own references or brand
rules, theirs win wherever they conflict. Everything else here still applies. Every rule below exists because the client either asked for it or rejected its
opposite. Read this before every round.

## North star

Bold, high-contrast, poster-grade store screenshots that look art-directed by a studio, never templated and never
"AI made this". Each slide reads in one second at thumbnail size: one big idea, one phone, one prop, one accent.

The bar: kree8.studio app-store work (see inspiration.md). Bold colour, oversized type, real hardware, 3D props
that belong to the story.

## What won (do this)

**Colour**
- One saturated base hue for the set, plus one accent that pops hard against it, and ink for text on the accent.
  That client happened to pick cobalt `#1d4cf2` with lime `#d8ff3e`. That was *their* palette, not the rule. Every
  project starts from its own brand colours (`studio palette`) and the user chooses.
- Rhythm: one slide flips to the accent colour as its background (the "inverted" slide). One or two slides shift the
  glow position or gradient angle. Same family, never the same slide twice.
- Texture, not decoration: a faint 120px grid (5% white), one soft radial glow, film grain at 8% (overlay). Stay away from
  aurora blobs, mesh gradients and bokeh.
- When the client said "more color contrasty" they meant: stronger base saturation, brighter accent, darker ink.
  Pastel and low-contrast sets were rejected.

**Type**
- Heavy grotesk display: Bricolage Grotesque 800, `letter-spacing:-.052em`, `line-height:.93`, about 158px on the
  1320px canvas. Condensed poster caps (Anton) also landed well. Editorial sans (Geist) was acceptable.
- Headlines are 2 or 3 short lines, left aligned (centred only on a closing or trust slide).
- Highlight exactly one word per headline: a rotated accent pill (`-2.5deg`, ink text), or the last line set in the accent colour.
  Vary which treatment each slide uses.
- Subtitle: one plain sentence, Inter 500 at 48px, 38px under the headline, the same gap on every slide. The client
  noticed and asked for consistency.

**Device**
- Real iPhone Pro mockup with extruded titanium sides, buttons, Dynamic Island, a 9:41 status bar, a soft glare and
  a cast shadow. The engine's `.phone` does all of this, so never draw a flat rounded rectangle.
- Poses: flat, or a gentle three-quarter turn (`data-tilt="10,-22,8"`, or the mirror `"10,22,-8"`). Mix flat and
  turned across the set, and never put the same pose on two adjacent slides.
- The phone must be *visually* centred (centre of the projected silhouette, `data-vc`), not box-centred. A turned
  phone that is box-centred looks off. The client spotted it immediately.
- The phone may bleed off the bottom on hero and flat slides. On slides with a prop below the phone, show it whole.

**Props (3D objects)**
- At most one hero prop per slide, plus optionally one blurred, smaller copy behind for depth. The prop is a literal
  symbol of that slide's story: search gets a magnifier, product a parcel box, cart a cart, delivery a truck over a
  globe, trust a medal, and the hero a star.
- Glossy "3D icon" style (3dicons.co, CC0) or the engine's procedural models. Every prop is as sharp as the UI next
  to it. Mixed sharpness reads as cheap.
- Props hug the phone. They overlap the frame edge or a corner, and sit partly behind it or in front of it. Anchor
  each prop to a real point: the truck sits next to the order total, the box sits at the phone's lower right.

**Accent devices** (the "studio" layer: one per slide, all in the accent colour)
- Scalloped seal sticker with circular ring text and a 2-word centre ("Shop 24/7", "Built for scale"), rotated
  ±10–12°, overlapping a corner of the phone. Give the text a generous inner margin and never let the scallops hug it.
- Laurel "award" pairs holding generic, store-safe 2-line claims ("Your brand, / your app"). Keep them small, and keep
  the text large relative to the leaves.
- A big stat in a laurel on the trust slide (`40K+` / "MARKETPLACES TRUST OUR TECH"). Use only true, verifiable numbers.
- Rotated tapes (`-28.5deg`) of repeating keywords: one sharp tape crossing over the phone's bottom corner, one
  blurred tape lower and behind. The words must be about the slide (search, discover, explore).
- Lime price-tag shapes with a bolt icon, the hole end tucked *under* the phone frame, drooping naturally (−6°/−12°),
  the rear tag only a sliver.
- A 3D ribbon wrapping around the phone (behind, then in front), as a motion-graphic accent.
- Short glossy speed bars (lime 3D pills) as motion trails behind moving objects. All trails point the same way,
  in the direction of the story (phone to cart).

**Real UI pop-outs**
- Use one or two per set at most. Pick a real element, such as a CTA bar or a tracking card. Show it flat and
  raised with a soft shadow, at the same angle as the phone. Or lift it inside the phone's own 3D space (`.lift`). Never give it an extruded,
  fake-thick slab look.

**Brand**
- Use real logo and icon files only, never redrawn ones. Partner or parent brands appear as inline icons inside a
  sentence ("made by [logo] Acme, the team behind [icon] Rocket").

## What lost (never do this)

| Rejected | Do this instead |
|---|---|
| Many floating cut-outs scattered around the phone | One purposeful pop-out per slide at most, one or two per set |
| Every phone in the same orientation; repeated layouts | Alternate flat, left-turn and right-turn; vary the composition every slide |
| Dramatic "lying back" perspective, close-camera distortion, isometric | Gentle 10/±22/±8 turn, perspective 4200px per 860px phone |
| Phones split across two screenshots, repeatedly | No splits unless the client asks; then one at most |
| Dark aurora / moody night set; "website hero" cloud background set | Saturated daylight colour with high contrast |
| Lots of 3D objects to "fill" the slide | One hero prop. Empty space is fine; clutter is not |
| Random props unrelated to the slide; low-poly or low-res props | A literal story symbol, high-poly, sharp |
| Hand models holding the phone | Never. They looked fake every time |
| White-outlined "slab" product cards; extruded UI | Shaded thick cards (`data-thick`) or flat elevated crops |
| Promo or action badges where there is no deal ("12% OFF", "New In", "Saved to wishlist") | Generic accent devices (seal, tag-with-bolt, tape) |
| Em or en dashes in any copy | Periods and commas |
| Superlatives and claims nobody can verify (#1, best, award-winning) | Concrete benefits and true numbers |
| Sticker text crammed against the edge; laurel text tiny inside big leaves | Generous inner margin; small leaves, readable text |
| Glitchy layering (connector rings, slivers of a hidden element peeking out) | Simplify until every edge reads cleanly |
| Elements awkwardly chopped by the slide edge | Bleed deliberately (>50% visible), or keep fully inside |
| Trails or motion pointing different ways | One direction that follows the story |
| Dotted or dashed lines as motion paths | Glossy speed bars (`trail`) or a ribbon |

## How this kind of client works (process taste)

- Feedback arrives as numbered per-slide notes. Change exactly what was named; everything else stays pixel-identical.
  Volunteering redesigns of locked slides breaks trust ("after each round you are making shit").
- Copy decisions are the client's: offer 3–5 options as choices (multi-select when they pick several), never decide
  silently.
- Every round gets its own folder; never delete or overwrite an earlier round unless told. They compare and ask to
  restore ("restore the 4 versions").
- At review, ask: new round or update this one? Once they say "do it inside round-N", keep using that round
  until they say otherwise.
- Nudges are relative ("1x up, 0.5x left", "close to where the price is"). Read them against the element's own size
  or a named landmark in the UI, then confirm visually.
- When something is "still not sharp" or "still wrong" after a fix, measure it. Don't eyeball it again. Report the real
  cause, not a guess.
